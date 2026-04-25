import { SQL } from "bun";

// Lee la variable de entorno y por defecto la apuntamos a PostgreSQL
const dbUrl = process.env.DATABASE_URL;

export const sql = new SQL(dbUrl!);

// Función ultra rápida para asegurar que la tabla exista
export async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                title VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                conversation_id INTEGER NULL,
                role VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log(
            "[DB] ✅ Conectado exitosamente. Tablas generadas con Bun SQL nativo.",
        );
    } catch (error: any) {
        console.error("[DB Error] Error inicializando tablas:", error.message);
    }
}
