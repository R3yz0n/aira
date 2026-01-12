import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { categoryApi } from "@/lib/api/category";
import type { IErrorResponse } from "@/lib/types/api";
import type { CategoryCreateInput, CategoryUpdateInput, ICategoryEntity } from "@/domain/category";

// Shared counter to track how many components are using this hook

export function useCategory() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ICategoryEntity[]>([]);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const list = useCallback(async (): Promise<ICategoryEntity[]> => {
    if (isMountedRef.current) setIsLoading(true);
    try {
      const data = await categoryApi.list();

      if (isMountedRef.current) {
        setCategories(data);
        setError(null);
      }
      return data;
    } catch (error) {
      const err = error as IErrorResponse;
      if (isMountedRef.current) setError(err);
      toast({
        title: "Load failed",
        description: err?.message ?? "Failed to load categories",
        variant: "destructive",
      });
      throw err;
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [toast]);

  const create = useCallback(
    async (input: CategoryCreateInput): Promise<ICategoryEntity> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const created = await categoryApi.create(input);

        if (isMountedRef.current) {
          setCategories((prev) => [...prev, created]);
        }
        toast({ title: "Category created", description: "New category saved." });
        return created;
      } catch (error) {
        const err = error as IErrorResponse;
        let errorMessage = "Failed to create category";

        if (err?.status === 409) {
          errorMessage = "A category with this name already exists";
        } else if (err?.status === 400) {
          errorMessage = err?.message ?? "Invalid category data";
        } else if (err?.message) {
          errorMessage = err.message;
        }

        toast({
          title: "Create failed",
          description: errorMessage ?? "Failed to create category",
          variant: "destructive",
        });
        throw err;
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [toast]
  );

  const update = useCallback(
    async (id: string, input: CategoryUpdateInput): Promise<ICategoryEntity> => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const updated = await categoryApi.update(id, input);

        if (isMountedRef.current) {
          setCategories((prev) => {
            const idx = prev.findIndex((c) => c.id === id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = updated;
              return copy;
            }
            return prev;
          });
        }
        toast({ title: "Category updated", description: "Changes saved successfully." });
        return updated;
      } catch (error) {
        const err = error as IErrorResponse;
        let errorMessage = "Failed to update category";

        if (err?.status === 404) {
          errorMessage = "Category not found";
        } else if (err?.status === 409) {
          errorMessage = "A category with this name already exists";
        } else if (err?.status === 400) {
          errorMessage = err?.message ?? "Invalid category data";
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
    [toast]
  );

  const upsertLocal = useCallback((cat: ICategoryEntity) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === cat.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cat;
        return copy;
      }
      return [...prev, cat];
    });
  }, []);

  return { list, create, update, categories, upsertLocal, isLoading, error };
}
