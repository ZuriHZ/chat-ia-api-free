import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AlertTriangle, Bot, Check, Copy, UserRound } from "lucide-react";
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

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
            onClick={handleCopy}
            title="Copiar código"
            type="button"
        >
            {copied ? (
                <Check className="size-3.5 text-teal-400" />
            ) : (
                <Copy className="size-3.5" />
            )}
            {copied ? "Copiado" : "Copiar"}
        </button>
    );
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";
    const label = isUser ? "Tú" : message.error ? "Error" : "Asistente IA";

    return (
        <article className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser ? (
                <div className={`mt-1 hidden size-9 shrink-0 place-items-center rounded-2xl border sm:grid ${message.error ? "border-rose-400/30 bg-rose-500/10 text-rose-300" : "border-cyan-400/25 bg-cyan-500/[0.12] accent-text"}`}>
                    {message.error ? <AlertTriangle className="size-4" /> : <Bot className="size-4" />}
                </div>
            ) : null}

            <div
                className={`message-card max-w-[96%] rounded-[1.55rem] px-5 py-4 shadow-sm transition-all sm:max-w-[82%] sm:px-6 sm:py-5 ${
                    isUser
                        ? "message-card-user rounded-br-md"
                        : message.error
                          ? "message-card-error rounded-bl-md"
                          : "message-card-ai rounded-bl-md"
                }`}
            >
                <div className="mb-3 flex items-center justify-between gap-6 text-[0.68rem] font-extrabold uppercase tracking-[0.22em]">
                    <span className={`inline-flex items-center gap-2 ${isUser ? "text-cyan-50" : message.error ? "text-rose-300" : "accent-text"}`}>
                        {isUser ? <UserRound className="size-3.5" /> : message.error ? <AlertTriangle className="size-3.5" /> : <Bot className="size-3.5" />}
                        {label}
                    </span>
                    <span className={isUser ? "text-cyan-100/75" : "text-subtle"}>
                        {formatTime(message.created_at)}
                    </span>
                </div>

                <div className="overflow-x-auto break-words text-[0.98rem] leading-7">
                    {isUser || message.error ? (
                        <p className="whitespace-pre-wrap">
                            {message.content || (message.pending ? "..." : "")}
                        </p>
                    ) : (
                        <div className="markdown-body">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const isInline = !match;

                                        if (isInline) {
                                            return (
                                                <code
                                                    className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[0.88em] accent-text"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        }

                                        return (
                                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101826] shadow-xl">
                                                <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-2 backdrop-blur-sm">
                                                    <span className="font-mono text-xs lowercase text-slate-400">
                                                        {match[1]}
                                                    </span>
                                                    <CopyButton text={String(children).replace(/\n$/, "")} />
                                                </div>
                                                <div className="chat-scroll overflow-x-auto">
                                                    <SyntaxHighlighter
                                                        PreTag="div"
                                                        className="!m-0 !bg-transparent text-[0.9rem]"
                                                        customStyle={{
                                                            background: "transparent",
                                                            margin: 0,
                                                            padding: "1rem",
                                                        }}
                                                        language={match[1]}
                                                        style={vscDarkPlus}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </div>
                                        );
                                    },
                                    blockquote({ children }) {
                                        return (
                                            <blockquote className="rounded-r-2xl border-l-4 border-cyan-400/60 bg-cyan-500/10 py-2 pl-4 text-muted">
                                                {children}
                                            </blockquote>
                                        );
                                    },
                                }}
                            >
                                {message.content || (message.pending ? "..." : "")}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
