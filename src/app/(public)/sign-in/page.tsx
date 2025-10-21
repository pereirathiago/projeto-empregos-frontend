import { Briefcase } from "lucide-react";
import { Metadata } from "next";
import { SigninForm } from "./components/signin-form";

export const metadata: Metadata = {
  title: "Entrar - Empregos",
};

export default function SigninPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Briefcase className="size-4" />
          </div>
          <h1>Empregos.</h1>
        </div>
        <SigninForm />
      </div>
    </div>
  );
}
