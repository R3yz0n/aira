"use client";

import { Button } from "@/components/ui/button";
import { useAdminLogin } from "@/hooks/use-admin-login";
import { config } from "@/lib/config";
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  Folder,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: ClipboardList,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logout } = useAdminLogin();

  // Listen for global open event (dispatched from header/menu button)
  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openSidebar", handler as EventListener);
    return () => window.removeEventListener("openSidebar", handler as EventListener);
  }, []);

  // Close sidebar when route (pathname) changes (useful for mobile/off-canvas)
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Backdrop when sidebar is open on small screens */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:w-52 xl:w-64 border  transform bg-background text-foreground flex flex-col border-r-2 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-auto`}
      >
        {/* Logo */}
        <div className="px-6 py-11 border-b  h-20  border-aira-blue/20">
          {/* Close button on small screens */}
          <div className="absolute top-6 right-5 flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <div className="flex -mt-4 items-center text-foreground gap-2 text-2xl font-bold">
            <div className="w-10 h-8 hidden  text-aira-blue rounded-lg lg:flex items-center justify-center">
              ⚙️
            </div>
            {config.companyDetails.name}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 relative">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      isActive ? "bg-aira-blue text-white" : "text-foreground hover:bg-black/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-5 h-5" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex absolute rounded bottom-4 w-[95%] -translate-x-1/2 left-1/2 items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-aira-blue/20">
          <p className="text-xs text-foreground">© 2026 AIRA Events</p>
        </div>
      </aside>
    </>
  );
}
