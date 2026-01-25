"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCategory } from "@/hooks/use-category";
import { useEffect, useState } from "react";
import { useEvent } from "@/hooks/use-event";
import { ICategoryEntity } from "@/domain/category";
import { IEventEntity } from "@/domain/event";
import Image from "next/image";
import { EventDetailsDialog } from "@/components/admin/events/EventDetailsDialog";

export function ServicesPreview() {
  const { list: categoryList, isLoading: isCategoryLoading, categories } = useCategory();
  const { list: eventList, isLoading: isEventLoading } = useEvent();

  // Array of { category: ICategoryEntity, event: IEventEntity|null }
  const [categoryEventPairs, setCategoryEventPairs] = useState<
    { category: ICategoryEntity; event: IEventEntity | null }[]
  >([]);

  // Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEventEntity | null>(null);

  useEffect(() => {
    categoryList();
  }, [categoryList]);

  useEffect(() => {
    // Only run when categories are loaded
    if ((categories?.length ?? 0) > 0) {
      // Filter categories with totalEvents > 0
      const eligible =
        categories?.filter((cat: ICategoryEntity) => cat.totalEvents && cat.totalEvents > 0) ?? [];
      if (eligible.length > 0) {
        // Fisher-Yates shuffle
        const shuffled = [...eligible];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const picked = shuffled.slice(0, 4);

        // Call eventList for each picked category in parallel and map one random event per category
        Promise.all(picked.map((cat) => eventList(1, 4, "", cat.id))).then((results) => {
          // results: IEventEntity[][], same order as picked
          const pairs = picked.map((category, idx) => {
            const events = results[idx] || [];
            let event: IEventEntity | null = null;
            if ((events?.length ?? 0) > 0) {
              // Pick a random event from this category
              event = events[Math.floor(Math.random() * events.length)];
            }
            return { category, event };
          });
          setCategoryEventPairs(pairs);
        });
      }
    }
  }, [categories, eventList]);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-aira-gold font-medium tracking-wider uppercase text-sm">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Events We <span className="text-gradient">Specialize</span> In
          </h2>
          <p className="text-muted-foreground text-lg">
            Every celebration deserves perfection. We bring creativity, expertise, and passion to
            every event we plan.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryEventPairs?.length === 0 && !isCategoryLoading && !isEventLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-4 text-xl font-semibold text-center text-secondary py-12"
            >
              No featured events found.
            </motion.div>
          ) : (
            categoryEventPairs
              ?.filter(({ event }) => event !== null)
              ?.map(({ category, event }, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-card hover-lift">
                    <Image
                      src={event?.imageUrl || "/placeholder.svg"}
                      alt={event?.title || "Event image"}
                      placeholder="blur"
                      blurDataURL="/placeholder.svg"
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                      fill
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-xl font-bold text-primary-foreground mb-2 line-clamp-2">
                        {category.name}
                      </h3>

                      {event ? (
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
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="text-xs text-muted-foreground"
                        >
                          No event found
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>
        {/* Single Event Details Dialog at root */}
        <EventDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          event={selectedEvent}
          categories={categories}
          showOverlay={true}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
