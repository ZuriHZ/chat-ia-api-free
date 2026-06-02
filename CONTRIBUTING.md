# 📋 Guía de Commits y Pull Requests / Commit & PR Guidelines

> **Idioma / Language**: Este documento está escrito en ambos idiomas.  
> This document is written in both languages.

---

## 📝 Tabla de Contenidos / Table of Contents

- [🇪🇸 Español](#-español)
  - [Convención de Commits](#convención-de-commits)
  - [Reglas de Pull Requests](#reglas-de-pull-requests)
- [🇺🇸 English](#-english)
  - [Commit Convention](#commit-convention)
  - [Pull Request Rules](#pull-request-rules)

---

# 🇪🇸 Español

## Convención de Commits

Este proyecto sigue la especificación [Conventional Commits](https://www.conventionalcommits.org/es/).

### Formato del Mensaje

```
<tipo>(<alcance>): <descripción corta>

[cuerpo opcional]

[notas de pie opcionales]
```

### Tipos Permitidos

| Tipo       | Descripción                                           | Ejemplo                                                    |
| ---------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `feat`     | Nueva funcionalidad                                   | `feat(chat): agregar soporte para markdown en mensajes`    |
| `fix`      | Corrección de bug                                     | `fix(frontend): corregir ruta del favicon en index.html`   |
| `docs`     | Cambios en documentación                              | `docs: actualizar README con instrucciones de instalación` |
| `style`    | Formato, espacios, puntos y coma (sin cambio lógico)  | `style(chat): aplicar formato consistente en componentes`  |
| `refactor` | Refactorización de código (sin nueva feature ni fix)  | `refactor(store): optimización de estado global en useChat`|
| `perf`     | Mejora de rendimiento                                 | `perf(api): cachear respuestas del modelo`                 |
| `test`     | Agregar o corregir tests                              | `test(chat): agregar tests para el hook useChat`           |
| `build`    | Cambios en sistema de build o dependencias            | `build: actualizar dependencias de Vite a v8`              |
| `ci`       | Cambios en archivos de CI/CD                          | `ci: agregar workflow de deploy a producción`              |
| `chore`    | Tareas de mantenimiento                               | `chore: limpiar archivos temporales`                       |
| `revert`   | Revertir un commit anterior                           | `revert: revertir feat(chat) - soporte markdown`           |

### Alcance (Scope)

El alcance indica **qué parte del proyecto** fue afectada. Usar los siguientes alcances:

| Alcance      | Descripción                    |
| ------------ | ------------------------------ |
| `frontend`   | Código del frontend (Vite/React) |
| `backend`    | Código del backend (API)       |
| `chat`       | Funcionalidad del chat         |
| `ui`         | Componentes de interfaz        |
| `store`      | Estado global (Zustand)        |
| `api`        | Endpoints y servicios          |
| `config`     | Archivos de configuración      |
| `deps`       | Dependencias del proyecto      |

> 💡 Si el cambio afecta todo el proyecto, el alcance puede omitirse: `docs: actualizar CONTRIBUTING`

### Reglas de la Descripción

1. **Usar imperativo en minúsculas**: `agregar`, `corregir`, `eliminar` (no `agregó`, `Corregir`)
2. **No terminar con punto** (.)
3. **Máximo 72 caracteres** en la primera línea
4. **Ser específico**: ❌ `fix: arreglar bug` → ✅ `fix(chat): corregir scroll infinito al recibir mensajes`

### Cuerpo del Commit (Opcional)

Usar para explicar el **qué** y el **por qué** del cambio, no el **cómo**:

```
fix(frontend): corregir ruta del favicon en index.html

Eliminar prefijo '/public' de la ruta del favicon. Los archivos
en el directorio public de Vite se sirven desde la raíz, por lo
que la ruta correcta es '/logo-zuri.webp'.
```

### Breaking Changes

Si el commit introduce un cambio que rompe compatibilidad:

```
feat(api)!: cambiar formato de respuesta del endpoint /chat

BREAKING CHANGE: el campo 'response' ahora es un objeto en lugar de un string.
Los clientes deben actualizar su parsing.
```

---

## Reglas de Pull Requests

### Nomenclatura de Ramas

```
<tipo>/<descripción-corta>
```

**Ejemplos:**
- `feat/markdown-support`
- `fix/favicon-path`
- `refactor/chat-store`
- `docs/contributing-guide`

### Plantilla del PR

Al crear un PR, incluir la siguiente información:

```markdown
## 📋 Descripción
[Describir qué hace este PR y por qué]

## 🔄 Tipo de Cambio
- [ ] ✨ Nueva funcionalidad (feat)
- [ ] 🐛 Corrección de bug (fix)
- [ ] 📝 Documentación (docs)
- [ ] ♻️ Refactorización (refactor)
- [ ] 🎨 Estilo/formato (style)
- [ ] ⚡ Mejora de rendimiento (perf)
- [ ] 🧪 Tests (test)
- [ ] 🔧 Configuración/mantenimiento (chore/build/ci)

## 📸 Capturas (si aplica)
[Screenshots o GIFs del cambio visual]

## ✅ Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo cuando es necesario
- [ ] He actualizado la documentación si aplica
- [ ] Mis cambios no generan warnings nuevos
- [ ] He verificado que funciona localmente
```

### Reglas de los PRs

1. **Un PR = un cambio lógico**. No mezclar features, fixes y refactors en el mismo PR.
2. **Título del PR** sigue el mismo formato que los commits: `tipo(alcance): descripción`.
3. **Descripción obligatoria**. Explicar el contexto y la razón del cambio.
4. **PRs pequeños**. Preferir PRs de < 400 líneas. Si es más grande, dividirlo.
5. **Rama base**: siempre contra `main` salvo que se indique lo contrario.
6. **Squash merge**: usar squash al mergear para mantener el historial limpio.
7. **No force-push** a ramas compartidas.
8. **Resolver conflictos** antes de solicitar review.

---

# 🇺🇸 English

## Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/) specification.

### Message Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type       | Description                                        | Example                                                     |
| ---------- | -------------------------------------------------- | ----------------------------------------------------------- |
| `feat`     | New feature                                        | `feat(chat): add markdown support for messages`             |
| `fix`      | Bug fix                                            | `fix(frontend): fix favicon path in index.html`             |
| `docs`     | Documentation changes                              | `docs: update README with installation instructions`        |
| `style`    | Formatting, whitespace, semicolons (no logic change)| `style(chat): apply consistent formatting to components`   |
| `refactor` | Code refactoring (no new feature or fix)           | `refactor(store): optimize global state in useChat`         |
| `perf`     | Performance improvement                            | `perf(api): cache model responses`                          |
| `test`     | Add or fix tests                                   | `test(chat): add tests for useChat hook`                    |
| `build`    | Build system or dependency changes                 | `build: update Vite dependencies to v8`                     |
| `ci`       | CI/CD configuration changes                        | `ci: add production deploy workflow`                        |
| `chore`    | Maintenance tasks                                  | `chore: clean up temporary files`                           |
| `revert`   | Revert a previous commit                           | `revert: revert feat(chat) - markdown support`              |

### Scope

The scope indicates **which part of the project** was affected. Use these scopes:

| Scope        | Description                       |
| ------------ | --------------------------------- |
| `frontend`   | Frontend code (Vite/React)        |
| `backend`    | Backend code (API)                |
| `chat`       | Chat functionality                |
| `ui`         | UI components                     |
| `store`      | Global state (Zustand)            |
| `api`        | Endpoints and services            |
| `config`     | Configuration files               |
| `deps`       | Project dependencies              |

> 💡 If the change affects the entire project, scope can be omitted: `docs: update CONTRIBUTING`

### Description Rules

1. **Use lowercase imperative mood**: `add`, `fix`, `remove` (not `added`, `Fixes`)
2. **Do not end with a period** (.)
3. **Maximum 72 characters** on the first line
4. **Be specific**: ❌ `fix: fix bug` → ✅ `fix(chat): fix infinite scroll when receiving messages`

### Commit Body (Optional)

Use to explain the **what** and **why** of the change, not the **how**:

```
fix(frontend): fix favicon path in index.html

Remove '/public' prefix from favicon path. Files in Vite's public
directory are served from the root, so the correct path is
'/logo-zuri.webp' instead of '/public/logo-zuri.webp'.
```

### Breaking Changes

If the commit introduces a breaking change:

```
feat(api)!: change response format for /chat endpoint

BREAKING CHANGE: the 'response' field is now an object instead of a string.
Clients must update their parsing logic.
```

---

## Pull Request Rules

### Branch Naming

```
<type>/<short-description>
```

**Examples:**
- `feat/markdown-support`
- `fix/favicon-path`
- `refactor/chat-store`
- `docs/contributing-guide`

### PR Template

When creating a PR, include the following information:

```markdown
## 📋 Description
[Describe what this PR does and why]

## 🔄 Type of Change
- [ ] ✨ New feature (feat)
- [ ] 🐛 Bug fix (fix)
- [ ] 📝 Documentation (docs)
- [ ] ♻️ Refactoring (refactor)
- [ ] 🎨 Style/formatting (style)
- [ ] ⚡ Performance improvement (perf)
- [ ] 🧪 Tests (test)
- [ ] 🔧 Config/maintenance (chore/build/ci)

## 📸 Screenshots (if applicable)
[Screenshots or GIFs of visual changes]

## ✅ Checklist
- [ ] My code follows the project's conventions
- [ ] I have performed a self-review of my code
- [ ] I have commented complex code when necessary
- [ ] I have updated documentation if applicable
- [ ] My changes do not generate new warnings
- [ ] I have verified it works locally
```

### PR Rules

1. **One PR = one logical change**. Don't mix features, fixes, and refactors in the same PR.
2. **PR title** follows the same format as commits: `type(scope): description`.
3. **Description is mandatory**. Explain the context and reason for the change.
4. **Keep PRs small**. Prefer PRs with < 400 lines. If larger, split it up.
5. **Base branch**: always against `main` unless stated otherwise.
6. **Squash merge**: use squash when merging to keep history clean.
7. **No force-push** to shared branches.
8. **Resolve conflicts** before requesting review.

---

## 📚 Recursos / Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://cbea.ms/git-commit/)
- [GitHub Flow](https://docs.github.com/en/get-started/using-git/github-flow)
