import { Api } from "./tadil-api-client";

export const apiClient = new Api({
  baseURL: import.meta.env.VITE_TADIL_API_URL || "",
}).api;
