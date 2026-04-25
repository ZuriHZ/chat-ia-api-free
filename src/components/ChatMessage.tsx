import type { Message } from "../types";

interface ChatMessageProps {
    message: Message;
}

function formatTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <article
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[90%] rounded-[1.75rem] px-5 py-4 shadow-sm sm:max-w-[75%] ${
                    isUser
                        ? "bg-stone-950 text-stone-50"
                        : message.error
                          ? "border border-rose-200 bg-rose-50 text-rose-950"
                          : "border border-stone-200 bg-white text-stone-800"
                }`}
            >
                <div className="mb-2 flex items-center justify-between gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.24em]">
                    <span
                        className={
                            isUser
                                ? "text-stone-300"
                                : message.error
                                  ? "text-rose-500"
                                  : "text-teal-700"
                        }
                    >
                        {isUser ? "Tu mensaje" : message.error ? "Error" : "Asistente"}
                    </span>
                    <span
                        className={
                            isUser
                                ? "text-stone-400"
                                : "text-stone-400"
                        }
                    >
                        {formatTime(message.created_at)}
                    </span>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-7 sm:text-[0.98rem]">
                    {message.content || (message.pending ? "..." : "")}
                </p>
            </div>
        </article>
    );
}
