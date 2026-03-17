"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openBrochure = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = config.brochureUrl;
    // open in a new tab/window
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          height={600}
          src={isMobile ? "/featured-event-mobile.jpeg" : "/featured-event.jpeg"}
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
              200+ Events Successfully Planned
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            From Nepal to <span className="text-aira-gold"> Dream </span> Destinations
          </motion.h1>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-justify text-primary-foreground/80 mb-8 leading-relaxed"
          >
            <p className="text-aira-gold mb-1 font-semibold">
              {" "}
              We Craft Timeless Celebrations since 2072.
            </p>{" "}
            Aira Events has been designing unforgettable weddings and events across Nepal and
            beyond. From intimate ceremonies to luxury destination weddings, we turn your vision
            into a flawless experience.
          </motion.div>

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

            {/* <Button variant="heroOutline" size="xl" asChild>
              <a
                href={config.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openBrochure}
              >
                <FileText className="w-5 h-5" />
                View Brochure
              </a>
            </Button> */}

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
              <span className="font-semibold text-primary-foreground">100+ Happy Customers</span>
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
