"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCategory } from "@/hooks/use-category";
import { useEvent } from "@/hooks/use-event";
import Image from "next/image";
import { IEventEntity } from "@/domain/event";
import { EventDetailsDialog } from "@/components/admin/events/EventDetailsDialog";

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { list: categoryList, categories, isLoading: isCategoryLoading } = useCategory();
  const { list: eventList, loadMore, events, pagination, isLoading } = useEvent();
  // Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEventEntity | null>(null);
  // Fetch categories only once on mount
  useEffect(() => {
    categoryList();
  }, [categoryList]);

  // Fetch events on mount and when activeCategory changes
  useEffect(() => {
    const categoryId = activeCategory === "all" ? "" : activeCategory;
    if ((categories?.length ?? 0) > 0) {
      eventList(1, 9, "", categoryId);
    }
  }, [eventList, activeCategory, categories]);
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-aira-gold font-medium tracking-wider uppercase text-sm">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Events We <span className="text-secondary">Create</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From intimate ceremonies to grand celebrations, we specialize in creating
              unforgettable experiences tailored to your vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-md z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {/* All Categories Button */}
            {!isCategoryLoading && (categories?.length ?? 0) > 0 && (
              <button
                key="all"
                onClick={() => setActiveCategory("all")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
            )}
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {(events?.length ?? 0) === 0 && !isLoading && !isCategoryLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-4 text-xl font-semibold text-center text-secondary py-12"
            >
              No events found.
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events?.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-md hover-lift"
                >
                  <div className="relative h-56 hover-lift shadow-md overflow-hidden">
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
                        {categories?.find((c) => c.id === event.categoryId)?.name ||
                          "Uncategorized"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold line-clamp-2 mb-3">
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
              ))}
              <EventDetailsDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                event={selectedEvent}
                categories={categories}
                showOverlay={true}
              />
            </div>
          )}
          <div className="mt-8 flex justify-center">
            {(pagination?.page ?? 0) < (pagination?.pages ?? 0) && (
              <Button
                variant="hero"
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
      </section>

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
      </section>
    </>
  );
}
