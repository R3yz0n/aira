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
import { CategoryCreateInput, categoryCreateSchema, ICategoryEntity } from "@/domain/category";
type CategoryForUI = Pick<ICategoryEntity, "id" | "name" | "description">;
interface CategoryEditDialogProps {
  open: boolean;
  initialValue: CategoryForUI | null;
  onClose: () => void;
  onSave: (category: CategoryForUI) => void;
}

export function CategoryEditDialog({
  open,
  initialValue,
  onClose,
  onSave,
}: CategoryEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema),
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

  const handleSubmitForm = (values: CategoryCreateInput) => {
    onSave({
      id: initialValue?.id || Date.now().toString(),
      name: values.name.trim(),
      description: values.description.trim(),
    });
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-aira-blue text-white hover:bg-aira-blue/90"
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
