import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const VITE_TADIL_API_URL = env.VITE_TADIL_API_URL;
  const DEEPL_URL = env.DEEPL_URL;
  const DEEPL_API_KEY = env.DEEPL_API_KEY;

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [vue(), tailwindcss() as any],
    server: {
      allowedHosts: [
        "localhost",
        "tadil-admin-web-client-production.up.railway.app",
      ],
      host: "0.0.0.0",
      port: 4000,
      proxy: {
        "/api": {
          target: VITE_TADIL_API_URL,
          changeOrigin: true,
        },
        // Proxy DeepL so the API key stays server-side and CORS is avoided.
        // DEEPL_URL already ends in /v2/translate, so strip the local prefix.
        "/deepl": {
          target: DEEPL_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/deepl/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (DEEPL_API_KEY) {
                proxyReq.setHeader(
                  "Authorization",
                  `DeepL-Auth-Key ${DEEPL_API_KEY}`
                );
              }
            });
          },
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
