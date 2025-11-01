"use client";

import { getUserRole } from "@/lib/auth";
import { useEffect, useState } from "react";
import { CompanyProfile } from "./components/company-profile";
import { UserProfile } from "./components/user-profile";

export default function ProfilePage() {
  const [role, setRole] = useState<"user" | "company" | null>(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  if (!role) {
    return null;
  }

  if (role === "company") {
    return <CompanyProfile />;
  }

  return <UserProfile />;
}
