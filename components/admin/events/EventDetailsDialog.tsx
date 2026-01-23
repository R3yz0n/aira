import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IEventEntity } from "@/domain/event";
import { ICategoryEntity } from "@/domain/category";

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
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Event Details</DialogTitle>
        {event ? (
          <div className="space-y-4">
            {event.imageUrl && (
              <div className="relative w-full h-48 rounded-md overflow-hidden">
                {imgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Image src="/placeholder.svg" alt="placeholder" width={64} height={64} />
                  </div>
                )}
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
                  unoptimized
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
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
