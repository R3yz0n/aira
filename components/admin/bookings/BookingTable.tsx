"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IBookingEntity } from "@/domain/booking";
import { IPaginationParams } from "@/domain/common";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { Eye, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import BookingDetailsDialog from "./BookingDetailsDialog";

interface BookingTableProps {
  bookings: IBookingEntity[];
  pagination: IPaginationParams;
  list: (
    page: number,
    limit: number,
    search?: string,
    startDate?: string,
    endDate?: string,
  ) => void;

  isLoading: boolean;
}

const BookingTable = ({ bookings = [], pagination, list, isLoading }: BookingTableProps) => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBookingEntity | null>(null);
  const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { toast } = useToast();
  useEffect(() => {
    const fn = debounce((value: string) => {
      list(1, pagination?.limit, value, startDate, endDate);
    }, 300);

    debouncedRef.current = fn;

    return () => {
      fn.cancel();
      debouncedRef.current = null;
    };
  }, [pagination?.limit, list, startDate, endDate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedRef.current?.(value);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "startDate") {
      if (endDate && new Date(value) > new Date(endDate)) {
        toast({
          title: "Load failed",
          description: "Start date cannot be later than end date",
          variant: "destructive",
        });
        return;
      }
      setStartDate(value);
    } else if (id === "endDate") {
      if (startDate && new Date(value) < new Date(startDate)) {
        toast({
          title: "Load failed",
          description: "End date cannot be earlier than start date",
          variant: "destructive",
        });
        return;
      }
      setEndDate(value);
    }

    if (startDate && id === "endDate") {
      list(1, pagination?.limit, search, startDate, id === "endDate" ? value : endDate);
    }
    if (endDate && id === "startDate") {
      list(1, pagination?.limit, search, id === "startDate" ? value : startDate, endDate);
    }
  };

  const handlePageChange = (newPage: number) => {
    list(newPage, pagination?.limit, search, startDate, endDate);
  };
  return (
    <Card className="p-3 lg:p-6 bg-card shadow-md">
      <div className="flex items-center justify-between mb-4 ">
        <div className="relative w-96  ">
          <Input
            placeholder="Search bookings by name email..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 w-full  text-sm md:text-base"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>
        <div className="w-auto flex h-10 px-2">
          <div className="flex   items-center space-x-2">
            <Label htmlFor="startDate">Start:</Label>
            <Input
              id="startDate"
              type="date"
              placeholder="Start Date"
              onChange={handleDateChange}
              className="w-auto cursor-pointer  px-1"
            />
            <Label htmlFor="endDate">End:</Label>
            <Input
              id="endDate"
              type="date"
              placeholder="End Date"
              onChange={handleDateChange}
              className="w-auto cursor-pointer px-1"
            />
          </div>
        </div>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-bold w-[30%]">Customer Name</TableHead>
            <TableHead className="text-foreground font-bold w-[30%]">Email</TableHead>
            <TableHead className="text-foreground font-bold w-[20%]">Phone no</TableHead>
            <TableHead className="text-foreground font-bold w-36">Booked Date</TableHead>
            <TableHead className="text-right text-foreground  font-bold w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings && bookings?.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-lg text-center text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  No bookings available
                </motion.div>
              </TableCell>
            </TableRow>
          ) : (
            bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="py-1 w-[30%]">
                  <div className="truncate whitespace-nowrap w-full font-medium text-foreground">
                    {booking.fullName}
                  </div>
                </TableCell>
                <TableCell className="py-1 w-[30%]">
                  <div className="truncate whitespace-nowrap w-full font-medium text-foreground">
                    {booking.email}
                  </div>
                </TableCell>
                <TableCell className="py-1 w-[20%]">
                  <div className="truncate whitespace-nowrap w-full font-medium text-foreground">
                    {booking.phone}
                  </div>
                </TableCell>
                <TableCell className="py-1 w-36">
                  <div className="truncate whitespace-nowrap w-full font-medium text-foreground">
                    {booking.eventDate ? format(new Date(booking.eventDate), "dd/MM/yyyy") : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="py-1  w-20   flex justify-center items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground p-0.5  hover:text-foreground"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || isLoading}
        >
          Previous
        </Button>
        <span>
          Page {pagination?.page} of {pagination?.pages}
        </span>
        <Button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages || isLoading}
        >
          Next
        </Button>
      </div>
      <BookingDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        booking={selectedBooking}
      />
    </Card>
  );
};

export default BookingTable;
