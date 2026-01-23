"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // actions on the right
}

export function AdminHeader({ title, subtitle, children }: AdminHeaderProps) {
  return (
    <div className="flex items-start justify-between ">
      <div className="flex items-center gap-3 -ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden p-2 w-10 h-10 [&_svg]:w-6 [&_svg]:h-6 flex items-center justify-center"
          onClick={() => window.dispatchEvent(new CustomEvent("openSidebar"))}
        >
          <Menu />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
