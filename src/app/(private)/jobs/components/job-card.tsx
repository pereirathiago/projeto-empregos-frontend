"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Job } from "@/lib/validations/jobs";
import { Briefcase, Building2, Mail, MapPin, Send } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  showApplyButton?: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onViewDetails?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export function JobCard({
  job,
  showActions,
  showApplyButton,
  onEdit,
  onDelete,
  onViewDetails,
  onApply,
}: JobCardProps) {
  const formatSalary = (salary: number | null) => {
    if (!salary) return "A combinar";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(salary);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Building2 className="size-4" />
              {job.company}
            </CardDescription>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {job.area}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span>
              {job.city}, {job.state}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="size-4" />
            <span>{formatSalary(job.salary)}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4" />
            <span className="truncate">{job.contact}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {showActions && onEdit && onDelete ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(job)}
            >
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onDelete(job)}
            >
              Excluir
            </Button>
          </>
        ) : showApplyButton && onApply ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails?.(job)}
            >
              Ver detalhes
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onApply(job)}>
              <Send className="size-4" />
              Candidatar
            </Button>
          </>
        ) : (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/jobs/${job.job_id}`}>Ver detalhes</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
