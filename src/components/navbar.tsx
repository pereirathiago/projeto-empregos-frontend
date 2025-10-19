"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { House } from "lucide-react";
import Link from "next/link";
import { NavUser } from "./nav-user";

export function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="border-border flex justify-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 ">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
            <House className="h-5 w-5" />
            <span className="hidden sm:inline">Vagas</span>
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="hidden flex-col gap-1 md:flex">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ) : user ? (
            <NavUser user={user} />
          ) : null}
        </div>
      </div>
    </nav>
  );
}
