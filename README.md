# 🤖 Chat IA API Free — Monorepo Fullstack

Plataforma de chat impulsada por Inteligencia Artificial con streaming en tiempo real, load balancing automático entre modelos y UI premium con glassmorphism.

---

## 📁 Estructura del Proyecto

```
Chat-ia-api-free/
├── backend/                    # 🚀 Backend Bun + OpenRouter
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── chat/          # Streaming de IA
│   │   │   ├── conversations/ # CRUD conversaciones
│   │   │   ├── messages/      # CRUD mensajes
│   │   │   └── users/         # Gestión de usuarios
│   │   ├── router.ts          # Router centralizado
│   │   └── shared/            # Utilidades compartidas
│   ├── config/
│   │   ├── models.ts          # Modelos IA disponibles
│   │   └── db.ts              # Config PostgreSQL/SQLite
│   ├── index.ts               # Entry point Bun.serve()
│   └── package.json
├── frontend/                   # 💎 Frontend React 19 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   ├── layout/
│   │   │   └── ui/            # Shadcn/UI
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.ts         # Cliente API
│   │   ├── stores/
│   │   │   └── chatStore.ts   # Zustand store
│   │   └── types/
│   ├── vite.config.ts
│   └── package.json
├── scripts/                    # Scripts de utilidad
├── docs/                        # Documentación
└── package.json                 # Workspace root
```

---

## 🛠️ Stack Tecnológico

### Backend (Bun)
| Componente | Tecnología |
|------------|------------|
| Runtime | Bun |
| IA Gateway | OpenRouter SDK |
| Base de Datos | PostgreSQL / SQLite |
| Streaming | Server-Sent Events (SSE) |
| CORS | Headers personalizados |

### Frontend (React)
| Componente | Tecnología |
|------------|------------|
| Core | React 19 + TypeScript 6 |
| Build | Vite 8 + React Compiler |
| State | Zustand 5 |
| Estilos | Tailwind CSS 4 |
| UI | Shadcn/UI + Radix UI |
| Markdown | react-markdown + remark-gfm |
| Sintaxis | react-syntax-highlighter |
| Animaciones | Framer Motion |

---

## ✨ Características Principales

### 🧠 Inteligencia Artificial
- **Load Balancing automático**: Distribuye carga entre múltiples modelos IA
- **Fallback inteligente**: Si un modelo falla, intenta con otro automáticamente
- **Streaming en tiempo real**: Respuestas progresivas con SSE
- **Selección dinámica**: Cambiar de modelo en cualquier momento
- **Múltiples proveedores**: Soporte para OpenRouter y modelos gratuitos

### 💬 Chat Avanzado
- Conversaciones persistentes en base de datos
- Historial completo de mensajes
- Renderizado de Markdown con syntax highlighting
- Soporte para código con copy-to-clipboard
- Scroll automático suave

### 🎨 UI Premium
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Dark Mode**: Tema oscuro por defecto
- **Responsive**: Adaptado a desktop y móvil
- **Animaciones suaves**: Transiciones con Framer Motion
- **Componentes Radix**: Base accesible y performante

### 🔧 Backend Robusteo
- API REST completa (CRUD users, conversations, messages)
- Health check endpoint
- CORS configurado para desarrollo
- Puerto auto-detectado

---

## 💻 Desarrollo Local

