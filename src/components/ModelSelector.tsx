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
        <label className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                Modelo IA
            </span>

            <select
                className="min-w-0 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-teal-600"
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
