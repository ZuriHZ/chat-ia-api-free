/**
 * Controller para Users
 */

import { sql } from "../../../config/db";
import { jsonResponse, errorResponse } from "../../shared/utils";

export const getUsers = async (): Promise<Response> => {
    try {
        const users = await sql`SELECT * FROM users ORDER BY id DESC`;
        return jsonResponse(users, 200);
    } catch (e: unknown) {
        return errorResponse(e instanceof Error ? e.message : "Unknown error", 500);
    }
};

export const createUser = async (): Promise<Response> => {
    try {
        const randomName = "TestUser_" + Math.random().toString(36).substring(7);
        const randomEmail = randomName.toLowerCase() + "@test.com";

        const result = await sql`
            INSERT INTO users (username, email) VALUES (${randomName}, ${randomEmail}) RETURNING *
        `;
        return jsonResponse(result[0], 201);
    } catch (e: unknown) {
        return errorResponse(e instanceof Error ? e.message : "Unknown error", 500);
    }
};

export const deleteUser = async (id: number): Promise<Response> => {
    try {
        await sql`DELETE FROM users WHERE id = ${id}`;
        return new Response(null, { status: 204 });
    } catch (e: unknown) {
        return errorResponse(e instanceof Error ? e.message : "Unknown error", 500);
    }
};