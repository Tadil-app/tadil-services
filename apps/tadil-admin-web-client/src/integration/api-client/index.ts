import { Api } from "./tadil-api-client";
import keycloak from "../keycloak";

const apiInstance = new Api({
  baseURL: import.meta.env.VITE_TADIL_API_URL || "",
});

apiInstance.instance.interceptors.request.use(async (config) => {
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export const apiClient = apiInstance.api;
