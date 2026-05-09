/**
 * Utilidades para CORS
 */

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const withCors = (response: Response): Response => {
    const headers = new Headers(response.headers);

    Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};

export const corsPreflightResponse = (): Response =>
    new Response(null, { status: 204, headers: corsHeaders });