"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { useAdminLogin } from "@/hooks/use-admin-login";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminLogin();

  return (
    <RequireAdmin>
      <div className="h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Page Content */}
          <div className="py-4 w-full max-w-[700px] md:max-w-full  lg:w-auto px-2 lg:p-4 h-full overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
