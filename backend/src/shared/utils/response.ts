/**
 * Utilidades para responses HTTP
 */

export const jsonResponse = (body: unknown, status: number = 200): Response =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

export const textResponse = (
    body: string,
    status: number = 200,
    headers: Record<string, string> = {},
): Response =>
    new Response(body, {
        status,
        headers: { "Content-Type": "text/plain", ...headers },
    });

export const noContentResponse = (): Response =>
    new Response(null, { status: 204 });

export const errorResponse = (error: string, status: number = 500): Response =>
    jsonResponse({ error }, status);