"use client";

import { TCategoryWithStats } from "@/domain/category";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryTableProps {
  categories: any[];
  // categories: TCategoryWithStats[];
  onEdit: (categories: TCategoryWithStats) => void;
  onDelete?: (categories: TCategoryWithStats) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <Card className="p-6 bg-card shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-bold">Category Name</TableHead>
            <TableHead className="text-foreground font-bold">Total Events</TableHead>
            <TableHead className="text-foreground font-bold">Description</TableHead>
            <TableHead className="text-right text-foreground font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-lg text-center text-muted-foreground">
                No categories available
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className="h-4">
                <TableCell className="p-1 font-medium text-foreground">{category.name}</TableCell>
                <TableCell className="p-1 text-muted-foreground">{category.totalEvents}</TableCell>
                <TableCell className="p-1 text-muted-foreground">{category.description}</TableCell>
                <TableCell className="p-1 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
