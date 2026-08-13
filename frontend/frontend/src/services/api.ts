import axios from "axios";

// Centraliza as portas locais e o endereço de produção
const CONFIGS = {
  RIDER: "http://localhost:5055/api",
  VISUAL_STUDIO: "https://localhost:7230/api",
  RENDER: "https://gestortea.onrender.com/api",
};

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? CONFIGS.RENDER : CONFIGS.RIDER);

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
