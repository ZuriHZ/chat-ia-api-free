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
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-slate-500 ml-1">
                Modelo IA
            </span>

            <select
                className="min-w-[140px] appearance-none rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 outline-none transition-all hover:border-white/20 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
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
        </label>
    );
}
