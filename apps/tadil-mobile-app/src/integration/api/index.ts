import { Api } from "./api-client";

const apiBaseUrl = (import.meta.env.VITE_TADIL_MOBILE_API_URL as string | undefined)?.replace(
  /\/$/,
  "",
);

const API_TIMEOUT_MS = 20_000;
const UPLOAD_TIMEOUT_MS = 120_000;

if (!apiBaseUrl) {
  console.error(
    "[tadil] VITE_TADIL_MOBILE_API_URL is missing. Rebuild the web assets with this env var before generating the IPA.",
  );
}

const apiInstance = new Api({
  baseURL: apiBaseUrl,
  timeout: API_TIMEOUT_MS,
  securityWorker: (token) => {
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        },
      };
    }
  },
});

apiInstance.instance.interceptors.request.use((config) => {
  if (!apiBaseUrl) {
    return Promise.reject(new Error("API URL is not configured"));
  }
  if (config.data instanceof FormData) {
    config.timeout = UPLOAD_TIMEOUT_MS;
  }
  return config;
});

const apiClient = apiInstance.api;

export { apiClient, apiInstance };
