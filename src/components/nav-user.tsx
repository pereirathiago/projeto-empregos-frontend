"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";
import { useUserStore } from "@/store/user-store";
import { CircleUser, EllipsisVertical, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    username: string;
  };
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { clearUser } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();

      toast.success("Logout realizado com sucesso!");
      clearUser();

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Erro ao fazer logout");
      clearUser();

      router.push("/sign-in");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 gap-2 px-2 cursor-pointer">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start text-left text-sm md:flex">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">
              @{user.username}
            </span>
          </div>
          <EllipsisVertical className="ml-auto h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              @{user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex cursor-pointer items-center">
            <CircleUser className="mr-2 h-4 w-4" />
            <span>Ver Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? <Spinner /> : <LogOut className="mr-2 h-4 w-4" />}
          <span>{isLoggingOut ? "Saindo..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
