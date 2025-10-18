"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { House } from "lucide-react";
import Link from "next/link";
import { NavUser } from "./nav-user";

export function Navbar() {
  const { user, isLoading, error } = useUser();

  return (
    <nav className="border-border sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <House className="h-5 w-5" />
            <span className="hidden sm:inline">Vagas</span>
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
              <div className="hidden flex-col gap-1 md:flex">
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-2 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : user ? (
            <NavUser user={user} />
          ) : null}
        </div>
      </div>
    </nav>
  );
}
