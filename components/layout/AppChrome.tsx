"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Props {
  children: React.ReactNode;
}

export function AppChrome({ children }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "flex-1" : "flex-1 pt-20"}>{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
}
