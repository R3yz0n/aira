"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Folder, ChevronRight } from "lucide-react";
import { config } from "@/lib/config";

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
    label: "Services",
    href: "/admin/categories",
    icon: Folder,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64  border-r-2 bg-black/5  text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-11 border-b  h-20  border-aira-blue/20">
        <div className="flex -mt-4 items-center text-foreground gap-2 text-2xl font-bold">
          <div className="w-10 h-8  text-aira-blue rounded-lg flex items-center justify-center">
            ⚙️
          </div>
          {config.companyDetails.name}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

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
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-aira-blue/20">
        <p className="text-xs text-foreground">© 2026 AIRA Events</p>
      </div>
    </aside>
  );
}
