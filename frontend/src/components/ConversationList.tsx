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
        <aside className="glass-panel flex w-full flex-col rounded-4xl lg:max-w-[320px]">
            <div className="border-b border-white/5 px-6 py-6">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-cyan-400">
                    Navegación
                </p>
                <h2 className="mt-2 font-semibold text-2xl text-slate-100">
                    Conversaciones
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                    Cambia entre historiales guardados o abre una nueva sala de chat para empezar desde cero.
                </p>

                <button
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:pointer-events-none disabled:opacity-50"
                    disabled={isCreatingConversation}
                    onClick={() => {
                        void onCreateConversation();
                    }}
                    type="button"
                >
                    {isCreatingConversation
                        ? "Creando conversación..."
                        : "Nueva conversación"}
                </button>
            </div>

            <div className="chat-scroll max-h-96 flex-1 overflow-y-auto px-4 py-4 lg:max-h-none">
                {isLoading && conversations.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400 text-center animate-pulse">
                        Cargando conversaciones...
                    </div>
                ) : null}

                {!isLoading && conversations.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm leading-6 text-slate-400 text-center">
                        Aún no hay conversaciones guardadas. Crea la primera y el
                        historial aparecerá aquí.
                    </div>
                ) : null}

                <div className="flex flex-col gap-3">
                    {conversations.map((conversation) => {
                        const isActive = conversation.id === currentConversationId;

                        return (
                            <div
                                className={`group rounded-[1.25rem] border px-4 py-4 transition-all cursor-pointer ${
                                    isActive
                                        ? "border-cyan-500/50 bg-cyan-950/30 shadow-[0_8px_30px_-12px_rgba(6,182,212,0.4)]"
                                        : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                                }`}
                                key={conversation.id}
                                onClick={() => onSelectConversation(conversation.id)}
                            >
                                <div className="w-full text-left">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className={`truncate text-sm font-medium ${isActive ? "text-cyan-100" : "text-slate-200"}`}>
                                                {conversation.title || "Sin título"}
                                            </p>
                                            <p
                                                className={`mt-1 text-[0.7rem] uppercase tracking-[0.2em] ${
                                                    isActive
                                                        ? "text-cyan-400/80"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {formatConversationDate(
                                                    conversation.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-[0.7rem] font-medium transition-all uppercase tracking-wider ${
                                        isActive
                                            ? "bg-white/10 text-white hover:bg-rose-500/20 hover:text-rose-400"
                                            : "bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 opacity-0 lg:group-hover:opacity-100"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        void onDeleteConversation(conversation.id);
                                    }}
                                    type="button"
                                >
                                    Eliminar
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
