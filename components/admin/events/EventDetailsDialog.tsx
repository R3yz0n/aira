"use client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ICategoryEntity } from "@/domain/category";
import { IEventEntity } from "@/domain/event";
import Image from "next/image";

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: IEventEntity | null;
  categories: ICategoryEntity[];
  showOverlay?: boolean;
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  categories,
  showOverlay = false,
}: EventDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showOverlay && (
        <DialogOverlay className="fixed  inset-0 bg-black/50 z-50 backdrop-blur-sm" />
      )}
      <DialogContent>
        <DialogTitle asChild>
          <VisuallyHidden>{event?.title || "Event Details"}</VisuallyHidden>
        </DialogTitle>
        {event ? (
          <div className="space-y-4">
            {event.imageUrl && (
              <a
                href={event.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={0}
                aria-label="Open event image in new tab"
              >
                <div className="relative mt-4 w-full aspect-[4/3] flex justify-start overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    placeholder="blur"
                    blurDataURL="/placeholder.svg"
                    className="object-contain cursor-pointer transition-opacity duration-300"
                    unoptimized
                  />
                </div>
              </a>
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
