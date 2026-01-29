"use client";

import { Button } from "@/components/ui/button";
import { IEventEntity } from "@/domain/event";
import { useCategory } from "@/hooks/use-category";
import { useEvent } from "@/hooks/use-event";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CategoryList from "@/components/admin/categories/CategoryList";
import GalleryEventList from "./GalleryEventList";

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { list: categoryList, categories, isLoading: isCategoryLoading } = useCategory();
  const { list: eventList, loadMore, events, pagination, isLoading, clearEvents } = useEvent();
  // Modal state
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
      eventList(1, 16, "", categoryId);
    }
  }, [eventList, activeCategory, categories, clearEvents]);

  return (
    <>
      {/* Filter Tabs */}
      <section className="border-b border-border sticky top-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-md z-40">
        <CategoryList
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          isCategoryLoading={isCategoryLoading}
        />
      </section>

      <section className="py-4">
        <GalleryEventList
          events={events}
          isLoading={isLoading}
          isCategoryLoading={isCategoryLoading}
          setSelectedEvent={setSelectedEvent}
          pagination={pagination}
          loadMore={loadMore}
          activeCategory={activeCategory}
        />
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <button
              className="absolute top-6 right-6 text-primary-foreground hover:text-aira-gold transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                src={selectedEvent?.imageUrl || "/placeholder.svg"}
                alt={selectedEvent?.title || "Event image"}
                loading="eager"
                className=" object-contain mt-[5%] rounded-lg max-h-[70vh] w-full"
              />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary-foreground font-display text-lg md:text-xl mt-4"
              >
                {selectedEvent?.title}
              </motion.p>
              <motion.p className="text-muted-foreground text-sm my-2 line-clamp-6">
                {selectedEvent?.description}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
