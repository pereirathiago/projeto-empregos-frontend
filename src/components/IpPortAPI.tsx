"use client";

import { getBaseURL, setBaseURL } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/*
 * Esse componente é apenas um requisito para a avaliação, não deve ser usado em outros contextos.
 */
export function IpPortAPI() {
  const [localIpPort, setLocalIpPort] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalIpPort(getBaseURL());
  }, [isOpen]);

  const handleSubmit = () => {
    if (!localIpPort.trim()) {
      toast.error("Por favor, informe um endereço válido");
      return;
    }

    setBaseURL(localIpPort);
    toast.success("Endereço do servidor atualizado com sucesso!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          Servidor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações do Servidor</DialogTitle>
          <DialogDescription>
            Altere as configurações do servidor aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="ipport">IP e Porta</Label>
            <Input
              id="ipport"
              name="ipport"
              value={localIpPort}
              onChange={(e) => setLocalIpPort(e.target.value)}
              placeholder="http://localhost:3000"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            className="cursor-pointer"
          >
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
