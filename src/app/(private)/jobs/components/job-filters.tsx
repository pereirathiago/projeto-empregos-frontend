"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BRAZILIAN_STATES,
  JOB_AREAS,
  JobSearchFilters,
} from "@/lib/validations/jobs";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface JobFiltersProps {
  onFilter: (filters: JobSearchFilters) => void;
  showCompanyFilter?: boolean;
  isLoading?: boolean;
}

export function JobFilters({
  onFilter,
  showCompanyFilter = true,
  isLoading,
}: JobFiltersProps) {
  const [filters, setFilters] = useState<JobSearchFilters>({
    title: "",
    area: "",
    company: "",
    state: "",
    city: "",
    salary_range: {
      min: null,
      max: null,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseFloat(value) : null;
    setFilters((prev) => ({
      ...prev,
      salary_range: {
        ...prev.salary_range,
        [name]: numValue,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const clearedFilters: JobSearchFilters = {
      title: "",
      area: "",
      company: "",
      state: "",
      city: "",
      salary_range: {
        min: null,
        max: null,
      },
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título da vaga</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: Desenvolvedor, Auxiliar..."
            value={filters.title}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Área</Label>
          <select
            id="area"
            name="area"
            value={filters.area}
            onChange={handleChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todas as áreas</option>
            {JOB_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {showCompanyFilter && (
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              name="company"
              placeholder="Nome da empresa"
              value={filters.company}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <select
            id="state"
            name="state"
            value={filters.state}
            onChange={handleChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todos os estados</option>
            {BRAZILIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            placeholder="Ex: Ponta Grossa"
            value={filters.city}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Faixa salarial</Label>
          <div className="flex gap-2">
            <Input
              name="min"
              type="number"
              placeholder="Mín"
              value={filters.salary_range?.min ?? ""}
              onChange={handleSalaryChange}
              min={0}
            />
            <Input
              name="max"
              type="number"
              placeholder="Máx"
              value={filters.salary_range?.max ?? ""}
              onChange={handleSalaryChange}
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          <Search className="size-4" />
          Buscar
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          <X className="size-4" />
          Limpar
        </Button>
      </div>
    </form>
  );
}
