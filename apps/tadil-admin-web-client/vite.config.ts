import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const VITE_TADIL_API_URL = env.VITE_TADIL_API_URL;

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      allowedHosts: [
        "localhost",
        "tadil-admin.onrender.com",
        "tadil-admin-web-client-production.up.railway.app",
      ],
      host: "0.0.0.0",
      port: 4000,
      proxy: {
        "/api": {
          target: VITE_TADIL_API_URL,
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
