import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

});

// 🔥 interceptor de request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 interceptor de response (manejo global de errores)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      
    }

    return Promise.reject(error);
  }
);

export default api;