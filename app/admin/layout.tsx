"use client";

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { Button } from "@/components/ui/button";
import { useAdminLogin } from "@/hooks/use-admin-login";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminLogin();
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-aira-blue to-aira-gold p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/80">Welcome to the admin panel</p>
            </div>
            <Button variant="elegant" onClick={logout}>
              Logout
            </Button>
          </div>
          {children}
        </div>
      </div>
    </RequireAdmin>
  );
}
