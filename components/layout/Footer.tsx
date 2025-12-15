"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

const socialLinks = [
  { icon: Facebook, href: config.companyDetails.social.facebook, label: "Facebook" },
  { icon: Instagram, href: config.companyDetails.social.instagram, label: "Instagram" },
  { icon: Twitter, href: config.companyDetails.social.twitter, label: "Twitter" },
  { icon: Youtube, href: config.companyDetails.social.youtube, label: "Youtube" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Services", path: "/services" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const services = [
  "Wedding Planning",
  "Corporate Events",
  "Birthday Celebrations",
  "Destination Weddings",
  "Anniversary Events",
  "Cultural Celebrations",
];

export function Footer() {
  const openBrochure = (e: any) => {
    e.preventDefault();
    const url = config.brochureUrl;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-3xl font-bold">
                <span className="text-primary-foreground">Aira</span>
                <span className="text-aira-gold"> Events</span>
              </h3>
              <p className="text-sm text-aira-gold tracking-wider mt-1">
                {config.companyDetails.tagline}
              </p>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              We craft unforgettable celebrations that tell your unique story. From intimate
              gatherings to grand weddings, every detail matters.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-aira-gold text-aira-gold hover:bg-aira-gold hover:text-foreground w-fit"
              asChild
            >
              <a
                href={config.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openBrochure}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Brochure
              </a>
            </Button>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-aira-gold hover:text-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="hidden md:block"
          >
            <h4 className="font-display text-xl font-semibold mb-6 text-aira-gold">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-primary-foreground/80 hover:text-aira-gold transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-xl font-semibold mb-6 text-aira-gold">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-primary-foreground/80 hover:text-aira-gold transition-colors duration-200"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display text-xl font-semibold mb-6 text-aira-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-aira-gold flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  {config.companyDetails.office.address}
                  <br />
                  {config.companyDetails.office.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-aira-gold flex-shrink-0" />
                <a
                  href={`tel:${config.companyDetails.contact.phonePrimary.replace(/\s/g, "")}`}
                  className="text-primary-foreground/80 hover:text-aira-gold transition-colors"
                >
                  {config.companyDetails.contact.phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-aira-gold flex-shrink-0" />
                <a
                  href={`mailto:${config.companyDetails.contact.email}`}
                  className="text-primary-foreground/80 hover:text-aira-gold transition-colors"
                >
                  {config.companyDetails.contact.email}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p className="flex items-center gap-1">{config.companyDetails.name} © 2024</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-aira-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-aira-gold transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
