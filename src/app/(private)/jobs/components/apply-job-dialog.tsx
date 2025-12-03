"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { ApplyJobFormData, applyJobSchema, Job } from "@/lib/validations/jobs";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

interface ApplyJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApplyJobFormData) => Promise<boolean>;
  isLoading?: boolean;
  formErrors?: Record<string, string>;
}

export function ApplyJobDialog({
  job,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  formErrors: externalErrors,
}: ApplyJobDialogProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<ApplyJobFormData>({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplyJobFormData, string>>
  >({});

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        education: user.education || "",
        experience: user.experience || "",
      });
    }
  }, [user, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ApplyJobFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validation = applyJobSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ApplyJobFormData, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ApplyJobFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await onSubmit(validation.data);
    if (success) {
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        education: "",
        experience: "",
      });
    }
  };

  const allErrors = { ...errors, ...externalErrors };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Candidatar-se à Vaga</DialogTitle>
          <DialogDescription>
            {job?.title} - {job?.company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {allErrors.name && (
              <p className="text-sm text-red-600">{allErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
            {allErrors.email && (
              <p className="text-sm text-red-600">{allErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(99) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
            />
            {allErrors.phone && (
              <p className="text-sm text-red-600">{allErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">
              Formação{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="education"
              name="education"
              placeholder="Descreva sua formação acadêmica..."
              value={formData.education}
              onChange={handleChange}
              rows={3}
              required
            />
            {allErrors.education && (
              <p className="text-sm text-red-600">{allErrors.education}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Experiência{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="Descreva sua experiência profissional..."
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              required
            />
            {allErrors.experience && (
              <p className="text-sm text-red-600">{allErrors.experience}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Enviar Candidatura
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
