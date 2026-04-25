import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Conversation, Message } from "../types";

interface ChatStore {
    conversations: Conversation[];
    currentConversationId: number | null;
    messagesByConversation: Record<string, Message[]>;
    selectedModel: string;
    removeConversation: (conversationId: number) => void;
    setConversations: (conversations: Conversation[]) => void;
    setCurrentConversationId: (conversationId: number | null) => void;
    setMessages: (conversationId: number, messages: Message[]) => void;
    setSelectedModel: (modelId: string) => void;
    patchMessage: (
        conversationId: number,
        messageId: number | string,
        patch: Partial<Message>,
    ) => void;
    appendMessage: (conversationId: number, message: Message) => void;
    upsertConversation: (conversation: Conversation) => void;
}

const sortConversations = (conversations: Conversation[]) =>
    [...conversations].sort((left, right) => right.id - left.id);

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
            conversations: [],
            currentConversationId: null,
            messagesByConversation: {},
            selectedModel: "nousresearch/hermes-3-llama-3.1-405b:free",
            removeConversation: (conversationId) =>
                set((state) => {
                    const nextMessages = { ...state.messagesByConversation };
                    delete nextMessages[String(conversationId)];

                    return {
                        conversations: state.conversations.filter(
                            (conversation) => conversation.id !== conversationId,
                        ),
                        currentConversationId:
                            state.currentConversationId === conversationId
                                ? null
                                : state.currentConversationId,
                        messagesByConversation: nextMessages,
                    };
                }),
            setConversations: (conversations) =>
                set(() => ({
                    conversations: sortConversations(conversations),
                })),
            setCurrentConversationId: (conversationId) =>
                set(() => ({
                    currentConversationId: conversationId,
                })),
            setMessages: (conversationId, messages) =>
                set((state) => ({
                    messagesByConversation: {
                        ...state.messagesByConversation,
                        [String(conversationId)]: messages,
                    },
                })),
            setSelectedModel: (modelId) =>
                set(() => ({
                    selectedModel: modelId,
                })),
            patchMessage: (conversationId, messageId, patch) =>
                set((state) => ({
                    messagesByConversation: {
                        ...state.messagesByConversation,
                        [String(conversationId)]: (
                            state.messagesByConversation[String(conversationId)] ?? []
                        ).map((message) =>
                            message.id === messageId
                                ? { ...message, ...patch }
                                : message,
                        ),
                    },
                })),
            appendMessage: (conversationId, message) =>
                set((state) => ({
                    messagesByConversation: {
                        ...state.messagesByConversation,
                        [String(conversationId)]: [
                            ...(state.messagesByConversation[String(conversationId)] ??
                                []),
                            message,
                        ],
                    },
                })),
            upsertConversation: (conversation) =>
                set((state) => {
                    const others = state.conversations.filter(
                        (item) => item.id !== conversation.id,
                    );

                    return {
                        conversations: sortConversations([conversation, ...others]),
                    };
                }),
        }),
        {
            name: "chat-ia-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                conversations: state.conversations,
                currentConversationId: state.currentConversationId,
                selectedModel: state.selectedModel,
            }),
        },
    ),
);
