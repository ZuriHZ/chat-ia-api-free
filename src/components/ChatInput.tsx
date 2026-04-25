import { useState } from "react";

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

    async function handleSubmit() {
        const nextValue = value.trim();

        if (!nextValue || isStreaming) {
            return;
        }

        setValue("");
        await onSubmit(nextValue);
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            {error ? (
                <div className="flex flex-col gap-3 rounded-3xl border border-rose-500/30 bg-rose-950/40 px-5 py-4 text-sm text-rose-200 sm:flex-row sm:items-center sm:justify-between">
                    <span>{error}</span>

                    {canRetry ? (
                        <button
                            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-rose-500 shadow-lg shadow-rose-500/20"
                            onClick={onRetry}
                            type="button"
                        >
                            Reintentar
                        </button>
                    ) : null}
                </div>
            ) : null}

            <div className="rounded-4xl border border-white/10 bg-slate-800/60 p-3 shadow-xl backdrop-blur-xl transition-all focus-within:border-cyan-500/50 focus-within:bg-slate-800/80 focus-within:shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)]">
                <label className="sr-only" htmlFor="chat-input">
                    Mensaje
                </label>

                <textarea
                    className="min-h-24 w-full resize-none rounded-[1.35rem] bg-transparent px-5 py-4 text-[0.95rem] leading-relaxed text-slate-100 outline-none transition placeholder:text-slate-500"
                    disabled={isStreaming}
                    id="chat-input"
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            void handleSubmit();
                        }
                    }}
                    placeholder="Escribe tu mensaje. Enter envía, Shift + Enter nueva línea."
                    value={value}
                />

                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 pb-1">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-slate-500">
                        Streaming activo
                    </p>

                    <button
                        className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.03] hover:shadow-cyan-500/40 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isStreaming || !value.trim()}
                        onClick={() => {
                            void handleSubmit();
                        }}
                        type="button"
                    >
                        {isStreaming ? "Enviando..." : "Enviar mensaje"}
                    </button>
                </div>
            </div>
        </div>
    );
}
