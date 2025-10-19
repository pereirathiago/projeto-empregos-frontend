"use client";

import { useApiStore } from "@/store/api-store";
import { useEffect, useState } from "react";
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
  const { ip_port, setIpPort } = useApiStore();
  const [localIpPort, setLocalIpPort] = useState(ip_port);

  useEffect(() => {
    setLocalIpPort(ip_port);
  }, [ip_port]);

  const handleSubmit = () => {
    setIpPort(localIpPort);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Servidor</Button>
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
                defaultValue={localIpPort}
                onChange={(e) => setLocalIpPort(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleSubmit}>
                Salvar alterações
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
