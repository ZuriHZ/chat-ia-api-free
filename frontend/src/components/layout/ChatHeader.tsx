import { ModelSelector } from "../ModelSelector"
import type { Model } from "@/types"

interface ChatHeaderProps {
  currentConversationId: number | null
  isStreaming: boolean
  models: Model[]
  modelsLoading: boolean
  onModelChange: (modelId: string) => void
  selectedModel: string
}

export function ChatHeader({
  currentConversationId,
  isStreaming,
  models,
  modelsLoading,
  onModelChange,
  selectedModel,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-surface/50 px-4 backdrop-blur-md">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <h2 className="text-xs font-semibold text-foreground leading-none">
              {currentConversationId ? `Chat #${currentConversationId}` : "Nueva Conversación"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={isStreaming ? "flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" : "flex h-1.5 w-1.5 rounded-full bg-emerald-500"} />
              <span className="text-[10px] text-muted-foreground font-medium">
                {isStreaming ? "Generando respuesta..." : "Listo para chatear"}
              </span>
            </div>
          </div>
        </div>

        <div className="fixed top-4 right-4">
          <ModelSelector
            isLoading={modelsLoading}
            models={models}
            selectedModel={selectedModel}
            onChange={onModelChange}
          />
        </div>
      </div>
    </header>
  )
}
