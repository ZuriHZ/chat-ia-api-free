import type { Model } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModelSelectorProps {
    isLoading: boolean;
    models: Model[];
    onChange: (modelId: string) => void;
    selectedModel: string;
}

export function ModelSelector({
    isLoading,
    models,
    onChange,
    selectedModel,
}: ModelSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
                Modelo
            </span>
            <Select
                disabled={isLoading}
                value={selectedModel}
                onValueChange={onChange}
            >
                <SelectTrigger className="h-8 w-full sm:w-[180px] rounded-full bg-surface border-border hover:bg-accent transition-colors">
                    <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-surface">
                    {models.map((model) => (
                        <SelectItem key={model.id} value={model.id} className="rounded-lg">
                            {model.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
