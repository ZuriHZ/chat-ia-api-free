import { useRef, useState } from "react";
import { AlertCircle, CornerDownLeft, RotateCcw, SendHorizonal } from "lucide-react";

interface ChatInputProps {
    canRetry: boolean;
    error: string | null;
    isStreaming: boolean;
    onRetry: () => void;
    onSubmit: (message: string) => void | Promise<void>;
}

const suggestions = [
    "Resume esta conversación en 5 puntos",
    "Dame una respuesta paso a paso",
    "Compara ventajas y riesgos",
];

export function ChatInput({
    canRetry,
    error,
    isStreaming,
    onRetry,
    onSubmit,
}: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    function resizeTextarea(nextValue: string) {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;

        if (nextValue.length === 0) {
            textarea.style.height = "112px";
        }
    }

    function updateValue(nextValue: string) {
        setValue(nextValue);
        resizeTextarea(nextValue);
    }

    async function handleSubmit() {
        const nextValue = value.trim();

        if (!nextValue || isStreaming) {
            return;
        }

        updateValue("");
        await onSubmit(nextValue);
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
            {error ? (
                <div className="flex flex-col gap-3 rounded-3xl border border-rose-400/30 bg-rose-950/40 px-5 py-4 text-sm text-rose-100 shadow-lg shadow-rose-950/10 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-start gap-2 leading-6">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        {error}
                    </span>

                    {canRetry ? (
                        <button
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-500"
                            onClick={onRetry}
                            type="button"
                        >
                            <RotateCcw className="size-3.5" />
                            Reintentar
                        </button>
                    ) : null}
                </div>
            ) : null}

            {!value && !isStreaming ? (
                <div className="chat-scroll flex gap-2 overflow-x-auto pb-1">
                    {suggestions.map((suggestion) => (
                        <button
                            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-muted transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-primary"
                            key={suggestion}
                            onClick={() => updateValue(suggestion)}
                            type="button"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            ) : null}

            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-cyan-400/55 focus-within:bg-white/[0.075] focus-within:shadow-[0_0_52px_-22px_rgba(6,182,212,0.45)]">
                <label className="sr-only" htmlFor="chat-input">
                    Mensaje
                </label>

                <textarea
                    className="chat-scroll min-h-28 w-full resize-none rounded-[1.25rem] bg-transparent px-4 py-4 text-[0.98rem] leading-7 text-primary outline-none transition placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                    disabled={isStreaming}
                    id="chat-input"
                    onChange={(event) => updateValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            void handleSubmit();
                        }
                    }}
                    placeholder="Escribe tu mensaje. Enter envía, Shift + Enter crea una nueva línea."
                    ref={textareaRef}
                    value={value}
                />

                <div className="flex flex-col gap-3 px-2 pb-1 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-subtle">
                        <CornerDownLeft className="size-3.5" />
                        Enter para enviar
                    </p>

                    <button
                        className="button-primary px-5 py-2.5 text-sm"
                        disabled={isStreaming || !value.trim()}
                        onClick={() => {
                            void handleSubmit();
                        }}
                        type="button"
                    >
                        {isStreaming ? (
                            "Generando..."
                        ) : (
                            <>
                                Enviar
                                <SendHorizonal className="size-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
