"use client";

import { useState, useEffect } from "react";

import { CategoryEditDialog } from "@/components/admin/categories/CategoryEditDialog";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ICategoryEntity, TCategoryWithStats } from "@/domain/category";
import { useCategory } from "@/hooks/use-category";

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategoryWithStats | null>(null);

  const { list, create, update, categories, isLoading } = useCategory();

  // load categories once on mount
  useEffect(() => {
    // list is memoized in the hook, so safe to place in deps
    list().catch(() => {});
  }, [list]);

  const handleEdit = (category: TCategoryWithStats) => {
    console.log("Editing category", category);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage and track your event categories</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-aira-blue text-white hover:bg-aira-blue/90"
          onClick={handleCreate}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          {isLoading ? "Loading..." : "New Category"}
        </Button>
      </div>

      <CategoryTable categories={categories} onEdit={handleEdit} />

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
