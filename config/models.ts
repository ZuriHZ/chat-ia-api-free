export interface ModelConfig {
    id: string;
    label: string;
}

// Modelos gratuitos verificados que funcionan en 2026
export const AVAILABLE_MODELS: ModelConfig[] = [
    // Los más estables y rápidos
    { id: "openrouter/free", label: "✨ Auto Elige (Recomendado)" },
    { id: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3 (Mejor General)" },
    { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1 (Razonamiento)" },
    { id: "meta-llama/llama-4-maverick:free", label: "Meta Llama 4 Maverick" },
    
    // Qwen - muy bons para coding
    { id: "qwen/qwen3-235b-a22b:free", label: "Qwen 3 (235B Coding)" },
    { id: "qwen/qwen3-32b-a3b-instruct:free", label: "Qwen 3 (32B)" },
    { id: "qwen/qwen3-4b:free", label: "Qwen 3 (4B Rápido)" },
    
    // Mistral - eficiente
    { id: "mistralai/mistral-small-3.1-24b-instruct:free", label: "Mistral Small 3.1" },
    
    // NVIDIA
    { id: "nvidia/nemotron-3-super-120b-a12b:free", label: "NVIDIA Nemotron 3 Super" },
    { id: "nvidia/nemotron-nano-9b-v2:free", label: "NVIDIA Nemotron Nano (9B)" },
    
    // Google Gemma
    { id: "google/gemma-3-27b-it:free", label: "Google Gemma 3 (27B)" },
    { id: "google/gemma-3-12b-it:free", label: "Google Gemma 3 (12B)" },
    { id: "google/gemma-3-4b-it:free", label: "Google Gemma 3 (4B)" },
    
    // Meta Llama
    { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Meta Llama 3.3 (70B)" },
    { id: "meta-llama/llama-3.2-3b-instruct:free", label: "Meta Llama 3.2 (3B)" },
    
    // Otros
    { id: "minimax/minimax-m2.5:free", label: "MiniMax M2.5" },
    { id: "stepfun/step-3.5-flash:free", label: "StepFun 3.5 Flash" },
    { id: "z-ai/glm-4.5-air:free", label: "Z-AI GLM-4.5 Air" },
    { id: "liquid/lfm-2.5-1.2b-instruct:free", label: "Liquid LFM 2.5" },
];