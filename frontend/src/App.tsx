import { useState } from "react";
import { Moon, PanelLeft, Sparkles, Sun } from "lucide-react";
import { ChatContainer } from "./components/ChatContainer";
import { ConversationList } from "./components/ConversationList";
import { useChat } from "./hooks/useChat";

function App() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const {
        canRetry,
        conversations,
        currentConversationId,
        error,
        handleCreateConversation,
        handleDeleteConversation,
        handleRetry,
        handleSelectConversation,
        handleSendMessage,
        isBootstrapping,
        isCreatingConversation,
        isLoadingMessages,
        isStreaming,
        messages,
        models,
        modelsLoading,
        selectedModel,
        setSelectedModel,
    } = useChat();

    const isLight = theme === "light";

    return (
        <div className="app-shell h-screen text-primary" data-theme={theme}>
            <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col gap-4 overflow-hidden p-3 sm:p-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-5 lg:p-6 xl:p-8">
                <div className="glass-panel flex items-center justify-between gap-3 rounded-[1.6rem] px-4 py-3 lg:hidden">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-cyan-500/15 accent-text">
                            <PanelLeft className="size-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] accent-text">
                                Chat IA
                            </p>
                            <p className="truncate text-sm text-muted">
                                {conversations.length} conversaciones disponibles
                            </p>
                        </div>
                    </div>

                    <button
                        aria-label="Cambiar tema"
                        className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-muted transition hover:bg-white/10 hover:text-primary"
                        onClick={() => setTheme(isLight ? "dark" : "light")}
                        type="button"
                    >
                        {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
                    </button>
                </div>

                <ConversationList
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    isCreatingConversation={isCreatingConversation}
                    isLoading={isBootstrapping}
                    onCreateConversation={handleCreateConversation}
                    onDeleteConversation={handleDeleteConversation}
                    onSelectConversation={handleSelectConversation}
                />

                <main className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] lg:rounded-[2rem]">
                    <div className="hidden items-center justify-between border-b border-white/5 px-6 py-3 lg:flex">
                        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] accent-text">
                            <Sparkles className="size-3.5" />
                            Experiencia optimizada
                        </div>

                        <button
                            aria-label="Cambiar tema"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-primary"
                            onClick={() => setTheme(isLight ? "dark" : "light")}
                            type="button"
                        >
                            {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
                            {isLight ? "Oscuro" : "Claro"}
                        </button>
                    </div>

                    <ChatContainer
                        canRetry={canRetry}
                        currentConversationId={currentConversationId}
                        error={error}
                        isBootstrapping={isBootstrapping}
                        isLoadingMessages={isLoadingMessages}
                        isStreaming={isStreaming}
                        messages={messages}
                        models={models}
                        modelsLoading={modelsLoading}
                        onModelChange={setSelectedModel}
                        onRetry={handleRetry}
                        onSubmit={handleSendMessage}
                        selectedModel={selectedModel}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
