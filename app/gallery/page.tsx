"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { X } from "lucide-react";

const categories = ["All", "Weddings", "Corporate", "Birthdays", "Luxury"];

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
  } | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => setSelectedImage({ image: item.image, title: item.title })}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs text-aira-gold font-medium">{item.category}</span>
                    <h3 className="font-display text-lg font-bold text-primary-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-primary-foreground hover:text-aira-gold transition-colors"
              onClick={() => setSelectedImage(null)}
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
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              <p className="text-center text-primary-foreground font-display text-xl mt-4">
                {selectedImage.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
