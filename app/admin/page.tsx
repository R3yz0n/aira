"use client";

import { Card } from "@/components/ui/card";
import { ShoppingCart, Calendar, Clock, BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminPage() {
  const stats = [
    {
      title: "Total Items in Cart",
      value: "12",
      description: "Items pending review",
      icon: ShoppingCart,
      bgColor: "bg-aira-cream",
      iconColor: "text-aira-blue",
    },
    {
      title: "Events Linked",
      value: "5",
      description: "Upcoming events with cart items",
      icon: Calendar,
      bgColor: "bg-aira-ivory",
      iconColor: "text-aira-pink",
    },
    {
      title: "Pending Actions",
      value: "5",
      description: "Actions awaiting approval",
      icon: Clock,
      bgColor: "bg-aira-cream",
      iconColor: "text-aira-gold",
    },
    {
      title: "Total Revenue",
      value: "$24,580",
      description: "This month",
      icon: BarChart3,
      bgColor: "bg-aira-ivory",
      iconColor: "text-aira-blue",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminHeader title="Admin Panel" subtitle="Manage your events and categories" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-aira-ivory border  shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
