import type { Message, Model } from "../types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatHeader } from "./layout/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as React from "react";

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
    // Using any for the ref to avoid complex Radix internal type issues with querySelector
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollAreaRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (messages.length > 0 || isStreaming) {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                requestAnimationFrame(() => {
                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: "smooth",
                    });
                });
            }
        }
    }, [messages, isStreaming]);

    const isEmpty = messages.length === 0 && !isLoadingMessages && !isBootstrapping;

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white pointer-events-none" />
            
            <ChatHeader 
                currentConversationId={currentConversationId}
                isStreaming={isStreaming}
                models={models}
                modelsLoading={modelsLoading}
                onModelChange={onModelChange}
                selectedModel={selectedModel}
            />

            <ScrollArea 
                className="flex-1 relative z-0"
                ref={scrollAreaRef}
            >
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 min-h-full flex flex-col">
                    {isBootstrapping || isLoadingMessages ? (
                        <div className="flex flex-1 items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground animate-pulse">
                                    Cargando conversaciones...
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {isEmpty ? (
                        <div className="flex flex-1 items-center justify-center py-20">
                            <div className="max-w-md text-center animate-in fade-in zoom-in duration-700">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent sm:text-4xl">
                                    Pro-AI Experience
                                </h2>
                                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                                    Bienvenido al centro de conversaciones avanzado. Selecciona un modelo y comienza a explorar las posibilidades de la IA.
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {!isEmpty && !isLoadingMessages ? (
                        <div className="flex flex-col gap-10 pb-32">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}

                            {isStreaming ? (
                                <div className="flex items-start gap-4 px-2 py-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="h-8 w-8 shrink-0 rounded-full bg-surface border border-border flex items-center justify-center">
                                         <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                                    </div>
                                    <div className="flex-1 space-y-3 pt-1">
                                        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-muted/40" />
                                        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-muted/40" />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </ScrollArea>

            <div className="sticky bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/95 to-transparent pb-8 pt-10 px-4 sm:px-6 lg:px-8 z-10">
                <div className="mx-auto max-w-4xl">
                    <ChatInput
                        canRetry={canRetry}
                        error={error}
                        isStreaming={isStreaming}
                        onRetry={onRetry}
                        onSubmit={handleSendMessage}
                    />
                    <p className="mt-3 text-center text-[10px] text-muted-foreground/60 font-medium">
                        Modelos optimizados para productividad • Chat IA Migration v2.0
                    </p>
                </div>
            </div>
        </div>
    );

    async function handleSendMessage(message: string) {
        await onSubmit(message);
    }
}
