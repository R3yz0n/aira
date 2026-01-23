"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  TCategoryCreateInput,
  categoryCreateSchema,
  categoryUpdateSchema,
  ICategory,
  ICategoryEntity,
} from "@/domain/category";
interface CategoryEditDialogProps {
  open: boolean;
  initialValue: ICategoryEntity | null;
  onClose: () => void;
  onCreate: (category: ICategory) => Promise<ICategoryEntity>;
  onUpdate: (id: string, category: ICategory) => Promise<ICategoryEntity>;
  isLoading: boolean;
}

export function CategoryEditDialog({
  open,
  initialValue,
  onClose,
  onCreate,
  onUpdate,
  isLoading,
}: CategoryEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCategoryCreateInput>({
    resolver: zodResolver(initialValue ? categoryUpdateSchema : categoryCreateSchema),
    defaultValues: {
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? "",
    });
  }, [initialValue, reset]);

  const handleSubmitForm = async (values: TCategoryCreateInput) => {
    if (initialValue) {
      await onUpdate(initialValue.id, values);
    } else {
      await onCreate(values);
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValue ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>Update the category details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="Enter category name"
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={3}
              placeholder="Describe this category"
              aria-invalid={errors.description ? "true" : "false"}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              className="md:inline-flex hidden"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-aira-blue text-white hover:bg-aira-blue/90"
              disabled={isSubmitting || isLoading}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
