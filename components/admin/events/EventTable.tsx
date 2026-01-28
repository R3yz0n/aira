"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { IEventEntity } from "@/domain/event";
import { ICategoryEntity } from "@/domain/category";
import { Pencil, Trash2, Search, Eye } from "lucide-react";
import { debounce } from "lodash";
import EventDetailsDialog from "./EventDetailsDialog";
import EventDeleteDialog from "./EventDeleteDialog";
import { motion } from "framer-motion";
import { IPaginationParams } from "@/domain/common";

interface EventTableProps {
  events: IEventEntity[];
  pagination: IPaginationParams;
  list: (page: number, limit: number, search?: string, categoryId?: string) => void;
  onEdit: (event: IEventEntity) => void;
  onDelete: (id: string) => Promise<IEventEntity>;
  isLoading: boolean;
  categories: ICategoryEntity[];
}

export function EventTable({
  events = [],
  pagination,
  list,
  onEdit,
  onDelete,
  isLoading,
  categories,
}: EventTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEventEntity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const handlePageChange = (newPage: number) => {
    list(
      newPage,
      pagination?.limit,
      search,
      selectedCategory === "all" ? undefined : selectedCategory,
    );
  };
  const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    // create a new debounced function and store in ref
    const fn = debounce((value: string) => {
      list(1, pagination?.limit, value, selectedCategory === "all" ? undefined : selectedCategory);
    }, 300);

    debouncedRef.current = fn;

    // cleanup previous debounce on dep change or unmount
    return () => {
      fn.cancel();
      debouncedRef.current = null;
    };
  }, [pagination?.limit, selectedCategory, list]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedRef.current?.(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    list(1, pagination?.limit ?? 9, search, categoryId === "all" ? undefined : categoryId);
  };

  return (
    <Card className="p-3 lg:p-6 bg-card shadow-md">
      <div className="flex items-center justify-between mb-4 ">
        <div className="relative w-96  ">
          <Input
            placeholder="Search events with tile or description..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 w-80 md:w-96 text-sm md:text-base"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>
        <div className="w-auto h-10 px-2">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full h-full border flex px-2  rounded-md"
          >
            <option value="all">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table className=" w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-bold w-[40%]">Event Title</TableHead>
            <TableHead className="text-foreground font-bold w-[40%]">Description</TableHead>
            <TableHead className="text-right text-foreground font-bold w-48">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events && events?.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-lg text-center text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  No events available
                </motion.div>
              </TableCell>
            </TableRow>
          ) : (
            events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="py-1 w-[40%]">
                  <div className="truncate whitespace-nowrap w-full font-medium text-foreground">
                    {event.title}
                  </div>
                </TableCell>
                <TableCell className="py-1 w-[40%]">
                  <div className="truncate whitespace-nowrap w-full font-medium text-foreground">
                    {event.description}
                  </div>
                </TableCell>
                <TableCell className="py-1 text-right w-48 flex justify-end gap-2 items-center ">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground p-0.5  hover:text-foreground"
                    onClick={() => {
                      setSelectedEvent(event);
                      setDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground p-0.5 hover:text-foreground"
                    onClick={() => onEdit(event)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive p-0.5 hover:text-destructive"
                    onClick={() => {
                      setSelectedEvent(event);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <EventDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
        categories={categories}
      />
      <EventDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        event={selectedEvent}
        onDelete={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || isLoading}
        >
          Previous
        </Button>
        <span>
          Page {pagination?.page} of {pagination?.pages}
        </span>
        <Button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages || isLoading}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
