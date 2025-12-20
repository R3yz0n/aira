"use client";
import React from "react";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { useAdminAuthRedirect } from "@/hooks/use-admin-auth-redirect";

export default function Page() {
  const { checking } = useAdminAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: "/admin",
    useWindowReplace: true, // Use hard redirect to clear history
  });

  if (checking) {
    return (
      <div className="h-screen w-screen fixed top-0 left-0 z-50 flex items-center justify-center bg-muted">
        <div className="animate-pulse text-lg text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen fixed top-0 left-0 z-50 flex items-center bg-gray-100 justify-center px-4 py-12">
      <div className="w-full border border-gray-200 shadow-xl py-12 px-2 rounded-2xl bg-white/90 backdrop-blur max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue.</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
