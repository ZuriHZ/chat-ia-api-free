import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User } from "lucide-react";
import type { Message } from "../types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            title="Copiar código"
            type="button"
        >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copiado" : "Copiar"}
        </button>
    );
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "group relative flex w-full gap-4 px-2 py-1 animate-in fade-in slide-in-from-bottom-3 duration-500",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <Avatar className={cn(
                "h-8 w-8 shrink-0 border mt-0.5",
                isUser ? "bg-primary border-primary/20" : "bg-surface border-border"
            )}>
                <AvatarFallback className="text-[10px] font-bold">
                    {isUser ? <User size={14} /> : <Bot size={14} className="text-primary" />}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]",
                isUser ? "items-end" : "items-start"
            )}>
                <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        {isUser ? "Tú" : "AI Assistant"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                        {formatTime(message.created_at)}
                    </span>
                </div>

                <div
                    className={cn(
                        "relative rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm transition-all",
                        isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : message.error
                              ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-none"
                              : "bg-surface/80 border border-border text-foreground backdrop-blur-md rounded-tl-none shadow-black/5"
                    )}
                >
                    <div className="prose prose-invert prose-sm max-w-none wrap-break-word">
                        {isUser || message.error ? (
                            <p className="whitespace-pre-wrap m-0 font-sans">{message.content || (message.pending ? "..." : "")}</p>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const isInline = !match;

                                        if (isInline) {
                                            return (
                                                <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-mono text-[0.85em]" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }

                                        return (
                                            <div className="my-4 overflow-hidden rounded-xl border border-border bg-[#0d1117] shadow-xl">
                                                <div className="flex items-center justify-between bg-surface/50 px-4 py-2 border-b border-border">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{match[1]}</span>
                                                    <CopyButton text={String(children).replace(/\n$/, "")} />
                                                </div>
                                                <div className="chat-scroll overflow-x-auto">
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        className="m-0! bg-transparent! text-[0.85rem]"
                                                        customStyle={{ padding: "1.25rem", margin: 0, background: "transparent" }}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </div>
                                        );
                                    },
                                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                                    a: ({ children, href }) => <a href={href} className="text-primary hover:underline underline-offset-4 font-medium transition-all" target="_blank" rel="noreferrer">{children}</a>,
                                    blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/50 pl-4 py-1 my-4 bg-primary/5 italic text-muted-foreground rounded-r-lg">{children}</blockquote>,
                                    h1: ({ children }) => <h1 className="text-xl font-bold mb-4 mt-6 text-foreground tracking-tight">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-lg font-bold mb-3 mt-5 text-foreground tracking-tight">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-4 text-foreground tracking-tight">{children}</h3>,
                                }}
                            >
                                {message.content || (message.pending ? "..." : "")}
                            </ReactMarkdown>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
