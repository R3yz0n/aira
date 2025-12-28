"use client";

import { ReactNode } from "react";
import { useAdminAuthRedirect } from "@/hooks/use-admin-auth-redirect";

interface RequireAdminProps {
  children: ReactNode;
  redirectTo?: string;
}

export function RequireAdmin({ children, redirectTo = "/login" }: RequireAdminProps) {
  const { checking } = useAdminAuthRedirect({
    redirectIfUnauthenticated: true,
    redirectTo,
  });

  if (checking) {
    return (
      <div className="min-h-screen bg flex items-center justify-center bg-muted">
        <div className="animate-pulse text-lg text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  return <>{children}</>;
}
