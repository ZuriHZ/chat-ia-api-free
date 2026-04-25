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
            <header className="border-b border-white/5 px-6 py-6 lg:px-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-cyan-400">
                            Chat IA Migration
                        </p>
                        <div>
                            <h1 className="font-semibold text-3xl text-slate-100 sm:text-4xl tracking-tight">
                                Centro de conversaciones
                            </h1>
                            <p className="max-w-2xl text-sm text-slate-400 sm:text-base mt-2">
                                Streaming en vivo, historial por conversación y
                                cambio de modelo sin salir del chat.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <span className="inline-flex items-center rounded-full bg-cyan-950/50 border border-cyan-500/20 px-3 py-1.5 text-[0.7rem] font-semibold text-cyan-300 uppercase tracking-widest shadow-inner">
                            {isStreaming
                                ? "Transmitiendo respuesta"
                                : currentConversationId
                                  ? `Conversación #${currentConversationId}`
                                  : "Conversación nueva"}
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

            <div className="chat-scroll flex-1 overflow-y-auto px-5 py-6 sm:px-8">
                {isBootstrapping || isLoadingMessages ? (
                    <div className="flex h-full min-h-80 items-center justify-center">
                        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 px-6 py-5 text-sm text-slate-400 shadow-sm animate-pulse">
                            Cargando historial de la conversación...
                        </div>
                    </div>
                ) : null}

                {isEmpty ? (
                    <div className="flex h-full min-h-96 items-center justify-center">
                        <div className="max-w-xl rounded-4xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
                            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-blue-400">
                                Listo para comenzar
                            </p>
                            <h2 className="mt-3 font-semibold text-3xl text-slate-100 tracking-tight">
                                Pregunta algo y empieza una conversación nueva
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-400">
                                El mensaje se enviará al backend, se guardará en la
                                conversación activa y la respuesta aparecerá en
                                streaming instantáneo.
                            </p>
                        </div>
                    </div>
                ) : null}

                {!isEmpty ? (
                    <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-4">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isStreaming ? (
                            <div className="inline-flex w-fit items-center gap-3 rounded-full bg-slate-800/80 border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 shadow-sm backdrop-blur-md">
                                <span className="size-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                <span className="tracking-wide">Escribiendo...</span>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div ref={endRef} />
            </div>

            <div className="border-t border-white/5 bg-slate-900/30 px-5 py-5 sm:px-8 backdrop-blur-md">
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
