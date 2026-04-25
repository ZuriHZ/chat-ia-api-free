import { sql } from "../config/db";

const jsonResponse = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const parsePositiveId = (value: string, fieldName: string) => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new Error(`${fieldName} debe ser un numero entero positivo`);
    }

    return parsedValue;
};

// GET /api/messages - Obtener todo el historial
export const getMessages = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const conversationIdParam = url.searchParams.get("conversationId");
        const conversationId = conversationIdParam
            ? parsePositiveId(conversationIdParam, "conversationId")
            : null;

        const messages =
            conversationId !== null
                ? await sql`
                    SELECT * FROM chat_messages
                    WHERE conversation_id = ${conversationId}
                    ORDER BY created_at ASC, id ASC
                `
                : await sql`SELECT * FROM chat_messages ORDER BY created_at ASC, id ASC`;

        return jsonResponse(messages, 200);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        const status = errorMessage.includes("conversationId") ? 400 : 500;
        return jsonResponse({ error: errorMessage }, status);
    }
};

// POST /api/messages - Guardar un nuevo mensaje en el historial
export const createMessage = async (req: Request) => {
    try {
        const body = (await req.json()) as {
            role?: string;
            content?: string;
            conversationId?: number | string | null;
        };
        const { role, content } = body;
        const conversationId =
            body.conversationId !== undefined && body.conversationId !== null
                ? parsePositiveId(String(body.conversationId), "conversationId")
                : null;

        if (!role || !content) {
            return jsonResponse({ error: "Se requiere 'role' y 'content'" }, 400);
        }

        // Usamos template strings naticos de Bun SQL para inyectar seguro (evita SQL injection)
        const result = await sql`
            INSERT INTO chat_messages (conversation_id, role, content) 
            VALUES (${conversationId}, ${role}, ${content}) 
            RETURNING *
        `;

        return jsonResponse(result[0], 201);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        const status = errorMessage.includes("conversationId") ? 400 : 500;
        return jsonResponse({ error: errorMessage }, status);
    }
};

// DELETE /api/messages/:id - Borrar un mensaje
export const deleteMessage = async (req: Request, id: string) => {
    try {
        const messageId = parsePositiveId(id, "messageId");
        await sql`DELETE FROM chat_messages WHERE id = ${messageId}`;
        return new Response(null, { status: 204 });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        const status = errorMessage.includes("messageId") ? 400 : 500;
        return jsonResponse({ error: errorMessage }, status);
    }
};
