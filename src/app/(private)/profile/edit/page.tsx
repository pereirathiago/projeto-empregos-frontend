"use client";

import { getUserRole } from "@/lib/auth";
import { useEffect, useState } from "react";
import { CompanyEditProfile } from "./components/company-edit-profile";
import { UserEditProfile } from "./components/user-edit-profile";

export default function EditProfilePage() {
  const [role, setRole] = useState<"user" | "company" | null>(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  if (!role) {
    return null;
  }

  if (role === "company") {
    return <CompanyEditProfile />;
  }

  return <UserEditProfile />;
}
