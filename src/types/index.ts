export type Role = "user" | "ai";

export interface Message {
    id: number | string;
    conversation_id: number | null;
    role: Role;
    content: string;
    created_at: string;
    pending?: boolean;
    error?: boolean;
    retryable?: boolean;
}

export interface Model {
    id: string;
    label: string;
}

export interface Conversation {
    id: number;
    user_id: number | null;
    title: string;
    created_at: string;
}

export interface ChatStreamRequest {
    message: string;
    model?: string;
    conversationId?: number;
    persistUserMessage?: boolean;
    signal?: AbortSignal;
    onChunk?: (chunk: string) => void;
}

export interface ChatStreamResult {
    text: string;
    status: string | null;
}
