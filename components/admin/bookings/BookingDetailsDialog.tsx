"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IBookingEntity } from "@/domain/booking";
import { format } from "date-fns";

interface BookingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  booking: IBookingEntity | null;
}

export function BookingDetailsDialog({ open, onClose, booking }: BookingDetailsDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Booker Name</h3>
            <p>{booking.fullName}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Email</h3>
            <p>{booking.email}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Phone Number</h3>
            <p>{booking.phone}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Booking Date</h3>
            <p>{format(new Date(booking.eventDate), "PPP")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Event Type</h3>
            <Badge>{booking.eventType || "N/A"}</Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Message </h3>
            <p>{booking.message || "No message provided."}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BookingDetailsDialog;
