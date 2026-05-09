import { OpenRouter } from "@openrouter/sdk";
import { AVAILABLE_MODELS } from "../config/models";
import { sql } from "../config/db";

const CHAT_ROLE = {
    USER: "user",
    AI: "ai",
} as const;

type ChatRole = (typeof CHAT_ROLE)[keyof typeof CHAT_ROLE];

interface ChatRequestBody {
    message?: string;
    model?: string;
    conversationId?: number | string;
    persistUserMessage?: boolean;
}

interface ChatHistoryRow {
    role: string;
    content: string;
}

interface ChatApiMessage {
    role: "user" | "assistant";
    content: string;
}

interface ChatCompletionChunk {
    choices?: Array<{
        delta?: {
            content?: string | null;
        };
    }>;
}

const OPENROUTER_AUTH_ERROR_PATTERNS = [
    "user not found",
    "no auth credentials found",
    "invalid api key",
    "unauthorized",
    "401",
];

// Modelos que sabemos que ya no son gratuitos — se ignoran al inicio
const KNOWN_PAID_MODELS = [
    "tencent/hy3-preview",
    "inclusionai/ling-2.6-1t",
    "meta-llama/llama-3.3-70b",
];

// Patrones de error que indican modelo ya no es gratuito
const MODEL_PAID_PATTERNS = [
    "no longer available as a free model",
    "is now a paid model",
    "no longer free",
    "premium",
];

// Initialize the OpenRouter SDK
const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
    httpReferer: "http://localhost:3000",
    xTitle: "API-Bun-Chat",
});

const jsonResponse = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const isOpenRouterAuthError = (error: unknown): boolean => {
    if (!(error instanceof Error)) {
        return false;
    }

    const message = error.message.toLowerCase();

    return OPENROUTER_AUTH_ERROR_PATTERNS.some((pattern) =>
        message.includes(pattern),
    );
};

const isModelPaidError = (error: unknown): boolean => {
    if (!(error instanceof Error)) {
        return false;
    }

    const message = error.message.toLowerCase();
    return MODEL_PAID_PATTERNS.some((pattern) =>
        message.includes(pattern.toLowerCase()),
    );
};

const normalizeConversationId = (
    conversationId: number | string | undefined,
): number | null => {
    if (conversationId === undefined) {
        return null;
    }

    const normalized = Number(conversationId);

    if (Number.isNaN(normalized) || normalized <= 0) {
        throw new Error(
            'The "conversationId" field must be a valid positive number',
        );
    }

    return normalized;
};

const mapStoredRoleToApiRole = (
    role: string,
): ChatApiMessage["role"] | null => {
    if (role === CHAT_ROLE.USER) {
        return "user";
    }

    if (role === CHAT_ROLE.AI) {
        return "assistant";
    }

    return null;
};

const getConversationMessages = async (
    conversationId: number,
): Promise<ChatApiMessage[]> => {
    const rows = await sql<ChatHistoryRow[]>`
        SELECT role, content
        FROM chat_messages
        WHERE conversation_id = ${conversationId}
        ORDER BY created_at ASC, id ASC
    `;

    return rows
        .map((row) => ({
            role: mapStoredRoleToApiRole(row.role),
            content: row.content,
        }))
        .filter(
            (
                row,
            ): row is {
                role: ChatApiMessage["role"];
                content: string;
            } => row.role !== null,
        );
};

const shouldSkipUserInsert = async (
    conversationId: number | null,
    userMessage: string,
): Promise<boolean> => {
    if (conversationId === null) {
        return false;
    }

    const lastMessages = await sql<
        Array<{ role: string; content: string; created_at: string }>
    >`
        SELECT role, content, created_at
        FROM chat_messages
        WHERE conversation_id = ${conversationId}
        ORDER BY created_at DESC, id DESC
        LIMIT 2
    `;

    const [latestMessage, previousMessage] = lastMessages;

    if (
        latestMessage?.role !== CHAT_ROLE.USER ||
        latestMessage.content !== userMessage
    ) {
        return false;
    }

    if (previousMessage?.role === CHAT_ROLE.AI) {
        return false;
    }

    return true;
};

// Función para limpiar duplicados de la lista de modelos
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
};

