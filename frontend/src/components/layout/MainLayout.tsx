import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import type { Conversation } from "@/types"

interface MainLayoutProps {
  children: React.ReactNode
  conversations: Conversation[]
  currentConversationId: number | null
  isCreatingConversation: boolean
  isLoading: boolean
  onCreateConversation: () => void | Promise<void>
  onDeleteConversation: (conversationId: number) => void | Promise<void>
  onSelectConversation: (conversationId: number) => void
}

export function MainLayout({
  children,
  conversations,
  currentConversationId,
  isCreatingConversation,
  isLoading,
  onCreateConversation,
  onDeleteConversation,
  onSelectConversation,
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        isCreatingConversation={isCreatingConversation}
        isLoading={isLoading}
        onCreateConversation={onCreateConversation}
        onDeleteConversation={onDeleteConversation}
        onSelectConversation={onSelectConversation}
      />
      <SidebarInset className="flex flex-col flex-1 min-w-0 h-screen bg-background overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
