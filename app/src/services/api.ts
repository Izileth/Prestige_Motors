import axios from "axios";
import { store } from "../store/globalStore";
import { logout } from "../store/user";

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
  isAxiosError: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4242/api",
  timeout: 10000,
  withCredentials: true, // Essencial para cookies HTTP-only
});

// Interceptor de requisição simplificado
api.interceptors.request.use((config) => {
  // Mantenha headers existentes para FormData
  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  // Remove qualquer header de Authorization pré-existente
  delete config.headers["Authorization"];

  return config;
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.message,
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
      isAxiosError: axios.isAxiosError(error),
    };

    // Tratamento específico para erros de autenticação
    if (error.response?.status === 401) {
      handleUnauthorizedError();
      apiError.message = "Sessão expirada - Por favor, faça login novamente";
    }

    return Promise.reject(apiError);
  }
);

// Gerenciamento centralizado de erros 401
function handleUnauthorizedError() {
  // Limpa o estado de autenticação
  store.dispatch(logout());

  // Redireciona para login se não estiver já na página
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = `/login?redirect=${encodeURIComponent(
      window.location.pathname
    )}`;
  }
}

export default api;
