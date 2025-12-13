"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Wedding Events",
    description:
      "From engagement to reception, we craft every moment of your wedding journey with elegance and precision.",
    image: "/hero-wedding.jpg",
    link: "/services",
  },
  {
    title: "Corporate Events",
    description:
      "Professional conferences, product launches, and annual celebrations that leave a lasting impression.",
    image: "/corporate-event.jpg",
    link: "/services",
  },
  {
    title: "Birthday & Social",
    description:
      "Celebrate life's milestones with unique themes, stunning decorations, and unforgettable experiences.",
    image: "/birthday-event.jpg",
    link: "/services",
  },
  {
    title: "Sangeet & Mehendi",
    description:
      "Colorful pre-wedding celebrations filled with music, dance, and traditional charm.",
    image: "/sangeet-event.jpg",
    link: "/services",
  },
];

export function ServicesPreview() {
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
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-card hover-lift">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-aira-gold font-medium text-sm hover:gap-3 transition-all"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
