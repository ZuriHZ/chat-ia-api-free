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

// Initialize the OpenRouter SDK
const openRouter = new OpenRouter({
    // Fallback to empty string if missing, though it requires api key
    apiKey: process.env.OPENROUTER_API_KEY || "",
    httpReferer: "http://localhost:3000", // Optional, adjust based on your site
    xTitle: "API-Bun-Chat", // Optional, name of your app
});

const jsonResponse = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

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

const mapStoredRoleToApiRole = (role: string): ChatApiMessage["role"] | null => {
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

export const handleChat = async (req: Request): Promise<Response> => {
    try {
        // We expect the request body to contain the user "message" and optionally a "model".
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

        // Guardamos el mensaje del usuario al instante en la base de datos local
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

        // Array de IDs de modelos configurados centralmente en config/models.ts
        const freeModels = AVAILABLE_MODELS.map((m) => m.id);

        let completion: AsyncIterable<ChatCompletionChunk> | null = null;
        let modelToUse = body.model;
        let attempts = 0;
        let finalError: unknown = null;

        // Si falla un modelo (p.ej. fue retirado y da 404), reintentamos hasta 15 veces con otro
        while (attempts < 15) {
            modelToUse =
                body.model ||
                freeModels[Math.floor(Math.random() * freeModels.length)];
            console.log(
                `[API] Intento ${attempts + 1}... Asignado: ${modelToUse}`,
            );

            try {
                completion = await openRouter.chat.send({
                    chatGenerationParams: {
                        model: modelToUse,
                        messages: historyWithCurrentMessage,
                        stream: true,
                    },
                });
                break; // Salió bien, rompemos el ciclo
            } catch (err: unknown) {
                console.error(
                    `[API] El modelo ${modelToUse} falló:`,
                    err instanceof Error ? err.message : err,
                );
                finalError = err;

                // Si el usuario especificó un modelo estricto, no iteramos over fallbacks
                if (body.model) break;
                attempts++;
            }
        }

        if (!completion) {
            return jsonResponse(
                {
                    error: "No se pudo obtener respuesta del proveedor de IA",
                    detail:
                        finalError instanceof Error
                            ? finalError.message
                            : "Todos los intentos con modelos gratuitos fallaron.",
                },
                502,
            );
        }

        // Creamos un stream legible (ReadableStream) nativo
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let fullAiResponse = "";
                    // completion es un EventStream, lo recorremos asíncronamente
                    for await (const chunk of completion) {
                        // Extraemos la parte de texto de cada "trocito"
                        const content =
                            chunk.choices?.[0]?.delta?.content || "";
                        if (content) {
                            fullAiResponse += content;
                            // Codificamos y enviamos el trocito al cliente
                            controller.enqueue(
                                new TextEncoder().encode(content),
                            );
                        }
                    }

                    // Al terminar de streamear, guardamos la respuesta entera de la IA en DB
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
                detail: error instanceof Error ? error.message : "Unknown error",
            },
            500,
        );
    }
};
