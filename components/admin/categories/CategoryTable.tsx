"use client";

import { Category } from "./types";
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
  category: Category[];
  onEdit: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryTable({ category, onEdit, onDelete }: CategoryTableProps) {
  return (
    <Card className="p-6 bg-card shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Category Name</TableHead>
            <TableHead className="text-foreground">Total Events</TableHead>
            <TableHead className="text-foreground">Description</TableHead>
            <TableHead className="text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {category.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-lg text-center text-muted-foreground">
                No categories available
              </TableCell>
            </TableRow>
          ) : (
            category.map((category) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.totalEvents}</TableCell>
                <TableCell className="text-muted-foreground">{category.description}</TableCell>
                <TableCell className="text-right">
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
