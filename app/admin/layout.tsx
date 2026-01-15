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
          {/* Header */}
          <div className="bg-card border-b border-border sticky top-0 z-40">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your events and services</p>
              </div>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-8">{children}</div>
        </div>
      </div>
    </RequireAdmin>
  );
}
