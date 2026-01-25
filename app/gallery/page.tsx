"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useCategory } from "@/hooks/use-category";
import { useEvent } from "@/hooks/use-event";
import Image from "next/image";
import { IEventEntity } from "@/domain/event";
import { EventDetailsDialog } from "@/components/admin/events/EventDetailsDialog";
import Masonry from "react-masonry-css";

const galleryItems = [
  { id: 1, category: "Weddings", image: "/hero-wedding.jpg", title: "Royal Wedding - Jaipur" },
  {
    id: 2,
    category: "Corporate",
    image: "/corporate-event.jpg",
    title: "Tech Conference - Mumbai",
  },
  {
    id: 3,
    category: "Birthdays",
    image: "/birthday-event.jpg",
    title: "Princess Birthday Party",
  },
  { id: 4, category: "Weddings", image: "/sangeet-event.jpg", title: "Sangeet Night - Delhi" },
  {
    id: 5,
    category: "Luxury",
    image: "/hero-wedding.jpg",
    title: "Destination Wedding - Udaipur",
  },
  {
    id: 6,
    category: "Corporate",
    image: "/corporate-event.jpg",
    title: "Product Launch - Bangalore",
  },
  { id: 7, category: "Weddings", image: "/hero-wedding.jpg", title: "Beach Wedding - Goa" },
  {
    id: 8,
    category: "Birthdays",
    image: "/birthday-event.jpg",
    title: "50th Anniversary Celebration",
  },
  { id: 9, category: "Luxury", image: "/sangeet-event.jpg", title: "Royal Mehendi Ceremony" },
  { id: 10, category: "Corporate", image: "/corporate-event.jpg", title: "Annual Gala Dinner" },
  {
    id: 11,
    category: "Weddings",
    image: "/hero-wedding.jpg",
    title: "Traditional South Indian Wedding",
  },
  { id: 12, category: "Luxury", image: "/hero-wedding.jpg", title: "Palace Wedding - Jodhpur" },
];
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
              Our Gallery
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Moments We've <span className="text-secondary">Created</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A glimpse into the celebrations we've brought to life. Each image tells a story of
              love, joy, and meticulous planning.
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

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {/* <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <button
              className="absolute top-6 right-6 text-primary-foreground hover:text-aira-gold transition-colors"
              onClick={() => setSelectedEvent(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-contain rounded-lg"
              />
              <p className="text-center text-primary-foreground font-display text-xl mt-4">
                {selectedEvent.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
}
