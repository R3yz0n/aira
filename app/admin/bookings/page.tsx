"use client";

import { useEffect } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import BookingTable from "@/components/admin/bookings/BookingTable";
import { useBooking } from "@/hooks/use-booking";

export default function BookingPage() {
  const { list, isLoading, bookings, pagination } = useBooking();

  // load bookings once on mount
  useEffect(() => {
    // list is memoized in the hook, so safe to place in deps
    list().catch(() => {});
  }, [list]);

  return (
    <div className="space-y-8">
      <div>
        <AdminHeader title="Bookings" subtitle="Manage and track your event bookings"></AdminHeader>
      </div>

      <BookingTable list={list} pagination={pagination} isLoading={isLoading} bookings={bookings} />
    </div>
  );
}
