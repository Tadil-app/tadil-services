# Tadil-تعديل Mobile App

A modern mobile application for tailoring services, built with **Vue 3**, **Ionic Framework**, and **Capacitor**. The app provides a seamless interface for both customers (to order tailoring services) and tailors (to manage orders and payments).

## 🚀 Project Overview

- **Purpose**: A platform connecting customers with tailors, allowing for custom tailoring orders and management.
- **Main Technologies**:
  - **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
  - **Mobile Framework**: [Ionic Framework](https://ionicframework.com/) (v8)
  - **Native Bridge**: [Capacitor](https://capacitorjs.com/) (v8)
  - **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
  - **State Management**: [Pinia](https://pinia.vuejs.org/)
  - **Routing**: [Ionic Vue Router](https://ionicframework.com/docs/vue/navigation)
  - **Internationalization**: [Vue I18n](https://vue-i18n.intlify.dev/) (Supports Arabic, English, Bengali, Urdu, and Hindi)
  - **API Client**: Axios (client generated from Swagger)

## 📂 Architecture & Directory Structure

- `src/views`: Contains the main page components.
    - `customer/`: Main area for customer-facing features (Dashboard, Cart, New Order flow).
    - `tailor/`: Main area for tailor-facing features (Dashboard, Orders, Wallet).
    - `auth/`: Authentication views (Login).
- `src/components`: Reusable UI and business components.
- `src/stores`: Pinia stores for application state (`useAuthStore`, `useCartStore`, `useLanguageStore`, `useThemeStore`).
- `src/composables`: Reusable Composition API logic.
- `src/integration`: API client and DTOs.
- `src/i18n`: Internationalization setup and locale files.
- `src/theme`: Styling configuration (Tailwind, Ionic variables).

## 🛠️ Building and Running

### Development
- **Browser**: `npm run dev`
- **Android**: `npm run android-device` (Builds and runs on a connected device/emulator)
- **iOS**: `npm run ios-device` (Builds and runs on a connected device/simulator)

### Build
- **Web Build**: `npm run build`
- **Mobile Build**: `npm run build-mobile` (Builds Vue app and syncs with Capacitor)

### Other Commands
- **Linting**: `npm run lint`
- **Testing**: `npm run test:unit` (Vitest)
- **Generate API Client**: `npm run generate-client` (Requires `VITE_TADIL_MOBILE_API_URL` to be set)

## 📐 Development Conventions

- **Component Pattern**: Use Vue 3 `<script setup>` with TypeScript.
- **Styling**: Prefer Tailwind CSS utility classes over custom CSS where possible.
- **Theming**: App supports Light/Dark modes (managed via `useThemeStore`).
- **Internationalization**: Use `$t()` for all user-facing text.
- **State Management**: Persist critical state (auth, language, cart) using `useStorage` or similar patterns in stores.
- **API Interaction**: Use the generated `api-client.ts` in `src/integration/api` for all backend requests.
