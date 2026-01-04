"use client";

import { useState } from "react";

import { Category } from "@/components/admin/categories/types";
import { CategoryEditDialog } from "@/components/admin/categories/CategoryEditDialog";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const seedCategories: Category[] = [
  { name: "Wedding", totalEvents: 42, description: "Weddings and receptions" },
  { name: "Corporate", totalEvents: 28, description: "Corporate summits and meetups" },
  { name: "Birthday", totalEvents: 18, description: "Birthday parties and celebrations" },
  { name: "Concert", totalEvents: 9, description: "Concerts and live shows" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleSave = (category: Category) => {
    setCategories((prev) => {
      if (editingCategory) {
        return prev.map((item) => (item.name === editingCategory.name ? category : item));
      }
      return [...prev, category];
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
