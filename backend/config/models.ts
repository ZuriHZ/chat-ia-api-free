export interface ModelConfig {
    id: string;
    label: string;
}

// Modelos gratuitos verificados en OpenRouter — actualizado 2026-05-09
export const AVAILABLE_MODELS: ModelConfig[] = [
    // --- Top tier: los más potentes y confiables ---
    { id: "nousresearch/hermes-3-llama-3.1-405b:free", label: "🏆 Hermes 3 (405B — Mejor General)" },
    { id: "openai/gpt-oss-120b:free", label: "🧠 GPT-OSS (120B)" },

    // --- Coding / razonamiento ---
    { id: "qwen/qwen3-coder:free", label: "💻 Qwen 3 Coder" },
    { id: "qwen/qwen3-next-80b-a3b-instruct:free", label: "🔬 Qwen 3 Next (80B)" },
    { id: "liquid/lfm-2.5-1.2b-thinking:free", label: "🤔 Liquid LFM 2.5 Thinking" },

    // --- Google Gemma 4 ---
    { id: "google/gemma-4-26b-a4b-it:free", label: "✨ Google Gemma 4 (26B)" },

    // --- Google Gemma 3 (los que funcionan) ---
    { id: "google/gemma-3-27b-it:free", label: "💎 Google Gemma 3 (27B)" },
    { id: "google/gemma-3-4b-it:free", label: "💎 Google Gemma 3 (4B Rápido)" },
    { id: "google/gemma-3n-e4b-it:free", label: "💎 Google Gemma 3N (4B Edge)" },

    // --- NVIDIA Nemotron (los que funcionan) ---
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", label: "🟢 NVIDIA Nemotron 3 Nano (30B)" },
    { id: "nvidia/nemotron-nano-9b-v2:free", label: "🟢 NVIDIA Nemotron Nano (9B)" },

    // --- OpenAI OSS ---
    { id: "openai/gpt-oss-20b:free", label: "🧠 GPT-OSS (20B)" },

    // --- Otros que funcionan ---
    { id: "inclusionai/ling-2.6-flash:free", label: "🌐 InclusionAI Ling 2.6 Flash" },
    { id: "minimax/minimax-m2.5:free", label: "📱 MiniMax M2.5" },
    { id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free", label: "🐬 Dolphin Mistral (24B)" },
    { id: "z-ai/glm-4.5-air:free", label: "🌊 Z-AI GLM-4.5 Air" },
    { id: "liquid/lfm-2.5-1.2b-instruct:free", label: "💧 Liquid LFM 2.5 Instruct" },
    { id: "meta-llama/llama-3.2-3b-instruct:free", label: "🦙 Meta Llama 3.2 (3B)" },
    { id: "google/gemma-3-12b-it:free", label: "💎 Google Gemma 3 (12B)" },
];