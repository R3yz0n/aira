"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IEventEntity } from "@/domain/event";
import { useEvent } from "@/hooks/use-event";
import { useCategory } from "@/hooks/use-category";
import { EventTable } from "@/components/admin/events/EventTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import EventCreateDialog from "@/components/admin/events/EventCreateDialog";

export default function EventsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEventEntity | null>(null);

  const { events, pagination, list, isLoading, create, update, deleteEvent } = useEvent();
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
    setEditingEvent(event);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <AdminHeader title="Events" subtitle="Manage and track your events">
          <Button
            className="flex items-center gap-2 bg-aira-blue text-white hover:bg-aira-blue/90"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </AdminHeader>
      </div>

      <EventTable
        events={events}
        pagination={pagination}
        list={list}
        onEdit={handleEdit}
        onDelete={deleteEvent}
        isLoading={isLoading}
        categories={categories}
      />
      <EventCreateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={create}
        onUpdate={update}
        categories={categories}
        initialValue={editingEvent}
        isLoading={isLoading}
      />
    </div>
  );
}
