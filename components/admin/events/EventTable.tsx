import React, { useState, useCallback } from "react";
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
import { IEventEntity, IPaginationParams } from "@/domain/event";
import { ICategoryEntity } from "@/domain/category";
import { Pencil, Trash2, Search } from "lucide-react";
import { debounce } from "lodash";

interface EventTableProps {
  events: IEventEntity[];
  pagination: IPaginationParams;
  list: (page: number, limit: number, search?: string, categoryId?: string) => void;
  onEdit: (event: IEventEntity) => void;
  onDelete?: (event: IEventEntity) => void;
  isLoading: boolean;
  categories: ICategoryEntity[];
}

export function EventTable({
  events,
  pagination,
  list,
  onEdit,
  onDelete,
  isLoading,
  categories,
}: EventTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handlePageChange = (newPage: number) => {
    list(
      newPage,
      pagination.limit,
      search,
      selectedCategory === "all" ? undefined : selectedCategory,
    );
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      list(1, pagination.limit, value, selectedCategory === "all" ? undefined : selectedCategory);
    }, 300),
    [pagination.limit, selectedCategory],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    list(1, pagination.limit, search, categoryId === "all" ? undefined : categoryId);
  };

  console.log("Categories:", categories); // Debugging to check if categories are populated

  return (
    <Card className="p-6 bg-card shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>
        <div className="w-auto h-10 px-2">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full h-full  border flex px-2  rounded-md"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-bold">Event Title</TableHead>
            <TableHead className="text-foreground font-bold">Description</TableHead>
            <TableHead className="text-right text-foreground font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-lg text-center text-muted-foreground">
                No events available
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="py-1 font-medium text-foreground">{event.title}</TableCell>
                <TableCell className="py-1 text-muted-foreground">{event.description}</TableCell>
                <TableCell className="py-1 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(event)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(event)}
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
      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || isLoading}
        >
          Previous
        </Button>
        <span>
          Page {pagination.page} of {pagination.pages}
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
