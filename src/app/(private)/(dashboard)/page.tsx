"use client";

import { getUserRole } from "@/lib/auth";
import { useEffect, useState } from "react";
import { CompanyDashboard } from "./components/company-dashboard";
import { UserDashboard } from "./components/user-dashboard";

export default function DashboardPage() {
  const [role, setRole] = useState<"user" | "company" | null>(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  if (!role) {
    return null;
  }

  if (role === "company") {
    return <CompanyDashboard />;
  }

  return <UserDashboard />;
}