export const handleChat = async (req: Request): Promise<Response> => {
    try {
        let body: ChatRequestBody;
        try {
            body = (await req.json()) as ChatRequestBody;
        } catch {
            return jsonResponse(
                {
                    error: "Invalid JSON or empty body received",
                },
                400,
            );
        }
        const userMessage = body?.message;
        const shouldPersistUserMessage = body?.persistUserMessage !== false;

        if (!userMessage) {
            return jsonResponse(
                {
                    error: 'The "message" field is required in the body',
                },
                400,
            );
        }

        let conversationId: number | null;
        try {
            conversationId = normalizeConversationId(body?.conversationId);
        } catch (error) {
            return jsonResponse(
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : "Invalid conversationId",
                },
                400,
            );
        }

        const shouldPersistCurrentUserMessage =
            shouldPersistUserMessage &&
            !(await shouldSkipUserInsert(conversationId, userMessage));

        if (shouldPersistCurrentUserMessage) {
            try {
                await sql`INSERT INTO chat_messages (conversation_id, role, content) VALUES (${conversationId}, ${CHAT_ROLE.USER}, ${userMessage})`;
            } catch (dbErr: unknown) {
                console.error(
                    "[DB] Error al guardar mensaje de usuario:",
                    dbErr instanceof Error ? dbErr.message : dbErr,
                );
            }
        }

        const messageHistory: ChatApiMessage[] =
            conversationId !== null
                ? await getConversationMessages(conversationId)
                : [{ role: "user", content: userMessage }];

        const historyWithCurrentMessage: ChatApiMessage[] =
            conversationId !== null &&
            !messageHistory.some(
                (message, index) =>
                    index === messageHistory.length - 1 &&
                    message.role === "user" &&
                    message.content === userMessage,
            )
                ? [...messageHistory, { role: "user", content: userMessage }]
                : messageHistory;

        // Lista de modelos únicos y mezclados para reintentos
        const allModelIds = AVAILABLE_MODELS.map((m) => m.id);
        const uniqueModels = [...new Set(allModelIds)];
        const shuffledModels = shuffleArray(uniqueModels);

        // Filtrar modelos que sabemos que ya no son gratuitos
        const filteredModels = shuffledModels.filter(
            (model) => !KNOWN_PAID_MODELS.some((paid) => model.includes(paid))
        );

        let completion: AsyncIterable<ChatCompletionChunk> | null = null;
        let attempts = 0;
        let finalError: unknown = null;
        let lastErrorMessage = "";
        const attemptedModels: string[] = [];
        const failedModels: { model: string; reason: string }[] = [];

        // Siempre mezclamos los modelos para tener fallback
        const modelsToTry = body.model
            ? [body.model, ...filteredModels.filter((m) => m !== body.model)]
            : filteredModels;

        const maxAttempts = modelsToTry.length;
        let modelToUse: string | undefined;

        while (attempts < maxAttempts) {
            modelToUse = modelsToTry[attempts];

            if (!modelToUse) {
                break;
            }

            attemptedModels.push(modelToUse);

            try {
                completion = await openRouter.chat.send({
                    chatGenerationParams: {
                        model: modelToUse,
                        messages: historyWithCurrentMessage,
                        stream: true,
                    },
                });
                break; // Salió bien
            } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : String(err);

                failedModels.push({ model: modelToUse, reason: errorMsg });
                finalError = err;
                lastErrorMessage = errorMsg;

                if (isOpenRouterAuthError(err)) {
                    console.error(
                        "[API] Error de autenticación con OpenRouter. Se cancelan reintentos.",
                    );
                    break;
                }

                // Si el modelo ahora es pago, no seguir intentándolo
                if (isModelPaidError(err)) {
                    console.log(`[API] Saltando ${modelToUse} - ya no es gratuito`);
                }

                attempts++;
            }
        }

        // Si no se pudo completar, devolvemos error claro
        if (!completion) {
            console.error(
                "[API] Todos los modelos fallaron:",
                attemptedModels.join(", "),
            );
            const hasAuthError = isOpenRouterAuthError(finalError);
            const isPaidModelError = isModelPaidError(finalError);

            // Mensaje amigable para el usuario
            let userMessage = "Lo sentimos, en este momento ninguno de los modelos disponibles está respondiendo. Por favor, intenta de nuevo en unos minutos.";
            if (isPaidModelError) {
                userMessage = "Uno de los modelos seleccionados ya no es gratuito. Por favor, selecciona otro modelo e intenta de nuevo.";
            } else if (hasAuthError) {
                userMessage = "Error de conexión con el servicio de IA. Por favor, contacta al administrador.";
            }

            return jsonResponse(
                {
                    error: userMessage,
                    code: hasAuthError ? "AUTH_ERROR" : isPaidModelError ? "MODEL_PAID" : "ALL_MODELS_FAILED",
                    detail: lastErrorMessage,
                    attemptedModels,
                    failedModels,
                },
                hasAuthError ? 500 : isPaidModelError ? 402 : 503,
            );
        }

        // Stream exitoso
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let fullAiResponse = "";
                    for await (const chunk of completion) {
                        const content =
                            chunk.choices?.[0]?.delta?.content || "";
                        if (content) {
                            fullAiResponse += content;
                            controller.enqueue(
                                new TextEncoder().encode(content),
                            );
                        }
                    }

                    try {
                        if (fullAiResponse.trim()) {
                            await sql`INSERT INTO chat_messages (conversation_id, role, content) VALUES (${conversationId}, ${CHAT_ROLE.AI}, ${fullAiResponse})`;
                        }
                    } catch (dbErr: unknown) {
                        console.error(
                            "[DB] Error al guardar respuesta de IA:",
                            dbErr instanceof Error ? dbErr.message : dbErr,
                        );
                    }

                    controller.close();
                } catch (error) {
                    console.error("Error en streaming:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                "X-Conversation-Id": conversationId?.toString() ?? "",
                "X-Model-Used": modelToUse ?? "",
            },
        });
    } catch (error: unknown) {
        console.error("Error during chat request:", error);

        return jsonResponse(
            {
                error: "Unexpected error during chat request",
                detail:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500,
        );
    }
};
