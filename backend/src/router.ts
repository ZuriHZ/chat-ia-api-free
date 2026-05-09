/**
 * Router central para la API
 * Maneja todas las rutas HTTP de forma centralizada
 */

import { handleChat } from "../controllers/chatController";
import { getMessages, createMessage, deleteMessage, getMessageById } from "../controllers/messagesController";
import { getConversations, getConversationById, createConversation, deleteConversation } from "./controllers/conversations";
import { getUsers, createUser, deleteUser } from "./controllers/users";
import { AVAILABLE_MODELS } from "../config/models";
import { withCors, jsonResponse, noContentResponse } from "./shared/utils";
import { parsePositiveId } from "./shared/utils/validation";

// Tipo para handler de ruta
type RouteHandler = (req: Request) => Promise<Response> | Response;

// Definición de rutas
interface Route {
    path: string;
    method: string;
    handler: RouteHandler;
}

// Todas las rutas de la API
const routes: Route[] = [
    // --- Health & Info ---
    { path: "/", method: "GET", handler: () => jsonResponse({ status: "ok", message: "API funcionando correctamente" }) },
    { path: "/health", method: "GET", handler: () => jsonResponse({ status: "ok", message: "Health check passed" }) },
    { path: "/models", method: "GET", handler: () => jsonResponse(AVAILABLE_MODELS) },

    // --- Chat (OpenRouter) ---
    { path: "/api/chat", method: "POST", handler: handleChat },

    // --- Users ---
    { path: "/api/users", method: "GET", handler: () => getUsers() },
    { path: "/api/users", method: "POST", handler: () => createUser() },
    { path: "/api/users/:id", method: "DELETE", handler: (req) => deleteUserById(req) },

    // --- Conversations ---
    { path: "/api/conversations", method: "GET", handler: () => getConversations() },
    { path: "/api/conversations", method: "POST", handler: createConversation },
    { path: "/api/conversations/:id", method: "GET", handler: (req) => getConversationByIdReq(req) },
    { path: "/api/conversations/:id", method: "DELETE", handler: (req) => deleteConversationById(req) },

    // --- Messages ---
    { path: "/api/messages", method: "GET", handler: getMessages },
    { path: "/api/messages", method: "POST", handler: createMessage },
    { path: "/api/messages/:id", method: "GET", handler: (req) => getMessageByIdReq(req) },
    { path: "/api/messages/:id", method: "DELETE", handler: (req) => deleteMessageById(req) },
];

// Helpers para extraer ID de la URL
const getIdFromUrl = (url: URL): number | null => {
    const parts = url.pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (!lastPart || isNaN(Number(lastPart))) return null;
    return parsePositiveId(lastPart, "ID");
};

const deleteUserById = async (req: Request): Promise<Response> => {
    const id = getIdFromUrl(new URL(req.url));
    if (id === null) return jsonResponse("Invalid ID", 400);
    return deleteUser(id);
};

const getConversationByIdReq = async (req: Request): Promise<Response> => {
    const id = getIdFromUrl(new URL(req.url));
    if (id === null) return jsonResponse("Invalid ID", 400);
    return getConversationById(id);
};

const deleteConversationById = async (req: Request): Promise<Response> => {
    const id = getIdFromUrl(new URL(req.url));
    if (id === null) return jsonResponse("Invalid ID", 400);
    return deleteConversation(id);
};

const getMessageByIdReq = async (req: Request): Promise<Response> => {
    const id = getIdFromUrl(new URL(req.url));
    if (id === null) return jsonResponse("Invalid ID", 400);
    return getMessageById(req, id.toString());
};

const deleteMessageById = async (req: Request): Promise<Response> => {
    const id = getIdFromUrl(new URL(req.url));
    if (id === null) return jsonResponse("Invalid ID", 400);
    return deleteMessage(req, id.toString());
};

// Buscador de ruta
const findRoute = (pathname: string, method: string): Route | undefined => {
    // Primero busca exacta
    const exact = routes.find(r => r.path === pathname && r.method === method);
    if (exact) return exact;

    // Busca con patrón :id
    return routes.find(r => {
        if (r.method !== method) return false;
        if (!r.path.includes(":id")) return false;
        
        const basePath = r.path.replace("/:id", "");
        return pathname.startsWith(basePath) || pathname === basePath;
    });
};

// Router principal
export const router = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    // Preflight CORS
    if (method === "OPTIONS") {
        return withCors(noContentResponse());
    }

    // Buscar ruta
    const route = findRoute(pathname, method);

    if (!route) {
        return withCors(jsonResponse("Not Found", 404));
    }

    try {
        const response = await route.handler(req);
        return withCors(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return withCors(jsonResponse({ error: message }, 500));
    }
};