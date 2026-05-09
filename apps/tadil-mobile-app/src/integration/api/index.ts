import { Api } from "./api-client";

const apiInstance = new Api({
  baseURL: import.meta.env.VITE_TADIL_MOBILE_API_URL,
  securityWorker: (token) => {
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  },
});

const apiClient = apiInstance.api;

export { apiClient, apiInstance };
