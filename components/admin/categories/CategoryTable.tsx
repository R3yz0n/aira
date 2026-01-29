"use client";

import { ICategoryEntity } from "@/domain/category";
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
import { motion } from "framer-motion";
interface CategoryTableProps {
  categories: ICategoryEntity[];
  onEdit: (categories: ICategoryEntity) => void;
  onDelete?: (categories: ICategoryEntity) => void;
  isLoading?: boolean;
}

export function CategoryTable({ categories, onEdit, onDelete, isLoading }: CategoryTableProps) {
  return (
    <Card className="p-3 lg:p-6 bg-card shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-bold">Category Name</TableHead>
            <TableHead className="text-foreground font-bold">Total Events</TableHead>
            <TableHead className="text-foreground font-bold">Description</TableHead>
            <TableHead className="text-right text-foreground font-bold w-fit">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-base md:text-lg text-center text-muted-foreground"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-muted-foreground"
                >
                  Loading categories...
                </motion.div>
              </TableCell>
            </TableRow>
          ) : categories?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-lg text-center text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  No categories available
                </motion.div>
              </TableCell>
            </TableRow>
          ) : (
            categories?.map((category) => (
              <TableRow key={category.id} className="h-4">
                <TableCell className="p-1 font-medium text-foreground">
                  <div>{category.name}</div>
                </TableCell>
                <TableCell className="p-1 text-muted-foreground">
                  {category?.totalEvents ?? 0}
                </TableCell>
                <TableCell className="p-1 text-muted-foreground">
                  <div>{category.description}</div>
                </TableCell>
                <TableCell className=" text-right w-fit ">
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
