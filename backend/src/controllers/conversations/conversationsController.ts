/**
 * Controller para Conversations
 */

import { sql } from "../../../config/db";
import { jsonResponse, errorResponse } from "../../shared/utils";
import { parseOptionalPositiveId, parseJSON } from "../../shared/utils/validation";

interface CreateConversationBody {
    title?: string;
    userId?: number | string | null;
}

export const getConversations = async (): Promise<Response> => {
    try {
        const convos = await sql`SELECT * FROM conversations ORDER BY id DESC`;
        return jsonResponse(convos, 200);
    } catch (e: unknown) {
        return errorResponse(e instanceof Error ? e.message : "Unknown error", 500);
    }
};

export const getConversationById = async (id: number): Promise<Response> => {
    try {
        const conversation = await sql`
            SELECT * FROM conversations WHERE id = ${id}
        `;

        if (conversation.length === 0) {
            return errorResponse("Not Found", 404);
        }

        return jsonResponse(conversation[0], 200);
    } catch (e: unknown) {
        return errorResponse(e instanceof Error ? e.message : "Unknown error", 500);
    }
};

export const createConversation = async (req: Request): Promise<Response> => {
    try {
        const body = (await parseJSON<CreateConversationBody>(req)) as CreateConversationBody | null;
        const title =
            body?.title?.trim() ||
            "Nueva Conversación " + new Date().toLocaleTimeString();
        const userId = body?.userId !== undefined && body?.userId !== null
            ? parseOptionalPositiveId(String(body.userId), "userId")
            : null;

        if (userId !== null && userId <= 0) {
            return errorResponse("userId debe ser un numero positivo", 400);
        }

        const result = await sql`
            INSERT INTO conversations (user_id, title)
            VALUES (${userId}, ${title})
            RETURNING *
        `;
        return jsonResponse(result[0], 201);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        return errorResponse(errorMessage, 500);
    }
};

export const deleteConversation = async (id: number): Promise<Response> => {
    try {
        await sql`DELETE FROM chat_messages WHERE conversation_id = ${id}`;
        await sql`DELETE FROM conversations WHERE id = ${id}`;
        return new Response(null, { status: 204 });
    } catch (e: unknown) {
        return errorResponse(e instanceof Error ? e.message : "Unknown error", 500);
    }
};