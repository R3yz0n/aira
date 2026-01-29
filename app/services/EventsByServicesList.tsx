"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { IEventEntity } from "@/domain/event";
import { ICategoryEntity } from "@/domain/category";
import { EventDetailsDialog } from "@/components/admin/events/EventDetailsDialog";

interface EventsByServicesListProps {
  events?: IEventEntity[];
  isLoading: boolean;
  isCategoryLoading: boolean;
  categories?: ICategoryEntity[];
  pagination?: {
    page: number;
    pages: number;
    limit: number;
  };
  loadMore: (page: number, limit: number, search: string, categoryId: string) => void;
  activeCategory: string;
  selectedEvent: IEventEntity | null;
  setSelectedEvent: (event: IEventEntity | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export default function EventsByServicesList({
  events,
  isLoading,
  isCategoryLoading,
  categories,
  pagination,
  loadMore,
  activeCategory,
  selectedEvent,
  setSelectedEvent,
  dialogOpen,
  setDialogOpen,
}: EventsByServicesListProps) {
  return (
    <>
      {/* Services Grid */}
      <div className="container min-h-[70vh] mx-auto px-4 py-2  lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(isLoading || isCategoryLoading) &&
            events?.length === 0 &&
            Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="group bg-card rounded-2xl overflow-hidden shadow-md">
                <div className="h-52 md:h-56 bg-muted animate-pulse"></div>
                <div className="px-4 py-2 md:p-5 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-9 bg-muted animate-pulse rounded w-28 mt-4"></div>
                </div>
              </div>
            ))}
          {!isLoading && !isCategoryLoading && (events?.length ?? 0) === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-full text-lg md:text-xl font-semibold text-center text-secondary py-12"
            >
              No events found.
            </motion.div>
          ) : (
            events?.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-md hover-lift"
              >
                <div className="relative h-52 md:h-56 hover-lift shadow-md overflow-hidden">
                  <Image
                    src={event?.imageUrl || "/placeholder.svg"}
                    alt={event?.title || "Event image"}
                    placeholder="blur"
                    blurDataURL="/placeholder.svg"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    fill
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-aira-gold text-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {categories?.find((c) => c.id === event.categoryId)?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 md:p-5">
                  <h3 className="font-display md:text-xl font-bold line-clamp-2 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-1">
                    {event.description}
                  </p>
                  <Button variant="pinkOutline" size="sm" asChild>
                    {event && (
                      <button
                        className="inline-flex items-center gap-2 text-aira-gold font-medium text-sm hover:gap-3 transition-all"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDialogOpen(true);
                        }}
                        type="button"
                      >
                        View Event
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div className="my-12 flex justify-center">
          {(pagination?.page ?? 0) < (pagination?.pages ?? 0) && (
            <Button
              variant="pink"
              className="rounded hover-lift hover:opacity-80 text-sm md:text-base px-10 md:px-14 h-9 md:h-10"
              size="lg"
              onClick={() =>
                loadMore(
                  (pagination?.page ?? 0) + 1,
                  pagination?.limit ?? 0,
                  "",
                  activeCategory === "all" ? "" : activeCategory,
                )
              }
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              We create custom events tailored to your unique vision. Tell us your dream, and we'll
              make it happen.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">Contact Us for Custom Events</Link>
            </Button>
          </motion.div>
        </div>
        <EventDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          event={selectedEvent}
          categories={categories || []}
          showOverlay={true}
        />
      </section>
    </>
  );
}
