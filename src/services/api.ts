import type {
    ChatStreamRequest,
    ChatStreamResult,
    Conversation,
    Message,
    Model,
} from "../types";

const API_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

interface ApiError {
    error: string;
    detail?: string;
    attemptedModels?: string[];
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers,
        },
    });

    if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        const text = await response.text();
        
        // Intentar parsear como JSON si es JSON
        if (contentType?.includes("application/json")) {
            try {
                const json = JSON.parse(text);
                const errorInfo = json as ApiError;
                throw new Error(errorInfo.detail || errorInfo.error || text);
            } catch {
                throw new Error(text);
            }
        }
        
        throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

export function getModels() {
    return apiRequest<Model[]>("/models");
}

export function getConversations() {
    return apiRequest<Conversation[]>("/api/conversations");
}

export function createConversation(title?: string) {
    return apiRequest<Conversation>("/api/conversations", {
        method: "POST",
        body: JSON.stringify(title ? { title } : {}),
    });
}

export function deleteConversation(id: number) {
    return apiRequest<void>(`/api/conversations/${id}`, {
        method: "DELETE",
    });
}

export function getMessages(conversationId: number) {
    return apiRequest<Message[]>(
        `/api/messages?conversationId=${encodeURIComponent(conversationId)}`,
    );
}

export async function sendChat(
    request: ChatStreamRequest,
): Promise<ChatStreamResult> {
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: request.message,
            model: request.model,
            conversationId: request.conversationId,
            persistUserMessage: request.persistUserMessage,
        }),
        signal: request.signal,
    });

    if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        const text = await response.text();
        
        // Intentar parsear como JSON para obtener el error detallado
        if (contentType?.includes("application/json")) {
            try {
                const json = JSON.parse(text);
                const errorInfo = json as ApiError;
                throw new Error(errorInfo.detail || errorInfo.error || text);
            } catch (parseError) {
                if (parseError instanceof Error) throw parseError;
                throw new Error(text, { cause: parseError });
            }
        }
        
        throw new Error(text || `Chat request failed with status ${response.status}`);
    }

    if (!response.body) {
        throw new Error("La respuesta del backend no incluye stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (!chunk) {
            continue;
        }

        text += chunk;
        request.onChunk?.(chunk);
    }

    text += decoder.decode();

    return {
        text,
        status: response.headers.get("X-AI-Status"),
    };
}