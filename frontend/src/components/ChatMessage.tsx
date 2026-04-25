import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
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

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            title="Copiar código"
            type="button"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado!" : "Copiar"}
        </button>
    );
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <article
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[95%] rounded-[1.75rem] px-6 py-5 shadow-sm sm:max-w-[85%] transition-all ${
                    isUser
                        ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-cyan-500/20"
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

                <div className="text-[0.95rem] leading-relaxed break-words overflow-x-auto">
                    {isUser || message.error ? (
                        <p className="whitespace-pre-wrap">{message.content || (message.pending ? "..." : "")}</p>
                    ) : (
                        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-4">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                            components={{
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                code({ node, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const isInline = !match;

                                    if (isInline) {
                                        return (
                                            <code className="bg-black/20 text-cyan-200 px-1.5 py-0.5 rounded-md font-mono text-[0.85em]" {...props}>
                                                {children}
                                            </code>
                                        );
                                    }

                                    return (
                                        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-lg">
                                            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/5 backdrop-blur-sm">
                                                <span className="text-xs font-mono text-slate-400 lowercase">{match[1]}</span>
                                                <CopyButton text={String(children).replace(/\n$/, "")} />
                                            </div>
                                            <div className="chat-scroll overflow-x-auto">
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="!m-0 !bg-transparent text-[0.9rem]"
                                                    customStyle={{ padding: "1rem", margin: 0, background: "transparent" }}
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            </div>
                                        </div>
                                    );
                                },
                                p({ children }) {
                                    return <p className="mb-4 last:mb-0">{children}</p>;
                                },
                                ul({ children }) {
                                    return <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>;
                                },
                                ol({ children }) {
                                    return <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>;
                                },
                                a({ children, href }) {
                                    return <a href={href} className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">{children}</a>;
                                },
                                h1({ children }) {
                                    return <h1 className="text-2xl font-bold mb-4 mt-6 text-slate-100">{children}</h1>;
                                },
                                h2({ children }) {
                                    return <h2 className="text-xl font-bold mb-3 mt-5 text-slate-100">{children}</h2>;
                                },
                                h3({ children }) {
                                    return <h3 className="text-lg font-bold mb-2 mt-4 text-slate-100">{children}</h3>;
                                },
                                blockquote({ children }) {
                                    return <blockquote className="border-l-4 border-cyan-500/50 pl-4 py-1 my-4 bg-cyan-950/20 italic text-slate-300 rounded-r-lg">{children}</blockquote>;
                                }
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
