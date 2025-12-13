"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          height={600}
          src="/hero-wedding.jpg"
          alt="Luxury wedding venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-aira-gold/20 backdrop-blur-sm border border-aira-gold/30 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-aira-gold fill-aira-gold" />
            <span className="text-sm font-medium text-primary-foreground">
              500+ Events Successfully Planned
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Crafting <span className="text-aira-gold">Timeless</span> Celebrations
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed"
          >
            From intimate gatherings to grand celebrations, we transform your dreams into
            unforgettable memories. Let us plan your perfect event.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button variant="heroOutline" size="xl" asChild>
              <Link href="/gallery">
                <Play className="w-5 h-5" />
                View Our Work
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 mt-12"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-aira-gold/80 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground"
                >
                  {i === 4 ? "50+" : `C${i}`}
                </div>
              ))}
            </div>
            <div className="text-primary-foreground/80 text-sm">
              <span className="font-semibold text-primary-foreground">200+ Happy Couples</span>
              <br />
              Trusted their special day with us
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -bottom-20 w-64 h-64 border border-aira-gold/20 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -right-10 -bottom-10 w-48 h-48 border border-aira-gold/10 rounded-full hidden lg:block"
      />
    </section>
  );
}
