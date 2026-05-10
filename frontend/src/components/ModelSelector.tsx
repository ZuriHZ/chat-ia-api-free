import { ChevronDown } from "lucide-react";
import type { Model } from "../types";

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
        <label className="flex min-w-0 flex-col gap-1.5">
            <span className="ml-1 text-[0.65rem] font-extrabold uppercase tracking-[0.26em] text-subtle">
                Modelo IA
            </span>

            <span className="relative block">
                <select
                    className="w-full min-w-[180px] appearance-none rounded-full border border-white/10 bg-white/[0.07] px-4 py-2.5 pr-10 text-sm font-semibold text-primary shadow-sm outline-none transition-all hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoading}
                    onChange={(event) => onChange(event.target.value)}
                    value={selectedModel}
                >
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            </span>
        </label>
    );
}
