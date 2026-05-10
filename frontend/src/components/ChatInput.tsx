import { useState, useRef, useEffect } from "react";
import { Send, CornerDownLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
    canRetry: boolean;
    error: string | null;
    isStreaming: boolean;
    onRetry: () => void;
    onSubmit: (message: string) => void | Promise<void>;
}

export function ChatInput({
    canRetry,
    error,
    isStreaming,
    onRetry,
    onSubmit,
}: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [value]);

    async function handleSubmit() {
        const nextValue = value.trim();

        if (!nextValue || isStreaming) {
            return;
        }

        setValue("");
        await onSubmit(nextValue);
    }

    return (
        <div className="relative">
            {error && (
                <div className="absolute bottom-full left-0 right-0 mb-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                        {canRetry && (
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={onRetry}
                                className="h-7 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider"
                            >
                                Reintentar
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div className="group relative flex flex-col gap-2 rounded-3xl border border-border bg-surface/50 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
                <Textarea
                    ref={textareaRef}
                    className="min-h-[52px] w-full resize-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground ring-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
                    disabled={isStreaming}
                    placeholder="Escribe un mensaje..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            if (!isStreaming && value.trim()) {
                                e.preventDefault();
                                void handleSubmit();
                            } else {
                                e.preventDefault();
                            }
                        }
                    }}
                />

                <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-2 px-2 text-[10px] text-muted-foreground/60 font-medium">
                        <CornerDownLeft size={12} />
                        <span>Presiona Enter para enviar</span>
                    </div>

                    <Button
                        size="sm"
                        className="h-8 rounded-full px-4 font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        disabled={isStreaming || !value.trim()}
                        onClick={() => void handleSubmit()}
                    >
                        {isStreaming ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Enviando
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send size={12} />
                                Enviar
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
