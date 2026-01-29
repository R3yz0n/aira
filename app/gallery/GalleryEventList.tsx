import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IEventEntity } from "@/domain/event";

interface GalleryEventListProps {
  events: IEventEntity[];
  isLoading: boolean;
  isCategoryLoading: boolean;
  setSelectedEvent: (event: IEventEntity | null) => void;
  pagination: { page: number; pages: number; limit: number };
  loadMore: (page: number, limit: number, search: string, category: string) => void;
  activeCategory: string;
}

const GalleryEventList: React.FC<GalleryEventListProps> = ({
  events,
  isLoading,
  isCategoryLoading,
  setSelectedEvent,
  pagination,
  loadMore,
  activeCategory,
}) => {
  return (
    <div className="mx-auto min-h-[90vh] px-2 md:px-4 lg:px-8">
      <div className="columns-2 md:columns-3 relative lg:columns-4 gap-2 space-y-2">
        {(isLoading || isCategoryLoading) &&
          events?.length === 0 &&
          Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[200px] bg-muted shadow animate-pulse rounded-md"
            ></div>
          ))}
        {!isLoading && !isCategoryLoading && (events?.length ?? 0) === 0 ? (
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
  );
};

export default GalleryEventList;
