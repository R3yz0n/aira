"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Wedding Events", "Social Events", "Corporate Events", "Luxury Events"];

const services = [
  {
    category: "Wedding Events",
    title: "Engagement Ceremony",
    description:
      "A beautiful beginning to your forever. We create intimate, memorable engagement ceremonies with elegant decor and seamless coordination.",
    image: "/hero-wedding.jpg",
  },
  {
    category: "Wedding Events",
    title: "Mehendi & Haldi",
    description:
      "Traditional ceremonies filled with color, laughter, and joy. We bring authentic vibes with modern touches.",
    image: "/sangeet-event.jpg",
  },
  {
    category: "Wedding Events",
    title: "Sangeet Night",
    description:
      "A night of music, dance, and celebration. We create the perfect stage for your family's performances.",
    image: "/sangeet-event.jpg",
  },
  {
    category: "Wedding Events",
    title: "Wedding Day",
    description:
      "Your dream wedding brought to life. From mandap decoration to guest coordination, we handle every detail.",
    image: "/hero-wedding.jpg",
  },
  {
    category: "Wedding Events",
    title: "Reception",
    description:
      "Grand celebrations that leave lasting impressions. Elegant setups, gourmet dining, and memorable entertainment.",
    image: "/hero-wedding.jpg",
  },
  {
    category: "Social Events",
    title: "Birthday Celebrations",
    description:
      "From kids' parties to milestone birthdays. Creative themes, exciting activities, and unforgettable moments.",
    image: "/birthday-event.jpg",
  },
  {
    category: "Social Events",
    title: "Anniversary Events",
    description:
      "Celebrate years of love with elegance. Romantic setups, cherished memories, and joyful gatherings.",
    image: "/hero-wedding.jpg",
  },
  {
    category: "Social Events",
    title: "Baby Shower",
    description:
      "Welcome the little one with love. Cute themes, fun games, and heartwarming celebrations.",
    image: "/birthday-event.jpg",
  },
  {
    category: "Corporate Events",
    title: "Conferences & Seminars",
    description:
      "Professional setups for impactful business events. State-of-the-art AV, comfortable seating, and smooth logistics.",
    image: "/corporate-event.jpg",
  },
  {
    category: "Corporate Events",
    title: "Product Launch",
    description:
      "Make a statement with stunning product reveals. Creative staging, media coordination, and memorable experiences.",
    image: "/corporate-event.jpg",
  },
  {
    category: "Corporate Events",
    title: "Annual Day & Awards",
    description:
      "Celebrate your team's achievements in style. Entertainment, recognition ceremonies, and gala dinners.",
    image: "/corporate-event.jpg",
  },
  {
    category: "Luxury Events",
    title: "Destination Wedding",
    description:
      "Dream destinations, royal celebrations. We plan and execute weddings at exotic locations worldwide.",
    image: "/hero-wedding.jpg",
  },
  {
    category: "Luxury Events",
    title: "Royal Theme Wedding",
    description:
      "Live like royalty on your special day. Palaces, vintage decor, and regal experiences.",
    image: "/hero-wedding.jpg",
  },
  {
    category: "Luxury Events",
    title: "Beach Wedding",
    description:
      "Say 'I do' with the ocean as your backdrop. Romantic beach setups and sunset ceremonies.",
    image: "/hero-wedding.jpg",
  },
];

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices =
    activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

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

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover-lift"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-aira-gold text-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <Button variant="pinkOutline" size="sm" asChild>
                    <Link href="/contact">
                      Enquire Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
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
