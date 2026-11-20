import axios from "axios";

const api = axios.create({
  baseURL: "/",
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("cv-access-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
