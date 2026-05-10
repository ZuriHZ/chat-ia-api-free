import { MessageSquare, Plus, Trash2 } from "lucide-react";
import type { Conversation } from "../types";

interface ConversationListProps {
    conversations: Conversation[];
    currentConversationId: number | null;
    isCreatingConversation: boolean;
    isLoading: boolean;
    onCreateConversation: () => void | Promise<void>;
    onDeleteConversation: (conversationId: number) => void | Promise<void>;
    onSelectConversation: (conversationId: number) => void;
}

function formatConversationDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function ConversationList({
    conversations,
    currentConversationId,
    isCreatingConversation,
    isLoading,
    onCreateConversation,
    onDeleteConversation,
    onSelectConversation,
}: ConversationListProps) {
    return (
        <aside className="glass-panel flex max-h-[34vh] w-full flex-col overflow-hidden rounded-[1.75rem] lg:max-h-none lg:rounded-[2rem]">
            <div className="border-b border-white/5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.32em] accent-text">
                            Workspace
                        </p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary">
                            Conversaciones
                        </h2>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-muted">
                        {conversations.length}
                    </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted">
                    Historial ordenado, selección rápida y acciones visibles sin perder contexto.
                </p>

                <button
                    className="button-primary mt-5 w-full px-5 py-3 text-sm"
                    disabled={isCreatingConversation}
                    onClick={() => {
                        void onCreateConversation();
                    }}
                    type="button"
                >
                    <Plus className="size-4" />
                    {isCreatingConversation
                        ? "Creando conversación..."
                        : "Nueva conversación"}
                </button>
            </div>

            <div className="chat-scroll flex-1 overflow-y-auto p-3 sm:p-4">
                {isLoading && conversations.length === 0 ? (
                    <div className="space-y-3">
                        {[0, 1, 2].map((item) => (
                            <div
                                className="surface-card animate-pulse rounded-3xl p-4"
                                key={item}
                            >
                                <div className="h-4 w-3/4 rounded-full bg-slate-400/20" />
                                <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-400/10" />
                            </div>
                        ))}
                    </div>
                ) : null}

                {!isLoading && conversations.length === 0 ? (
                    <div className="surface-card rounded-3xl px-4 py-7 text-center text-sm leading-6 text-muted">
                        <MessageSquare className="mx-auto mb-3 size-8 accent-text" />
                        Aún no hay conversaciones guardadas. Crea la primera y el historial aparecerá aquí.
                    </div>
                ) : null}

                <div className="flex flex-col gap-2.5">
                    {conversations.map((conversation) => {
                        const isActive = conversation.id === currentConversationId;

                        return (
                            <div
                                className={`group cursor-pointer rounded-[1.35rem] border p-3.5 transition-all duration-200 hover:-translate-y-0.5 ${
                                    isActive
                                        ? "border-cyan-400/45 bg-cyan-500/15 shadow-[0_16px_42px_-28px_rgba(6,182,212,0.85)]"
                                        : "border-white/5 bg-white/[0.035] hover:border-white/10 hover:bg-white/[0.07]"
                                }`}
                                key={conversation.id}
                                onClick={() => onSelectConversation(conversation.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-2xl ${
                                            isActive
                                                ? "bg-cyan-400/20 text-cyan-200"
                                                : "bg-white/5 text-muted"
                                        }`}
                                    >
                                        <MessageSquare className="size-4" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className={`truncate text-sm font-semibold ${isActive ? "text-primary" : "text-primary"}`}>
                                            {conversation.title || "Sin título"}
                                        </p>
                                        <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-subtle">
                                            {formatConversationDate(conversation.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[0.68rem] font-semibold text-muted">
                                        #{conversation.id}
                                    </span>
                                    <button
                                        aria-label={`Eliminar ${conversation.title || "conversación"}`}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide transition ${
                                            isActive
                                                ? "bg-white/10 text-primary hover:bg-rose-500/15 hover:text-rose-300"
                                                : "bg-white/5 text-subtle opacity-100 hover:bg-rose-500/15 hover:text-rose-300 lg:opacity-0 lg:group-hover:opacity-100"
                                        }`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            void onDeleteConversation(conversation.id);
                                        }}
                                        type="button"
                                    >
                                        <Trash2 className="size-3.5" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
