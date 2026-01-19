"use client";

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { Button } from "@/components/ui/button";
import { useAdminLogin } from "@/hooks/use-admin-login";
import { Sidebar } from "@/components/admin/Sidebar";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminLogin();

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Page Content */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </RequireAdmin>
  );
}
