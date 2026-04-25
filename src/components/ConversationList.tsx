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
        <aside className="glass-panel flex w-full flex-col rounded-[2rem] border border-stone-200/70 lg:max-w-sm">
            <div className="border-b border-stone-200/80 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-700">
                    Navegacion
                </p>
                <h2 className="mt-2 font-serif text-3xl text-stone-950">
                    Conversaciones
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                    Cambia entre historiales guardados o abre una nueva sala de
                    chat para empezar desde cero.
                </p>

                <button
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300"
                    disabled={isCreatingConversation}
                    onClick={() => {
                        void onCreateConversation();
                    }}
                    type="button"
                >
                    {isCreatingConversation
                        ? "Creando conversacion..."
                        : "Nueva conversacion"}
                </button>
            </div>

            <div className="chat-scroll max-h-[24rem] flex-1 overflow-y-auto px-3 py-3 lg:max-h-none">
                {isLoading && conversations.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-stone-300 px-4 py-5 text-sm text-stone-600">
                        Cargando conversaciones...
                    </div>
                ) : null}

                {!isLoading && conversations.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white/70 px-4 py-5 text-sm leading-6 text-stone-600">
                        Aun no hay conversaciones guardadas. Crea la primera y el
                        historial aparecera aqui.
                    </div>
                ) : null}

                <div className="flex flex-col gap-2">
                    {conversations.map((conversation) => {
                        const isActive = conversation.id === currentConversationId;

                        return (
                            <div
                                className={`group rounded-[1.5rem] border px-4 py-4 transition ${
                                    isActive
                                        ? "border-teal-700 bg-teal-950 text-white shadow-[0_16px_45px_-30px_rgba(15,118,110,0.75)]"
                                        : "border-stone-200 bg-white/80 text-stone-800 hover:border-stone-300"
                                }`}
                                key={conversation.id}
                            >
                                <button
                                    className="w-full text-left"
                                    onClick={() => onSelectConversation(conversation.id)}
                                    type="button"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {conversation.title || "Sin titulo"}
                                            </p>
                                            <p
                                                className={`mt-2 text-[0.7rem] uppercase tracking-[0.28em] ${
                                                    isActive
                                                        ? "text-teal-100/85"
                                                        : "text-stone-500"
                                                }`}
                                            >
                                                {formatConversationDate(
                                                    conversation.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    className={`mt-4 inline-flex rounded-full px-3 py-2 text-xs font-medium transition ${
                                        isActive
                                            ? "bg-white/12 text-white hover:bg-white/20"
                                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                                    }`}
                                    onClick={() => {
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
