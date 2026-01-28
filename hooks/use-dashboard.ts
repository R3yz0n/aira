import { IStatsSummary } from "@/domain/common";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/lib/api/dashboard";
import type { IErrorResponse } from "@/lib/types/api";
import { useCallback, useEffect, useRef, useState } from "react";

// Shared counter to track how many components are using this hook

export function useDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<IStatsSummary>({
    totalEvents: 0,
    totalCategories: 0,
    totalBookings: 0,
    latestBookings: [],
    latestEvents: [],
  });
  const [error, setError] = useState<IErrorResponse | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getSummary = useCallback(async (): Promise<IStatsSummary> => {
    if (isMountedRef.current) setIsLoading(true);
    try {
      const data = await dashboardApi.getSummary();

      if (isMountedRef.current) {
        setStats(data);
        setError(null);
      }
      return data;
    } catch (error) {
      const err = error as IErrorResponse;
      if (isMountedRef.current) setError(err);
      toast({
        title: "Load failed",
        description: err?.message ?? "Failed to load stats",
        variant: "destructive",
      });
      throw err;
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [toast]);

  return { getSummary, isLoading, error, stats };
}
