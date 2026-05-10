import { ChatContainer } from "./components/ChatContainer";
import { MainLayout } from "./components/layout/MainLayout";
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
        <MainLayout
            conversations={conversations}
            currentConversationId={currentConversationId}
            isCreatingConversation={isCreatingConversation}
            isLoading={isBootstrapping}
            onCreateConversation={handleCreateConversation}
            onDeleteConversation={handleDeleteConversation}
            onSelectConversation={handleSelectConversation}
        >
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
        </MainLayout>
    );
}

export default App;
