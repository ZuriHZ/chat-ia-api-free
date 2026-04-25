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

// --- USERS ---
export const getUsers = async (req: Request) => {
    try {
        const users = await sql`SELECT * FROM users ORDER BY id DESC`;
        return jsonResponse(users, 200);
    } catch (e: unknown) {
        return jsonResponse(
            { error: e instanceof Error ? e.message : "Unknown error" },
            500,
        );
    }
};

export const createUser = async (req: Request) => {
    try {
        const randomName = "TestUser_" + Math.random().toString(36).substring(7);
        const randomEmail = randomName.toLowerCase() + "@test.com";

        const result = await sql`INSERT INTO users (username, email) VALUES (${randomName}, ${randomEmail}) RETURNING *`;
        return jsonResponse(result[0], 201);
    } catch (e: unknown) {
        return jsonResponse(
            { error: e instanceof Error ? e.message : "Unknown error" },
            500,
        );
    }
};

export const deleteUser = async (req: Request, id: string) => {
    try {
        const userId = parsePositiveId(id, "userId");
        await sql`DELETE FROM users WHERE id = ${userId}`;
        return new Response(null, { status: 204 });
    } catch (e: unknown) {
        const errorMessage =
            e instanceof Error ? e.message : "Unknown error";
        return jsonResponse(
            { error: errorMessage },
            errorMessage.includes("userId") ? 400 : 500,
        );
    }
};

// --- CONVERSATIONS ---
export const getConversations = async (req: Request) => {
    try {
        const convos = await sql`SELECT * FROM conversations ORDER BY id DESC`;
        return jsonResponse(convos, 200);
    } catch (e: unknown) {
        return jsonResponse(
            { error: e instanceof Error ? e.message : "Unknown error" },
            500,
        );
    }
};

export const getConversationById = async (req: Request, id: string) => {
    try {
        const conversationId = parsePositiveId(id, "conversationId");
        const conversation = await sql`
            SELECT * FROM conversations WHERE id = ${conversationId}
        `;

        if (conversation.length === 0) {
            return jsonResponse({ error: "Not Found" }, 404);
        }

        return jsonResponse(conversation[0], 200);
    } catch (e: unknown) {
        const errorMessage =
            e instanceof Error ? e.message : "Unknown error";
        return jsonResponse(
            { error: errorMessage },
            errorMessage.includes("conversationId") ? 400 : 500,
        );
    }
};

export const createConversation = async (req: Request) => {
    try {
        const body = (await req.json().catch(() => ({}))) as {
            title?: string;
            userId?: number | string | null;
        };
        const title =
            body.title?.trim() ||
            "Nueva Conversación " + new Date().toLocaleTimeString();
        const userId =
            body.userId !== undefined && body.userId !== null
                ? Number(body.userId)
                : null;

        if (userId !== null && (Number.isNaN(userId) || userId <= 0)) {
            return new Response(
                JSON.stringify({ error: "userId debe ser un numero positivo" }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }

        const result = await sql`
            INSERT INTO conversations (user_id, title)
            VALUES (${userId}, ${title})
            RETURNING *
        `;
        return jsonResponse(result[0], 201);
    } catch (e: unknown) {
        const errorMessage =
            e instanceof Error ? e.message : "Unknown error";
        return jsonResponse(
            { error: errorMessage },
            errorMessage.includes("userId") ? 400 : 500,
        );
    }
};

export const deleteConversation = async (req: Request, id: string) => {
    try {
        const conversationId = parsePositiveId(id, "conversationId");
        await sql`DELETE FROM chat_messages WHERE conversation_id = ${conversationId}`;
        await sql`DELETE FROM conversations WHERE id = ${conversationId}`;
        return new Response(null, { status: 204 });
    } catch (e: unknown) {
        const errorMessage =
            e instanceof Error ? e.message : "Unknown error";
        return jsonResponse(
            { error: errorMessage },
            errorMessage.includes("conversationId") ? 400 : 500,
        );
    }
};

// --- SINGLE MESSAGE GET ---
export const getMessageById = async (req: Request, id: string) => {
    try {
        const messageId = parsePositiveId(id, "messageId");
        const msg = await sql`SELECT * FROM chat_messages WHERE id = ${messageId}`;
        if (msg.length === 0) return jsonResponse({ error: "Not Found" }, 404);
        return jsonResponse(msg[0], 200);
    } catch (e: unknown) {
        const errorMessage =
            e instanceof Error ? e.message : "Unknown error";
        return jsonResponse(
            { error: errorMessage },
            errorMessage.includes("messageId") ? 400 : 500,
        );
    }
};
