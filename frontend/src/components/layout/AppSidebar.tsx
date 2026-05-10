import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Plus,
    MessageSquare,
    Trash2,
    Settings,
    Archive,
    Sparkles,
} from "lucide-react";
import type { Conversation } from "@/types";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
    conversations: Conversation[];
    currentConversationId: number | null;
    isCreatingConversation: boolean;
    isLoading: boolean;
    onCreateConversation: () => void | Promise<void>;
    onDeleteConversation: (conversationId: number) => void | Promise<void>;
    onSelectConversation: (conversationId: number) => void;
}

export function AppSidebar({
    conversations,
    currentConversationId,
    isCreatingConversation,
    isLoading,
    onCreateConversation,
    onDeleteConversation,
    onSelectConversation,
}: AppSidebarProps) {
    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-border bg-surface z-20"
        >
            <SidebarHeader className="p-2 mt-14">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Sparkles size={16} />
                        </div>
                        <span className="font-bold text-base tracking-tight truncate group-data-[collapsible=icon]:hidden">
                            Pro-AI Console
                        </span>
                    </div>
                    <SidebarTrigger className="h-8 w-8 hover:bg-muted translate-x-11  " />
                </div>

                <button
                    onClick={() => void onCreateConversation()}
                    disabled={isCreatingConversation}
                    title="Nueva Conversación"
                    className={cn(
                        "flex w-full items-center gap-2 rounded-xl bg-primary px-2 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[0.98] active:scale-95 disabled:opacity-50 shadow-sm shadow-primary/10",
                        "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 cursor-pointer",
                    )}
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="group-data-[collapsible=icon]:hidden">
                        {isCreatingConversation ? "Creando..." : "Nuevo Chat"}
                    </span>
                </button>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        Conversaciones
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {isLoading && conversations.length === 0 ? (
                                <div className="px-4 py-3 text-xs text-muted-foreground animate-pulse group-data-[collapsible=icon]:hidden">
                                    Cargando...
                                </div>
                            ) : null}

                            {conversations.map((conversation) => (
                                <SidebarMenuItem key={conversation.id}>
                                    <SidebarMenuButton
                                        isActive={
                                            conversation.id ===
                                            currentConversationId
                                        }
                                        onClick={() =>
                                            onSelectConversation(
                                                conversation.id,
                                            )
                                        }
                                        className="group/item py-5 rounded-lg data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                                        tooltip={
                                            conversation.title ||
                                            "Chat sin título"
                                        }
                                    >
                                        <MessageSquare
                                            size={16}
                                            className={cn(
                                                "shrink-0",
                                                conversation.id ===
                                                    currentConversationId
                                                    ? "text-primary"
                                                    : "text-muted-foreground/70",
                                            )}
                                        />
                                        <span className="truncate font-medium">
                                            {conversation.title ||
                                                "Chat sin título"}
                                        </span>
                                    </SidebarMenuButton>
                                    <SidebarMenuAction
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            void onDeleteConversation(
                                                conversation.id,
                                            );
                                        }}
                                        showOnHover
                                        className="hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 size={14} />
                                    </SidebarMenuAction>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        Librería
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip="Archivados"
                                    className="py-5"
                                >
                                    <Archive
                                        size={16}
                                        className="text-muted-foreground/70 translate-x-1"
                                    />
                                    <span className="group-data-[collapsible=icon]:hidden font-medium ">
                                        Archivados
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3 border-t border-border/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Configuración"
                            className="py-5 rounded-lg hover:bg-muted/50"
                        >
                            <Settings
                                size={16}
                                className="text-muted-foreground/70 translate-x-1.5"
                            />
                            <span className="group-data-[collapsible=icon]:hidden font-medium">
                                Ajustes
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
