import { ChatContainer } from "./components/ChatContainer";
import { ConversationList } from "./components/ConversationList";
import { useChat } from "./hooks/useChat";

function App() {
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

    return (
        <div className="app-shell h-screen text-slate-200">
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 overflow-hidden px-4 py-6 lg:flex-row lg:px-8">
                <ConversationList
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    isCreatingConversation={isCreatingConversation}
                    isLoading={isBootstrapping}
                    onCreateConversation={handleCreateConversation}
                    onDeleteConversation={handleDeleteConversation}
                    onSelectConversation={handleSelectConversation}
                />

                <main className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-4xl">
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
