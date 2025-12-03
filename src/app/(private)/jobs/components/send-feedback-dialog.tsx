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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  JobCandidate,
  SendFeedbackFormData,
  sendFeedbackSchema,
} from "@/lib/validations/jobs";
import { Send } from "lucide-react";
import { useState } from "react";

interface SendFeedbackDialogProps {
  candidate: JobCandidate | null;
  jobId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (jobId: number, data: SendFeedbackFormData) => Promise<boolean>;
  isLoading?: boolean;
  formErrors?: Record<string, string>;
}

export function SendFeedbackDialog({
  candidate,
  jobId,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  formErrors: externalErrors,
}: SendFeedbackDialogProps) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!candidate || !jobId) return;

    const data: SendFeedbackFormData = {
      user_id: candidate.user_id,
      message,
    };

    const validation = sendFeedbackSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await onSubmit(jobId, validation.data);
    if (success) {
      setMessage("");
      onOpenChange(false);
    }
  };

  const allErrors = { ...errors, ...externalErrors };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar Feedback</DialogTitle>
          <DialogDescription>
            Enviar feedback para {candidate?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">
              Mensagem{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Digite sua mensagem de feedback para o candidato..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
            {allErrors.message && (
              <p className="text-sm text-red-600">{allErrors.message}</p>
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
                  Enviar Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
