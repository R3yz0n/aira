"use client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ICategoryEntity } from "@/domain/category";
import { IEventEntity } from "@/domain/event";
import { DialogOverlay } from "@radix-ui/react-dialog";
import Image from "next/image";

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: IEventEntity | null;
  categories: ICategoryEntity[];
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  categories,
}: EventDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed  inset-0 bg-black/50 z-50" />
      <DialogContent>
        <DialogTitle>Event Details</DialogTitle>
        {event ? (
          <div className="space-y-4">
            {event.imageUrl && (
              <div className="relative  w-full  aspect-[4/3] flex justify-start  overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  className="object-contain object-left   transition-opacity duration-300"
                  unoptimized
                />
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold">{event.title} </h3>
              <Badge className="text-sm mt-3">
                {categories.find((c) => c.id === event.categoryId)?.name || "Uncategorized"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">{event.description} </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default EventDetailsDialog;