### Requisitos
- [Bun](https://bun.sh) (para el backend)
- [pnpm](https://pnpm.io) (para el frontend)
- Base de datos PostgreSQL (o SQLite para desarrollo)

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd Chat-ia-api-free

# Instalar dependencias del backend
cd backend
bun install

# Configurar backend
cp .env.example .env
# Editar .env con tus variables

# Instalar dependencias del frontend
cd ../frontend
pnpm install

# Configurar frontend
cp .env.example .env
# Editar .env con la URL del backend
```

### Variables de Entorno

**Backend (`backend/.env`)**
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/chatdb
# Opcional: SQLite
# DATABASE_URL=file:./dev.db
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:3000
```

### Comandos de Desarrollo

```bash
# Backend (desde la raíz)
bun run dev:back

# Frontend (desde la raíz)
bun run dev:front

# Ambos simultáneamente
bun run dev
```

---

## 🌩️ Despliegue Dokploy

### Paso 1: Preparar Base de Datos
1. Crear instancia PostgreSQL en Dokploy
2. Crear base de datos y usuario
3. Copiar la connection string

### Paso 2: Configurar Backend
1. Crear servicio Docker en Dokploy
2. Build: `bun build index.ts --compile --minify --outfile api-bun`
3. Variables de entorno:
   - `DATABASE_URL=tu-connection-string`
   - `PORT=3000`
4. Exponer puerto 3000

### Paso 3: Configurar Frontend
1. Crear servicio estático
2. Build: `pnpm install && pnpm build`
3. Servir desde `dist/`
4. Variables de entorno:
   - `VITE_API_URL=https://tu-backend.dokploy.dev`

### Paso 4: Docker Compose (Opcional)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/chatdb
      - PORT=3000
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: chatdb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 📂 Mapa Detallado del Proyecto

### Backend — Archivos Clave
| Archivo | Descripción |
|---------|-------------|
| `index.ts` | Entry point, servidor Bun, rutas principales |
| `src/router.ts` | Router centralizado con patrones dinámicos |
| `src/controllers/chat/` | Lógica de streaming IA con OpenRouter |
| `src/controllers/conversations/` | CRUD de conversaciones |
| `src/controllers/messages/` | CRUD de mensajes |
| `src/controllers/users/` | Gestión de usuarios |
| `config/models.ts` | Lista de modelos IA disponibles |
| `config/db.ts` | Conexión a PostgreSQL/SQLite |

### Frontend — Archivos Clave
| Archivo | Descripción |
|---------|-------------|
| `src/components/ChatContainer.tsx` | Contenedor principal del chat |
| `src/components/ChatInput.tsx` | Input de mensajes |
| `src/components/ChatMessage.tsx` | Renderizado de mensajes |
| `src/components/ModelSelector.tsx` | Selector de modelos IA |
| `src/components/ConversationList.tsx` | Lista de conversaciones |
| `src/stores/chatStore.ts` | Estado global (Zustand) |
| `src/services/api.ts` | Cliente API con fetch |

---

## 🤝 Integración Backend-Frontend

### Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Estado del servidor |
| `GET` | `/models` | Modelos IA disponibles |
| `POST` | `/api/chat` | Enviar mensaje (streaming) |
| `GET` | `/api/users` | Listar usuarios |
| `POST` | `/api/users` | Crear usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |
| `GET` | `/api/conversations` | Listar conversaciones |
| `POST` | `/api/conversations` | Crear conversación |
| `GET` | `/api/conversations/:id` | Obtener conversación |
| `DELETE` | `/api/conversations/:id` | Eliminar conversación |
| `GET` | `/api/messages` | Listar mensajes |
| `POST` | `/api/messages` | Crear mensaje |
| `DELETE` | `/api/messages/:id` | Eliminar mensaje |

### Flujo de Streaming
1. Frontend envía POST a `/api/chat` con `{ message, model, conversationId }`
2. Backend conecta con OpenRouter y retorna stream
3. Frontend renderiza tokens progresivamente
4. Mensajes se guardan en base de datos

---

## 🎨 Decisiones de Diseño

- **Glassmorphism**: Bordes semitransparentes con blur de fondo para profundidad visual
- **Color Scheme**: Primario azul/violeta, surface oscuro, acentos cálidos
- **Tipografía**: Sistema de fuentes del sistema para rendimiento
- **Componentes**: Shadcn/UI como base, extendidos con estilos propios
- **Dark Mode**: Tema por defecto con soporte para light vía CSS variables

---

## 🚀 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Desarrollo simultáneo backend + frontend |
| `bun run dev:back` | Solo backend (Bun watch) |
| `bun run dev:front` | Solo frontend (Vite) |
| `bun run build:all` | Build de producción ambos |
| `bun run install:all` | Instalar dependencias ambos |

---

> 💡 **Construido con Bun + React 19** — Experiencia de chat IA premium con streaming y load balancing inteligente.
