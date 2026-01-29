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

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { list: categoryList, categories, isLoading: isCategoryLoading } = useCategory();
  const { list: eventList, loadMore, events, pagination, isLoading } = useEvent();
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
      eventList(1, 16, "", categoryId);
    }
  }, [eventList, activeCategory, categories]);

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
        {/* Gallery Grid */}
        <div className=" mx-auto min-h-[90vh] px-2 md:px-4 lg:px-8">
          <div className="columns-2 md:columns-3 relative lg:columns-4 gap-2 space-y-2">
            {(events?.length ?? 0) === 0 && !isLoading && !isCategoryLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full  absolute top-0 left-0  text-lg md:text-xl font-semibold text-center text-secondary py-10"
              >
                No gallery images found.
              </motion.div>
            ) : (
              events?.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group bg-card cursor-pointer overflow-hidden shadow-md hover-lift"
                  onClick={() => setSelectedEvent(event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedEvent(event);
                  }}
                >
                  <div className="w-full relative hover-lift shadow-md overflow-hidden">
                    <Image
                      src={event?.imageUrl || "/placeholder.svg"}
                      alt={event?.title || "Event image"}
                      placeholder="blur"
                      blurDataURL="/placeholder.svg"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-110"
                    />
                    {/* Overlay for title and category on hover */}
                    <div className="absolute left-0 bottom-0 w-full px-4 pb-4 pt-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end min-h-[40%] pointer-events-none">
                      <span className="text-white line-clamp-1 font-display text-lg md:text-xl font-bold drop-shadow-md">
                        {event?.title}
                      </span>
                    </div>
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
                    pagination?.limit ?? 12,
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
