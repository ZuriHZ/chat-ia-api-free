import {
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useShallow } from "zustand/react/shallow";
import {
    createConversation,
    deleteConversation,
    getConversations,
    getMessages,
    getModels,
    sendChat,
} from "../services/api";
import { useChatStore } from "../stores/chatStore";
import type { Message, Model } from "../types";

interface FailedRequest {
    conversationId: number | null;
    message: string;
    model?: string;
    persistUserMessage: boolean;
}

function createLocalMessage(
    role: Message["role"],
    conversationId: number,
    content: string,
    extra?: Partial<Message>,
): Message {
    return {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role,
        content,
        created_at: new Date().toISOString(),
        ...extra,
    };
}

function createConversationTitle(message: string) {
    const compact = message.replace(/\s+/g, " ").trim();
    return compact.length > 44 ? `${compact.slice(0, 44)}...` : compact;
}

function formatError(error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
        return "La solicitud fue cancelada antes de completarse.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "No se pudo completar la solicitud. Intenta nuevamente.";
}

export function useChat() {
    const {
        appendMessage,
        conversations,
        currentConversationId,
        messagesByConversation,
        patchMessage,
        removeConversation: removeConversationFromStore,
        selectedModel,
        setConversations,
        setCurrentConversationId,
        setMessages,
        setSelectedModel,
        upsertConversation,
    } = useChatStore(
        useShallow((state) => ({
            appendMessage: state.appendMessage,
            conversations: state.conversations,
            currentConversationId: state.currentConversationId,
            messagesByConversation: state.messagesByConversation,
            patchMessage: state.patchMessage,
            removeConversation: state.removeConversation,
            selectedModel: state.selectedModel,
            setConversations: state.setConversations,
            setCurrentConversationId: state.setCurrentConversationId,
            setMessages: state.setMessages,
            setSelectedModel: state.setSelectedModel,
            upsertConversation: state.upsertConversation,
        })),
    );

    const [models, setModels] = useState<Model[]>([]);
    const [modelsLoading, setModelsLoading] = useState(true);
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFailedRequest, setLastFailedRequest] =
        useState<FailedRequest | null>(null);
    const bootstrappedRef = useRef(false);
    const streamAbortRef = useRef<AbortController | null>(null);

    const messages =
        currentConversationId === null
            ? []
            : messagesByConversation[String(currentConversationId)] ?? [];

    const refreshMessages = useCallback(
        async (conversationId: number) => {
            setIsLoadingMessages(true);

            try {
                const nextMessages = await getMessages(conversationId);
                setMessages(conversationId, nextMessages);
            } catch (nextError) {
                setError(formatError(nextError));
            } finally {
                setIsLoadingMessages(false);
            }
        },
        [setMessages],
    );

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                const persistedConversationId =
                    useChatStore.getState().currentConversationId;
                const [loadedModels, loadedConversations] = await Promise.all([
                    getModels(),
                    getConversations(),
                ]);

                if (cancelled) {
                    return;
                }

                setModels(loadedModels);
                setModelsLoading(false);

                startTransition(() => {
                    setConversations(loadedConversations);
                });

                const nextConversationId =
                    persistedConversationId &&
                    loadedConversations.some(
                        (conversation) => conversation.id === persistedConversationId,
                    )
                        ? persistedConversationId
                        : loadedConversations[0]?.id ?? null;

                setCurrentConversationId(nextConversationId);
            } catch (nextError) {
                if (!cancelled) {
                    setError(formatError(nextError));
                    setModelsLoading(false);
                }
            } finally {
                if (!cancelled) {
                    setIsBootstrapping(false);
                    bootstrappedRef.current = true;
                }
            }
        }

        void bootstrap();

        return () => {
            cancelled = true;
            streamAbortRef.current?.abort();
        };
    }, [setConversations, setCurrentConversationId]);

    useEffect(() => {
        if (!bootstrappedRef.current || currentConversationId === null) {
            return;
        }

        void refreshMessages(currentConversationId);
    }, [currentConversationId, refreshMessages]);

    async function ensureConversation(message: string) {
        if (currentConversationId !== null) {
            return currentConversationId;
        }

        const conversation = await createConversation(createConversationTitle(message));
        upsertConversation(conversation);
        setCurrentConversationId(conversation.id);
        setMessages(conversation.id, []);

        return conversation.id;
    }

    async function runStream(args: {
        conversationId: number;
        message: string;
        model?: string;
        persistUserMessage: boolean;
    }) {
        const aiMessage = createLocalMessage("ai", args.conversationId, "", {
            pending: true,
        });

        appendMessage(args.conversationId, aiMessage);
        setError(null);
        setIsStreaming(true);

        streamAbortRef.current?.abort();
        const controller = new AbortController();
        streamAbortRef.current = controller;

        try {
            const result = await sendChat({
                conversationId: args.conversationId,
                message: args.message,
                model: args.model,
                onChunk: (chunk) => {
                    const previous =
                        (
                            useChatStore.getState().messagesByConversation[
                                String(args.conversationId)
                            ] ?? []
                        ).find((message) => message.id === aiMessage.id)?.content ?? "";

                    patchMessage(args.conversationId, aiMessage.id, {
                        content: previous + chunk,
                        pending: false,
                    });
                },
                persistUserMessage: args.persistUserMessage,
                signal: controller.signal,
            });

            patchMessage(args.conversationId, aiMessage.id, {
                content: result.text || "La IA no devolvio contenido esta vez.",
                pending: false,
            });

            if (result.status === "joke") {
                setError(
                    "El backend devolvio una respuesta de contingencia. Puedes reintentar con otro modelo.",
                );
            } else {
                setLastFailedRequest(null);
            }

            await refreshMessages(args.conversationId);
        } catch (streamError) {
            const message = formatError(streamError);

            patchMessage(args.conversationId, aiMessage.id, {
                content: message,
                error: true,
                pending: false,
                retryable: true,
            });

            setError(message);
            setLastFailedRequest({
                conversationId: args.conversationId,
                message: args.message,
                model: args.model,
                persistUserMessage: false,
            });
        } finally {
            setIsStreaming(false);
            streamAbortRef.current = null;
        }
    }

    async function handleSendMessage(rawMessage: string) {
        const message = rawMessage.trim();

        if (!message || isStreaming) {
            return;
        }

        try {
            const conversationId = await ensureConversation(message);
            const userMessage = createLocalMessage("user", conversationId, message);

            appendMessage(conversationId, userMessage);

            await runStream({
                conversationId,
                message,
                model: selectedModel,
                persistUserMessage: true,
            });
        } catch (nextError) {
            setError(formatError(nextError));
            setLastFailedRequest({
                conversationId: currentConversationId,
                message,
                model: selectedModel,
                persistUserMessage: true,
            });
        }
    }

    async function handleRetry() {
        if (!lastFailedRequest || isStreaming) {
            return;
        }

        if (lastFailedRequest.conversationId === null) {
            await handleSendMessage(lastFailedRequest.message);
            return;
        }

        setCurrentConversationId(lastFailedRequest.conversationId);

        await runStream({
            conversationId: lastFailedRequest.conversationId,
            message: lastFailedRequest.message,
            model: lastFailedRequest.model,
            persistUserMessage: lastFailedRequest.persistUserMessage,
        });
    }

    async function handleCreateConversation() {
        setIsCreatingConversation(true);
        setError(null);
        setLastFailedRequest(null);

        try {
            const conversation = await createConversation();
            upsertConversation(conversation);
            setCurrentConversationId(conversation.id);
            setMessages(conversation.id, []);
        } catch (nextError) {
            setError(formatError(nextError));
        } finally {
            setIsCreatingConversation(false);
        }
    }

    function handleSelectConversation(conversationId: number) {
        setError(null);
        setLastFailedRequest(null);
        setCurrentConversationId(conversationId);
    }

    async function handleDeleteConversation(conversationId: number) {
        const remaining = conversations.filter(
            (conversation) => conversation.id !== conversationId,
        );

        try {
            await deleteConversation(conversationId);
            removeConversationFromStore(conversationId);

            if (currentConversationId === conversationId) {
                setCurrentConversationId(remaining[0]?.id ?? null);
            }
        } catch (nextError) {
            setError(formatError(nextError));
        }
    }

    return {
        canRetry: lastFailedRequest !== null,
        conversations,
        currentConversationId,
        error,
        handleCreateConversation,
        handleDeleteConversation,
        handleRetry,
        handleSelectConversation,
        handleSendMessage,
        isBootstrapping,
        isCreatingConversation,
        isLoadingMessages,
        isStreaming,
        messages,
        models,
        modelsLoading,
        selectedModel,
        setSelectedModel,
    };
}
