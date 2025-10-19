import { useApiStore } from "@/store/api-store";
import axios from "axios";

const api = axios.create({
  //baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const currentBaseURL =
      useApiStore.getState().ip_port || process.env.NEXT_PUBLIC_API_URL;
    config.baseURL = currentBaseURL;

    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
