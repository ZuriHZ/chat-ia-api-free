# 🚀 Dialogue - API Bun Chat & PostgreSQL

Link de Produccion : <https://api-con-bun-backend-2wjt1i-155179-157-254-174-103.traefik.me/>

Este proyecto es una API y aplicación web minimalista de chat impulsada por IA, construida desde cero utilizando **Bun**. Está diseñada para ser extremadamente rápida, ligera y altamente resiliente en producción.

## 🛠️ Tecnologías y Arquitectura

- **Runtime & Backend:** [Bun](https://bun.sh/). Proyecto creado 100% nativo utilizando `Bun.serve` para manejar peticiones HTTP y streaming. Cero dependencias pesadas como Express o NestJS.
- **Base de Datos:** **PostgreSQL**. Conectado de la forma más rápida posible usando el nuevo wrapper nativo interconstruido de Bun (`bun:sql`), deshaciéndonos de compiladores ORM masivos (como Prisma o TypeORM).
- **Modelos de Inteligencia Artificial:** [OpenRouter](https://openrouter.ai/) (SDK oficial). El proyecto posee un sistema robusto de **Load Balancing & Fallback** que rota inteligentemente entre los mejores modelos gratuitos del mercado (DeepSeek, Llama, Gemma, Phi, Qwen, etc.). Si un modelo está saturado (Status 429), el sistema salta automáticamente al siguiente en la lista sin que el usuario lo note. Si caen todos, responde con humor nativo.
- **Frontend UI:** Vanilla HTML/CSS/JS con un concepto visual de diseño "Editorial Minimalista" enfocado a lectura fina (basado en fuentes _Instrument Serif_ y paleta OKLCH en rojo y papel). Soporte nativo para lectura asíncrona por **Chunks (Streaming)** para simular la escritura humana en tiempo real.
- **REST Architecture:** Además del chat, incorpora un portal de debug y administración en `/rest` permitiendo hacer test rápidos directamente a las tablas SQL de `users`, `conversations` y `messages`.

---

## 🌩️ Despliegue en Producción (Dokploy & Cubepath)

Toda la arquitectura del proyecto fue planificada para vivir dentro de administradores de Docker en la nube, específicamente **Dokploy** (hospedado en este caso en VPS como **Cubepath**).

### 1. Preparar la Base de Datos

Dentro de tu panel de Dokploy, crea un servicio individual de **PostgreSQL**. Toma nota de sus variables autogeneradas de red (Contraseña, Usuario, etc).

### 2. Variables de Entorno en el Proyecto (.env)

Una vez que subas tu código al módulo de Aplicaciones en Dokploy, inyecta las siguientes variables en la pestaña de `Environment`:

```ini
OPENROUTER_API_KEY="sk-or-v1-tu-llave-secreta..."
# ¡Importante! En producción, como PostgreSQL está en el MISMO Dokploy,
# usa la "Internal Connection URL" para evitar latencia de la red abierta.
DATABASE_URL="postgres://tu_usuario:tu_contraseña@nombre_del_db_container_interno:5432/tu_db"
```

### 3. Migraciones "Invisibles"

La filosofía de este backend es ser "Plug & Play". No hay scripts secundarios que ejecutar durante el build (`npm run build` o `migrate`).
Al encenderse la aplicación, `config/db.ts` interceptará la conexión de Postgre y, en un microsegundo, inyectará y creará todas las relaciones SQL (Tablas) de forma silenciosa si el servidor Dokploy es nuevo.

---

## 💻 Desarrollo Local (Sin Docker)

Si quieres agregar features nuevas mientras estás en tu ordenador personal (Windows/Mac) y no quieres complicarte apuntando a tu servidor Dokploy remoto ni instalando Postgre, usa este simple truco gracias a la versatilidad natural de Bun SQL:

En tu `.env` de VS Code local reemplaza la URL de base de datos a un archivo de SQLite plano:

```ini
DATABASE_URL="sqlite://chat_desarrollo.sqlite"
```

Bun detectará el prefijo `sqlite://`, cambiará su motor interno, e inicializará el archivo local automáticamente para que sigas codeando y jugando con la Base de datos sin dependencias.

### Comandos Locales:

```bash
# Instalar dependencias
bun install

# Arrancar el servidor en modo hot-reload
bun --watch ./index.ts
```

## 📂 Mapa del Proyecto

- `/index.ts` — Router HTTP y motor principal.
- `/config/db.ts` — Inicializador C de PostgreSQL/SQLite nativo y creación de esquemas SQL.
- `/config/models.ts` — Menú de configuraciones de Array para Modelos IA OpenRouter. Centralizando aquí podemos agregar nuevos modelos que asomen en el mercado sin tocar el código duro.
- `/controllers/chatController.ts` — Cerebro del Chatbot. Generador de promesas asíncronas de Stream y Balanceador de carga. Integra guardado de historiales interceptando la escritura a la base de datos de manera limpia y veloz.
- `/controllers/restController.ts` — Interfaz REST pura controlando `users`, `conversations` y `messages`.
- `/public/` — Estáticos, diseño web y tester API integrado minimalista.
