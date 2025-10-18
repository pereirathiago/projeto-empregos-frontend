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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RegisterForm() {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>Busque vagas de emprego</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup className="gap-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="name">
                  Nome Completo{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Thiago Pereira"
                  required
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="username">
                  Nome de Usuário{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="thiagopereira"
                  required
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="thiago.pereira@teste.com"
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="password">
                  Senha{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input id="password" type="password" required />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                <Input id="phone" type="tel" placeholder="(42) 91234-5678" />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="experience">Experiência</FieldLabel>
                <Textarea
                  id="experience"
                  placeholder="Descreva sua experiência"
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="education">Educação</FieldLabel>
                <Textarea id="education" placeholder="Descreva sua educação" />
              </Field>
              <Field>
                <Button type="submit">Cadastrar</Button>
                <FieldDescription className="text-center">
                  Já tem uma conta? <Link href="/sign-in">Entrar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
