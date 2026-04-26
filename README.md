# 🚀 Chat IA - API Bun & React (Monorepo)

Este es un proyecto unificado que combina un **Backend** ultrarrápido con Bun y un **Frontend** moderno con React + Vite.

## 📁 Estructura del Proyecto

El proyecto está organizado como un **Monorepo**:

- **`/backend`**: API construida 100% nativa con Bun, PostgreSQL (o SQLite) y OpenRouter.
- **`/frontend`**: Aplicación web construida con React 19, Vite, TailwindCSS y Zustand.

## 🛠️ Tecnologías

### Backend (Bun)

- **Runtime:** Bun.serve (nativo)
- **DB:** PostgreSQL (nativo `bun:sql`) o SQLite.
- **IA:** OpenRouter con sistema de Load Balancing & Fallback automático.

### Frontend (React)
- **Framework:** Vite + React 19.
- **Styling:** TailwindCSS v4 + MagicUI.
- **State:** Zustand.
- **Features:** Streaming de chunks (escritura en tiempo real), Markdown, Glassmorphism.

---

## 💻 Desarrollo Local

Para correr todo el proyecto al mismo tiempo desde la raíz:

### 1. Instalar dependencias
```bash
# Instala dependencias del root y backend
bun install
# Instala dependencias del frontend (si usas pnpm)
cd frontend && pnpm install
```

### 2. Configurar Variables (.env)
Crea un archivo `.env` dentro de la carpeta `backend/` con:
```ini
OPENROUTER_API_KEY="tu_llave_aqui"
DATABASE_URL="postgres://usuario:pass@host:5432/db" # O sqlite://chat.db
```

### 3. Arrancar el proyecto
```bash
# Desde la raíz, arranca backend y frontend en paralelo
bun dev
```

### Otros comandos:
- `bun run dev:back`: Solo el backend.
- `bun run dev:front`: Solo el frontend.
- `bun run build:all`: Compila ambos para producción.

---

## 🌩️ Despliegue

Diseñado para **Dokploy** o cualquier entorno Docker. El backend se autogestiona creando las tablas necesarias al iniciar (`initDB`).

---
Creado por @ZuriHZ
