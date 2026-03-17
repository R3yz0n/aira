"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

export function CTASection() {
  const primaryPhone = config.companyDetails.contact.phonePrimary || "+919999999999";
  const phoneHref = primaryPhone.startsWith("tel:") ? primaryPhone : `tel:${primaryPhone}`;
  const whatsappPhone = primaryPhone.replace(/\D/g, "");

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-aira-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Create Your <span className="text-aira-gold">Perfect Event?</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">
            Let's start planning your dream celebration together. Our expert team is ready to turn
            your vision into reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">
                Book Free Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button variant="heroOutline" size="xl" asChild>
              <a href={phoneHref}>
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </Button>
          </div>

          <div className="mt-8">
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-aira-gold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Or chat with us on WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
