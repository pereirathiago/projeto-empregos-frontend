"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Entrar</CardTitle>
          <CardDescription>Faça login na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup className="gap-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="username">
                  Nome de Usuário
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="username"
                  type="username"
                  placeholder="username"
                  required
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="password">
                  Senha
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="input-secure-19"
                    required
                    placeholder="••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="icon-xs"
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field className="gap-2">
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <Link href="/register">Cadastrar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
