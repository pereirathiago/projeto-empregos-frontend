import axios from "axios";

const STORAGE_KEY = "api_base_url";

export function getBaseURL(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "";
  }

  const storedURL = localStorage.getItem(STORAGE_KEY);
  if (storedURL) {
    return storedURL;
  }

  const envURL = process.env.NEXT_PUBLIC_API_URL || "";
  if (envURL) {
    localStorage.setItem(STORAGE_KEY, envURL);
  }
  return envURL;
}

export function setBaseURL(url: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, url);
  }
}

const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseURL();

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
