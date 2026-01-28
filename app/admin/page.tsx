"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { motion } from "framer-motion";
import { Calendar, ClipboardList, Folder } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function AdminPage() {
  const { stats, getSummary } = useDashboard();
  useEffect(() => {
    getSummary();
  }, []);
  return (
    <div className="space-y-8 px-2  xl:px-3">
      <AdminHeader title="Admin Panel" subtitle="Manage your events and categories" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Events"
          value={stats?.totalEvents ?? 0}
          description="Total events in the system"
          icon={Calendar}
          bgColor="bg-aira-cream"
          iconColor="text-aira-blue"
        />
        <StatsCard
          title="Categories"
          value={stats?.totalCategories ?? 0}
          description="Total categories in the system"
          icon={Folder}
          bgColor="bg-aira-ivory"
          iconColor="text-aira-pink"
        />
        <StatsCard
          title="Bookings"
          value={stats?.totalBookings ?? 0}
          description="Total bookings made"
          icon={ClipboardList}
          bgColor="bg-aira-cream"
          iconColor="text-aira-gold"
        />
      </div>

      {/* Recent Events Section */}
      <section className="flex flex-col-reverse lg:flex-row w-full gap-5 ">
        {/* Recent Bookings Section */}
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold text-primary mb-5">Recent Bookings</h2>
          <ul className="space-y-1 grid sm:grid-cols-2 gap-3 ">
            {stats?.latestBookings?.length > 0 &&
              stats?.latestBookings?.map((booking) => (
                <li key={booking.id}>
                  <Card className="p-5  bg-aira-ivory border flex gap-3 items-center  shadow-md transition-shadow">
                    <div className="flex gap-3 ">
                      <span className="w-12 h-12 bg-aira-gold text-foreground shadow flex items-center justify-center rounded-full">
                        {booking.fullName.split("")[0]}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium line-clamp-1">{booking.fullName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{booking.phone}</p>
                    </div>
                  </Card>
                </li>
              ))}
          </ul>
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold text-primary mb-5">Newly Added Images</h2>
          <ul className="columns-2 md:columns-2 relative lg:columns-2 xl:columns-3 gap-1.5 space-y-1.5">
            {stats?.latestEvents?.length > 0 &&
              stats?.latestEvents?.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-card cursor-pointer overflow-hidden shadow-md hover-lift"
                  role="button"
                  tabIndex={0}
                >
                  <div className="w-full relative hover-lift shadow-md overflow-hidden">
                    <Image
                      src={event?.imageUrl || "/placeholder.svg"}
                      alt={event?.title || "Event image"}
                      placeholder="blur"
                      blurDataURL="/placeholder.svg"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

const StatsCard = ({
  title,
  value,
  description,
  bgColor,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: number;
  description: string;
  bgColor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
}) => {
  return (
    <Card className="p-6 bg-aira-ivory border  shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-base text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold mb-1">{value ?? 0}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
};
