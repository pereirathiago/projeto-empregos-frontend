import { Company } from "@/lib/auth";
import { create } from "zustand";

interface CompanyStore {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  setCompany: (company: Company | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearCompany: () => void;
  updateCompanyData: (companyData: Partial<Company>) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  company: null,
  isLoading: false,
  error: null,
  setCompany: (company) => set({ company, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearCompany: () => set({ company: null, error: null, isLoading: false }),
  updateCompanyData: (companyData) =>
    set((state) => ({
      company: state.company ? { ...state.company, ...companyData } : null,
    })),
}));
