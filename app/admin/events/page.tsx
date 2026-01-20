"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IEventEntity } from "@/domain/event";
import { useEvent } from "@/hooks/use-event";
import { useCategory } from "@/hooks/use-category";
import { EventTable } from "@/components/admin/events/EventTable";

export default function EventsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEventEntity | null>(null);

  const { events, pagination, list, isLoading } = useEvent();
  const { categories, list: fetchCategories } = useCategory();

  // Load events and categories once on mount
  useEffect(() => {
    fetchCategories().catch(() => {});
    list(1, 9, "", "").catch(() => {}); // Pass default parameters
  }, [list, fetchCategories]);

  const handleCreate = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleEdit = (event: IEventEntity) => {
    console.log(`Edit event with ID: ${event.id}`);
  };

  const handleDelete = (event: IEventEntity) => {
    console.log(`Delete event with ID: ${event.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground">Manage and track your events</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-aira-blue text-white hover:bg-aira-blue/90"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4" />
          New Event
        </Button>
      </div>

      <EventTable
        events={events}
        pagination={pagination}
        list={list}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        categories={categories}
      />
    </div>
  );
}
