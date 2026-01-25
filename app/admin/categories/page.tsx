"use client";

import { useState, useEffect } from "react";

import { CategoryEditDialog } from "@/components/admin/categories/CategoryEditDialog";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ICategoryEntity } from "@/domain/category";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useCategory } from "@/hooks/use-category";

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryEntity | null>(null);

  const { list, create, update, categories, isLoading } = useCategory();

  // load categories once on mount
  useEffect(() => {
    // list is memoized in the hook, so safe to place in deps
    list().catch(() => {});
  }, [list]);

  const handleEdit = (category: ICategoryEntity) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <AdminHeader title="Categories" subtitle="Manage and track your event categories">
          <Button
            className="flex items-center gap-2 bg-aira-blue text-white hover:bg-aira-blue/90"
            onClick={handleCreate}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            {isLoading ? "Loading..." : "New Category"}
          </Button>
        </AdminHeader>
      </div>

      <CategoryTable isLoading={isLoading} categories={categories} onEdit={handleEdit} />

      <CategoryEditDialog
        open={dialogOpen}
        initialValue={editingCategory}
        onClose={handleClose}
        onCreate={create}
        onUpdate={update}
        isLoading={isLoading}
      />
    </div>
  );
}
