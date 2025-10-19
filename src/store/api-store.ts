import { create } from "zustand";

// Esse store é apenas requisito para a avaliação, não deve ser usado em outros contextos.

interface ApiStore {
  ip_port: string;
  setIpPort: (ip_port: string) => void;
}

export const useApiStore = create<ApiStore>((set) => ({
  ip_port: process.env.NEXT_PUBLIC_API_URL || "",
  setIpPort: (ip_port) => set({ ip_port }),
}));
