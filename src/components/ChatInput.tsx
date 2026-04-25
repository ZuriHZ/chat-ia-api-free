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
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
            {error ? (
                <div className="flex flex-col gap-3 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between">
                    <span>{error}</span>

                    {canRetry ? (
                        <button
                            className="inline-flex items-center justify-center rounded-full bg-rose-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800"
                            onClick={onRetry}
                            type="button"
                        >
                            Reintentar
                        </button>
                    ) : null}
                </div>
            ) : null}

            <div className="rounded-[2rem] border border-stone-200 bg-white p-3 shadow-[0_18px_45px_-28px_rgba(41,37,36,0.35)]">
                <label className="sr-only" htmlFor="chat-input">
                    Mensaje
                </label>

                <textarea
                    className="min-h-28 w-full resize-none rounded-[1.35rem] border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-teal-600 focus:bg-white sm:text-base"
                    disabled={isStreaming}
                    id="chat-input"
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            void handleSubmit();
                        }
                    }}
                    placeholder="Escribe tu mensaje. Enter envia, Shift + Enter agrega una nueva linea."
                    value={value}
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                        Streaming chunk por chunk desde el backend
                    </p>

                    <button
                        className="inline-flex items-center justify-center rounded-full bg-teal-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-400"
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
