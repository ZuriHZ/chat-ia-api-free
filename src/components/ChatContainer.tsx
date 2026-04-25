import { useEffect, useRef } from "react";
import type { Message, Model } from "../types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ModelSelector } from "./ModelSelector";

interface ChatContainerProps {
    canRetry: boolean;
    currentConversationId: number | null;
    error: string | null;
    isBootstrapping: boolean;
    isLoadingMessages: boolean;
    isStreaming: boolean;
    messages: Message[];
    models: Model[];
    modelsLoading: boolean;
    onModelChange: (modelId: string) => void;
    onRetry: () => void;
    onSubmit: (message: string) => void | Promise<void>;
    selectedModel: string;
}

export function ChatContainer({
    canRetry,
    currentConversationId,
    error,
    isBootstrapping,
    isLoadingMessages,
    isStreaming,
    messages,
    models,
    modelsLoading,
    onModelChange,
    onRetry,
    onSubmit,
    selectedModel,
}: ChatContainerProps) {
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messages.length > 0 || isStreaming) {
            requestAnimationFrame(() => {
                endRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            });
        }
    }, [messages, isStreaming]);

    const isEmpty = messages.length === 0 && !isLoadingMessages && !isBootstrapping;

    return (
        <>
            <header className="border-b border-stone-200/80 px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-700">
                            Chat IA migration
                        </p>
                        <div>
                            <h1 className="font-serif text-3xl text-stone-950 sm:text-4xl">
                                Centro de conversaciones
                            </h1>
                            <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
                                Streaming en vivo, historial por conversacion y
                                cambio de modelo sin salir del chat.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                            {isStreaming
                                ? "Transmitiendo respuesta"
                                : currentConversationId
                                  ? `Conversacion #${currentConversationId}`
                                  : "Conversacion nueva"}
                        </span>

                        <ModelSelector
                            isLoading={modelsLoading}
                            models={models}
                            selectedModel={selectedModel}
                            onChange={onModelChange}
                        />
                    </div>
                </div>
            </header>

            <div className="chat-scroll flex-1 overflow-y-auto px-4 py-5 sm:px-7">
                {isBootstrapping || isLoadingMessages ? (
                    <div className="flex h-full min-h-[20rem] items-center justify-center">
                        <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/70 px-6 py-5 text-sm text-stone-600 shadow-sm">
                            Cargando historial de la conversacion...
                        </div>
                    </div>
                ) : null}

                {isEmpty ? (
                    <div className="flex h-full min-h-[24rem] items-center justify-center">
                        <div className="max-w-xl rounded-[2rem] border border-stone-200 bg-white/85 p-8 shadow-[0_24px_60px_-32px_rgba(41,37,36,0.45)]">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-700">
                                Listo para comenzar
                            </p>
                            <h2 className="mt-3 font-serif text-3xl text-stone-950">
                                Pregunta algo y empieza una conversacion nueva
                            </h2>
                            <p className="mt-3 text-base leading-7 text-stone-600">
                                El mensaje se enviara al backend en
                                `http://localhost:3000`, se guardara en la
                                conversacion activa y la respuesta aparecera en
                                streaming.
                            </p>
                        </div>
                    </div>
                ) : null}

                {!isEmpty ? (
                    <div className="mx-auto flex max-w-4xl flex-col gap-4 pb-3">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isStreaming ? (
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-900 px-4 py-2 text-sm text-white shadow-sm">
                                <span className="size-2 animate-pulse rounded-full bg-amber-300" />
                                escribiendo...
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div ref={endRef} />
            </div>

            <div className="border-t border-stone-200/80 px-4 py-4 sm:px-7">
                <ChatInput
                    canRetry={canRetry}
                    error={error}
                    isStreaming={isStreaming}
                    onRetry={onRetry}
                    onSubmit={onSubmit}
                />
            </div>
        </>
    );
}
