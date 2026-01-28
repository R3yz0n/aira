import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { bookingApi } from "@/lib/api/booking";
import type { IErrorResponse } from "@/lib/types/api";
import type { IBookingEntity, TBookingCreateInput } from "@/domain/booking";
import { IPaginationParams } from "@/domain/common";

export function useBooking() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<IBookingEntity[]>([]);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const isMountedRef = useRef(true);
  const [pagination, setPagination] = useState<IPaginationParams>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const list = useCallback(
    async (
      page = 1,
      limit = 9,
      search = "",
      startDate = "",
      endDate = "",
    ): Promise<IBookingEntity[]> => {
      if (isMountedRef.current) setIsLoading(true);

      try {
        const { data, total, pages } = await bookingApi.list({
          page,
          limit,
          search,
          startDate,
          endDate,
        });
        if (isMountedRef.current) {
          setBookings(data);
          setPagination({ page, limit, total, pages });
          setError(null);
        }
        return data;
      } catch (error) {
        const err = error as IErrorResponse;
        if (isMountedRef.current) setError(err);
        toast({
          title: "Load failed",
          description: err?.message ?? "Failed to load events",
          variant: "destructive",
        });
        throw err;
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [toast],
  );

  const create = useCallback(
    async (input: TBookingCreateInput): Promise<IBookingEntity> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const created = await bookingApi.create(input);

        if (isMountedRef.current) {
          setBookings((prev) => [created, ...prev]);
          setError(null);
        }

        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. Our team will contact you within 24 hours.",
        });
        return created;
      } catch (error) {
        const err = error as IErrorResponse;
        let errorMessage = "Failed to create booking";

        if (err?.status === 400) {
          errorMessage = err?.message ?? "Invalid booking data";
        } else if (err?.message) {
          errorMessage = err.message;
        }

        toast({
          title: "Submission failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [toast],
  );

  return { create, bookings, isLoading, error, list, pagination };
}
