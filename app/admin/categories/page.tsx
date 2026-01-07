"use client";

import { useState } from "react";

import { CategoryEditDialog } from "@/components/admin/categories/CategoryEditDialog";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ICategoryEntity, TCategoryWithStats } from "@/domain/category";

const seedCategories: TCategoryWithStats[] = [
  { id: "wedding", name: "Wedding", totalEvents: 42, description: "Weddings and receptions" },
  {
    id: "corporate",
    name: "Corporate",
    totalEvents: 28,
    description: "Corporate summits and meetups",
  },
  {
    id: "birthday",
    name: "Birthday",
    totalEvents: 18,
    description: "Birthday parties and celebrations",
  },
  { id: "concert", name: "Concert", totalEvents: 9, description: "Concerts and live shows" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<TCategoryWithStats[]>(seedCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategoryWithStats | null>(null);

  const handleEdit = (category: TCategoryWithStats) => {
    console.log("Editing category", category);
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleSave = (category: Pick<ICategoryEntity, "id" | "name" | "description">) => {
    const categoryWithStats: TCategoryWithStats = {
      ...category,
      totalEvents: editingCategory?.totalEvents ?? 0,
    };

    console.log(editingCategory ? "Updated category" : "Added category", categoryWithStats);

    setCategories((prev) => {
      if (editingCategory) {
        return prev.map((item) => (item.id === editingCategory.id ? categoryWithStats : item));
      }
      return [...prev, categoryWithStats];
    });

    setDialogOpen(false);
    setEditingCategory(null);
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
        >
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      <CategoryTable category={categories} onEdit={handleEdit} />

      <CategoryEditDialog
        open={dialogOpen}
        initialValue={editingCategory}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
}
