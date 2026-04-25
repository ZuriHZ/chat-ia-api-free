# 🚀 Chat IA Migration - Frontend

Un frontend moderno y premium para interactuar con modelos de Inteligencia Artificial en tiempo real. Construido con las mejores prácticas y un enfoque absoluto en la experiencia de usuario.

## ✨ Características Principales

- **Diseño Premium**: Interfaz en "Dark Mode" elegante, utilizando glassmorphism (efectos de cristal), paletas de colores HSL armoniosas (Slate, Cyan, Rose) y micro-animaciones fluidas.
- **Streaming en Vivo**: Las respuestas de los modelos de IA se renderizan en tiempo real (chunk por chunk), brindando una experiencia rápida y dinámica.
- **Gestión de Conversaciones**: Puedes crear, eliminar y cambiar entre diferentes historiales de chat de forma instantánea.
- **Selección de Modelos**: Permite cambiar dinámicamente entre distintos modelos de IA sin salir de la conversación, consultando la disponibilidad de OpenRouter (gratuito) desde el backend.
- **Arquitectura Optimizada**: Desarrollado con las versiones más recientes de las tecnologías top del ecosistema frontend.

## 🛠️ Stack Tecnológico

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Manejo de Estado**: [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Linting**: ESLint (configuración estricta) + React Compiler

## 📂 Estructura del Proyecto

El proyecto sigue una estructura limpia, separando la lógica visual de la de negocio:

```text
src/
├── components/           # Componentes UI reutilizables (Chat, Input, Sidebar)
│   ├── ChatContainer.tsx # Contenedor principal de mensajes
│   ├── ChatInput.tsx     # Área de texto inteligente
│   ├── ChatMessage.tsx   # Burbujas de mensajes (User/IA)
│   ├── ConversationList.tsx # Sidebar de historial
│   └── ModelSelector.tsx # Selector dinámico de modelos
├── hooks/
│   └── useChat.ts        # Lógica central del chat (API calls, streaming, Zustand sync)
├── stores/
│   └── chatStore.ts      # Estado global de Zustand (conversaciones, modelo actual)
├── types/
│   └── index.ts          # Definiciones de TypeScript compartidas
├── App.tsx               # Shell de la aplicación
├── index.css             # Estilos globales y variables (Dark Mode Glass)
└── main.tsx              # Punto de entrada de React
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (v18 o superior)
- `pnpm` (recomendado) o `npm`

### Paso a paso

1. **Clonar el repositorio** e ir a la carpeta del frontend.
2. **Instalar dependencias**:

   ```bash
   pnpm install
   ```

3. **Configurar entorno**:
   Asegúrate de tener un backend corriendo en `http://localhost:3000` o configura tu `.env` si es necesario modificar la URL de la API.
4. **Ejecutar en desarrollo**:

   ```bash
   pnpm dev
   ```

5. **Visitar en el navegador**:
   Abre [http://localhost:5173](http://localhost:5173) y empieza a chatear.

## 💅 Decisiones de Diseño (UI/UX)

- **Dark Mode Nativo**: Tonos `slate-900` para fondos profundos que alivian la fatiga visual.
- **Glassmorphism**: Efectos de `backdrop-blur-md` y bordes semitransparentes (`border-white/5`) para dar profundidad a la interfaz principal (`App-shell`).
- **Acentos Vibrantes**: Uso de gradientes de `cyan-500` a `blue-500` en los botones de llamada a la acción y estados activos, creando contraste premium.
- **Tipografía**: Importada la familia `Inter` de Google Fonts para una lectura digital óptima.
- **Scroll Inteligente**: Contenedores optimizados para esconder las barras de scroll nativas y usar barras `thin` y traslúcidas que no interfieren con el diseño.

## 🤝 Integración Backend

El frontend está configurado para comunicarse con un backend local. Los endpoints principales son:

- `GET /api/models`: Obtiene los modelos de IA disponibles.
- `GET /api/conversations`: Recupera el historial.
- `POST /api/chat`: Envía los mensajes e inicia el canal de **Server-Sent Events (SSE)** para el streaming.

---
*Desarrollado para ofrecer la mejor experiencia de chat IA.*
