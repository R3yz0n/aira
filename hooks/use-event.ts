import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { eventApi } from "@/lib/api/event";
import type { IErrorResponse } from "@/lib/types/api";
import type { IEventEntity, IPaginationParams } from "@/domain/event";

export function useEvent() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<IEventEntity[]>([]);
  const [pagination, setPagination] = useState<IPaginationParams>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [error, setError] = useState<IErrorResponse | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const list = useCallback(
    async (page = 1, limit = 10, search = "", categoryId = ""): Promise<IEventEntity[]> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const { data, total, pages } = await eventApi.list({
          page,
          limit,
          search,
          categoryId,
        });
        if (isMountedRef.current) {
          setEvents(data);
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
    async (formData: FormData): Promise<IEventEntity> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const created = await eventApi.create(formData);

        if (isMountedRef.current) {
          setEvents((prev) => [created, ...prev]);
          setError(null);
        }

        toast({ title: "Event created", description: "New event saved." });
        return created;
      } catch (error) {
        const err = error as IErrorResponse;
        let errorMessage = "Failed to create event";

        if (err?.status === 409) {
          errorMessage = "An event with this title already exists";
        } else if (err?.status === 400) {
          errorMessage = err?.message ?? "Invalid event data";
        } else if (err?.status === 413) {
          errorMessage = "File too large. Maximum allowed size exceeded.";
        } else if (err?.message) {
          errorMessage = err.message;
        }

        toast({
          title: "Create failed",
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

  return { list, create, events, pagination, isLoading, error };
}
