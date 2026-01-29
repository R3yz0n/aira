"use client";

import CategoryList from "@/components/admin/categories/CategoryList";
import { IEventEntity } from "@/domain/event";
import { useCategory } from "@/hooks/use-category";
import { useEvent } from "@/hooks/use-event";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import EventsByServicesList from "./EventsByServicesList";

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { list: categoryList, categories, isLoading: isCategoryLoading } = useCategory();
  const { list: eventList, loadMore, events, pagination, isLoading, clearEvents } = useEvent();
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
      clearEvents(); // Clear events before fetching new ones
      eventList(1, 9, "", categoryId);
    }
  }, [eventList, activeCategory, categories]);
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-4 md:py-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-aira-gold font-medium tracking-wider uppercase text-sm">
              Our Services
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              Events We <span className="text-secondary">Create</span>
            </h1>
            <p className="text-muted-foreground md:text-lg md:leading-relaxed">
              From intimate ceremonies to grand celebrations, we specialize in creating
              unforgettable experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-20 bg-background/95 backdrop-blur-md z-40">
        <CategoryList
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          isCategoryLoading={isCategoryLoading}
        />
      </section>

      <EventsByServicesList
        events={events}
        isLoading={isLoading}
        isCategoryLoading={isCategoryLoading}
        categories={categories}
        pagination={pagination}
        loadMore={loadMore}
        activeCategory={activeCategory}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
