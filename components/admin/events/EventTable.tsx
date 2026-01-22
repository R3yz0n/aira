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
import { Pencil, Trash2, Search, Eye } from "lucide-react";
import Image from "next/image";
import { debounce } from "lodash";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEventEntity | null>(null);
  const [imgLoading, setImgLoading] = useState(true);
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
    <Card className="p-3 lg:p-6 bg-card shadow-md">
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

      <Table className=" w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-bold w-[40%]">Event Title</TableHead>
            <TableHead className="text-foreground font-bold w-[40%]">Description</TableHead>
            <TableHead className="text-right text-foreground font-bold ">Actions</TableHead>
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
                <TableCell className="py-1 text-right flex justify-end gap-2 items-center ">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground p-0.5  hover:text-foreground"
                    onClick={() => {
                      setImgLoading(true);
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
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive p-0.5 hover:text-destructive"
                      onClick={() => onDelete(event)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Event Details</DialogTitle>
          {selectedEvent ? (
            <div className="space-y-4">
              {selectedEvent.imageUrl && (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  {imgLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <Image src="/placeholder.svg" alt="placeholder" width={64} height={64} />
                    </div>
                  )}
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    fill
                    className={`object-cover transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
                    unoptimized
                    onLoad={() => setImgLoading(false)}
                    onError={() => setImgLoading(false)}
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{selectedEvent.title} </h3>
                <Badge className="text-sm  mt-3 ">
                  {categories.find((c) => c.id === selectedEvent.categoryId)?.name ||
                    "Uncategorized"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{selectedEvent.description} </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
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
