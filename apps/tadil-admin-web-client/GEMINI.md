# GEMINI.md - Tadil Admin Web Client

This document provides a technical overview and development guidelines for the Tadil Admin Web Client.

## Project Overview

Tadil Admin Web Client is a Vue 3-based administrative dashboard for the "Tadil" platform. It allows administrators to manage users, models, alterations, extras, and required information.

### Core Tech Stack
- **Framework:** [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Navigation:** [Vue Router 4](https://router.vuejs.org/)
- **Internationalization:** [Vue I18n](https://vue-i18n.intlify.dev/) (supports Arabic and English)
- **API Client:** [Axios](https://axios-http.com/) (using `swagger-typescript-api` generated client)
- **Icons:** [Lucide Vue Next](https://lucide.dev/)

## Project Structure

- `src/assets/`: Static assets (SVG, images).
- `src/components/`:
    - `ui/`: Fundamental, reusable UI components (Button, Modal, inputs, etc.).
    - Other shared components (LocalesToggle, DestructiveActionAlert).
- `src/composables/`: Shared reactive logic (e.g., `useTranslatedNames`).
- `src/i18n/`: Translation setup and locale files (AR, EN, BN, HI, UR).
- `src/integration/`: API integration layer.
    - `api-client/`: Generated Axios client from Swagger.
    - `DTOs/`: Data Transfer Objects for API requests and responses.
- `src/layout/`: Main application layout (Header, Sidebar, Shell).
- `src/router/`: Application routing configuration.
- `src/utils/`: General utility functions.
- `src/views/`: Page-level components organized by domain (alterations, extras, models, users, etc.).

## Building and Running

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
*Note: This runs `vue-tsc` for type checking before the Vite build.*

### API Client Generation
If the backend API changes, regenerate the TypeScript client:
```bash
npm run generate-client
```
*Note: This expects the backend to be running at `http://localhost:4444/api-json`.*

## Development Conventions

- **Component Style:** Always use `<script setup lang="ts">` for Vue Single File Components (SFCs).
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS in `<style>` blocks unless necessary.
- **I18n:** Never hardcode user-facing strings. Always use `t('key')` from `vue-i18n`. Arabic is often the default locale.
- **API Interaction:** Use the centralized `apiClient` exported from `src/integration`. It is also available globally as `this.$api` in component templates.
- **UI Components:** Before building a new UI element, check `src/components/ui/` to see if a reusable component already exists.
- **Type Safety:** Maintain strict TypeScript typing for props, emits, and API interactions. Use the DTOs defined in `src/integration/DTOs`.
- **Layouts:** Use the `Layout.vue` component for all authenticated/main views.
