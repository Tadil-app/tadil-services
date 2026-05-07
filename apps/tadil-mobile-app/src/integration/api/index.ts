import { Api } from "./api-client";

const apiClient = new Api({
  baseURL: import.meta.env.VITE_TADIL_MOBILE_API_URL,
}).api;

export { apiClient };
