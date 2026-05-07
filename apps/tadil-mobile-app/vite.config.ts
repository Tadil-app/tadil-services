/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const VITE_TADIL_MOBILE_API_URL = env.VITE_TADIL_MOBILE_API_URL;

  return {
    plugins: [vue(), legacy(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: VITE_TADIL_MOBILE_API_URL,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
