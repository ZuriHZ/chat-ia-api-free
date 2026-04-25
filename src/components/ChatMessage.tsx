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
                className={`max-w-[90%] rounded-[1.75rem] px-6 py-5 shadow-sm sm:max-w-[80%] transition-all ${
                    isUser
                        ? "bg-linear-to-br from-cyan-600 to-blue-600 text-white shadow-cyan-500/20"
                        : message.error
                          ? "border border-rose-500/30 bg-rose-950/40 text-rose-100"
                          : "border border-white/5 bg-slate-800/80 text-slate-200 backdrop-blur-md"
                }`}
            >
                <div className="mb-3 flex items-center justify-between gap-6 text-[0.65rem] font-bold uppercase tracking-[0.25em]">
                    <span
                        className={
                            isUser
                                ? "text-cyan-100"
                                : message.error
                                  ? "text-rose-400"
                                  : "text-cyan-400"
                        }
                    >
                        {isUser ? "Tú" : message.error ? "Error" : "Asistente IA"}
                    </span>
                    <span
                        className={
                            isUser
                                ? "text-cyan-200/70"
                                : "text-slate-500"
                        }
                    >
                        {formatTime(message.created_at)}
                    </span>
                </div>

                <p className="whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-relaxed">
                    {message.content || (message.pending ? "..." : "")}
                </p>
            </div>
        </article>
    );
}
