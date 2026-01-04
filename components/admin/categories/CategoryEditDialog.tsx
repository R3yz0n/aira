"use client";

import { useEffect, useState } from "react";
import { Category } from "./types";
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

interface CategoryEditDialogProps {
  open: boolean;
  initialValue: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export function CategoryEditDialog({
  open,
  initialValue,
  onClose,
  onSave,
}: CategoryEditDialogProps) {
  const [name, setName] = useState("");
  const [totalEvents, setTotalEvents] = useState("0");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialValue) {
      setName(initialValue.name);
      setTotalEvents(String(initialValue.totalEvents));
      setDescription(initialValue.description);
    } else {
      setName("");
      setTotalEvents("0");
      setDescription("");
    }
  }, [initialValue]);

  const handleSave = () => {
    onSave({
      name: name.trim(),
      totalEvents: Number(totalEvents) || 0,
      description: description.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValue ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>Update the category details below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-items">Items</Label>
            <Input
              id="category-items"
              type="number"
              min="0"
              value={totalEvents}
              onChange={(e) => setTotalEvents(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this category"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-aira-blue text-white hover:bg-aira-blue/90" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
