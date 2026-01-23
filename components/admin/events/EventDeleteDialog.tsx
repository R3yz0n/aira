import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IEventEntity } from "@/domain/event";
import Image from "next/image";
import { useState } from "react";

interface EventDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: IEventEntity | null;
  onDelete: (id: string) => Promise<IEventEntity>;
  isLoading: boolean;
}

export function EventDeleteDialog({
  open,
  onOpenChange,
  event,
  onDelete,
  isLoading,
}: EventDeleteDialogProps) {
  const [imgLoading, setImgLoading] = useState(true);
  const handleDelete = async () => {
    if (!event) return;

    await onDelete(event.id);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Delete Event</DialogTitle>
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
              <h3 className="text-lg font-semibold">{event.title}</h3>
            </div>

            <div className="text-muted-foreground">Are you sure you want to delete this event?</div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="md:inline-flex hidden"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default EventDeleteDialog;
