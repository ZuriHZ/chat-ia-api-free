import { useEffect, useRef } from "react";
import { Activity, Bot, Loader2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
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
            <header className="border-b border-white/5 px-5 py-5 sm:px-7 lg:px-8">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="min-w-0 space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.28em] accent-text">
                            <Sparkles className="size-3.5" />
                            Chat IA Migration
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-primary sm:text-4xl lg:text-5xl">
                                Centro de conversaciones
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                                Un espacio más limpio para escribir, leer respuestas en streaming y cambiar de modelo sin salir del flujo.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] accent-text shadow-inner">
                            {isStreaming ? (
                                <Activity className="size-3.5 animate-pulse" />
                            ) : (
                                <ShieldCheck className="size-3.5" />
                            )}
                            {isStreaming
                                ? "Transmitiendo"
                                : currentConversationId
                                  ? `Chat #${currentConversationId}`
                                  : "Nuevo chat"}
                        </span>

                        <ModelSelector
                            isLoading={modelsLoading}
                            models={models}
                            onChange={onModelChange}
                            selectedModel={selectedModel}
                        />
                    </div>
                </div>
            </header>

            <div className="chat-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-7 lg:px-8">
                {isBootstrapping || isLoadingMessages ? (
                    <div className="flex h-full min-h-80 items-center justify-center">
                        <div className="surface-card flex items-center gap-3 rounded-[1.5rem] px-5 py-4 text-sm font-semibold text-muted shadow-sm">
                            <Loader2 className="size-4 animate-spin accent-text" />
                            Cargando historial de la conversación...
                        </div>
                    </div>
                ) : null}

                {isEmpty ? (
                    <div className="flex h-full min-h-96 items-center justify-center">
                        <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 shadow-2xl backdrop-blur-md sm:p-9">
                            <div className="grid size-14 place-items-center rounded-3xl bg-cyan-500/[0.12] accent-text">
                                <Bot className="size-7" />
                            </div>
                            <p className="mt-6 text-[0.7rem] font-extrabold uppercase tracking-[0.32em] accent-text">
                                Listo para comenzar
                            </p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                                Pregunta algo y empieza una conversación nueva
                            </h2>
                            <p className="mt-4 text-base leading-8 text-muted">
                                Usa el compositor inferior para enviar tu primer mensaje. Las respuestas aparecerán con mejor jerarquía visual, soporte Markdown y bloques de código cómodos de copiar.
                            </p>
                            <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-3">
                                {[
                                    "Enter envía",
                                    "Markdown legible",
                                    "Historial persistente",
                                ].map((item) => (
                                    <div className="surface-card rounded-2xl px-4 py-3" key={item}>
                                        <MessageCircle className="mb-2 size-4 accent-text" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                {!isEmpty ? (
                    <div className="mx-auto flex max-w-4xl flex-col gap-5 pb-4">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isStreaming ? (
                            <div className="message-card-ai inline-flex w-fit items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-muted shadow-sm backdrop-blur-md">
                                <span className="flex gap-1.5">
                                    <span className="size-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.2s]" />
                                    <span className="size-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.1s]" />
                                    <span className="size-2 animate-bounce rounded-full bg-cyan-400" />
                                </span>
                                Escribiendo respuesta...
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div ref={endRef} />
            </div>

            <footer className="border-t border-white/5 bg-black/[0.045] px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-8">
                <ChatInput
                    canRetry={canRetry}
                    error={error}
                    isStreaming={isStreaming}
                    onRetry={onRetry}
                    onSubmit={onSubmit}
                />
            </footer>
        </>
    );
}
