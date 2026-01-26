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

  const loadMore = useCallback(
    async (
      page = pagination.page + 1,
      limit = pagination.limit,
      search = "",
      categoryId = "",
    ): Promise<IEventEntity[]> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const { data, total, pages } = await eventApi.list({
          page,
          limit,
          search,
          categoryId,
        });
        if (isMountedRef.current) {
          setEvents((prev) => [...prev, ...data]);
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

  const update = useCallback(
    async (id: string, formData: FormData): Promise<IEventEntity> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const updated = await eventApi.update(id, formData);

        if (isMountedRef.current) {
          setEvents((prev) => {
            const idx = prev.findIndex((e) => e.id === updated.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = updated;
              return copy;
            }
            return prev;
          });
          setError(null);
        }

        toast({ title: "Event updated", description: "Event saved." });
        return updated;
      } catch (error) {
        const err = error as IErrorResponse;
        let errorMessage = "Failed to update event";

        if (err?.status === 404) {
          errorMessage = "Event not found";
        } else if (err?.status === 400) {
          errorMessage = err?.message ?? "Invalid event data";
        } else if (err?.status === 413) {
          errorMessage = "File too large. Maximum allowed size exceeded.";
        } else if (err?.message) {
          errorMessage = err.message;
        }

        toast({
          title: "Update failed",
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

  const deleteEvent = useCallback(
    async (id: string): Promise<IEventEntity> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const deleted = await eventApi.delete(id);

        if (isMountedRef.current) {
          setEvents((prev) => prev.filter((e) => e.id !== id));
          setError(null);
        }

        toast({ title: "Event deleted", description: "Event removed." });
        return deleted;
      } catch (error) {
        const err = error as IErrorResponse;
        let errorMessage = "Failed to delete event";

        if (err?.status === 401) {
          errorMessage = err?.message || "Unauthorized: Missing or invalid token";
        } else if (err?.status === 400) {
          errorMessage = err?.message || "Invalid event ID format";
        } else if (err?.status === 404) {
          errorMessage = err?.message || "Event not found";
        } else if (err?.message) {
          errorMessage = err.message;
        }

        if (isMountedRef.current) setError(err);
        toast({
          title: "Delete failed",
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

  return { list, loadMore, create, update, deleteEvent, events, pagination, isLoading, error };
}
