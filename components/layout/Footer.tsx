"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCategory } from "@/hooks/use-category";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Facebook,
  FileText,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

type BrochureItem = {
  title: string;
  href: string;
  previewUrl: string | null;
};

const getGoogleDriveFileId = (url: string) => {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const getPreviewUrl = (url: string) => {
  const fileId = getGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  if (url.toLowerCase().includes(".pdf")) {
    return url;
  }

  return null;
};

const brochureLinks: BrochureItem[] = [
  {
    title: "Aira Events Brochure",
    href: config.brochureUrl,
  },
  {
    title: "Bride Side Decor",
    href: "https://drive.google.com/file/d/1j0rwOuw4AbTPREM3pmcjd6DV5FOJbIjy/view?usp=sharing",
  },
  {
    title: "Janti",
    href: "https://drive.google.com/file/d/1W-5dCfxyL91DQuHBmC7Sd_1QES_-2MNn/view?usp=sharing",
  },
  {
    title: "Mendhi",
    href: "https://drive.google.com/file/d/1stTl5zQjyPR9JR1LAPOCepJIEZuTkAh1/view?usp=sharing",
  },
  {
    title: "Reception",
    href: "https://drive.google.com/file/d/10mg65hnWoXkRXqBr8yXPv_rcBv3zY6hg/view?usp=sharing",
  },
  {
    title: "Wedding",
    href: "https://drive.google.com/file/d/1iN5HwtJAx2aHoaBRAUAIt9fT6y5LVjHt/view?usp=sharing",
  },
]
  .filter((item): item is { title: string; href: string } => Boolean(item.href))
  .map((item) => ({
    ...item,
    previewUrl: getPreviewUrl(item.href),
  }));

type BrochureDialogProps = {
  triggerLabel: string;
  triggerClassName?: string;
};

function BrochureDialog({ triggerLabel, triggerClassName }: BrochureDialogProps) {
  const [activeBrochure, setActiveBrochure] = useState<BrochureItem | null>(null);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setActiveBrochure(null);
          return;
        }

        const firstPreviewable = brochureLinks.find((item) => Boolean(item.previewUrl));
        setActiveBrochure(firstPreviewable ?? brochureLinks[0] ?? null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className={triggerClassName}>
          <FileText className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Brochures</DialogTitle>
          <DialogDescription>
            Pick a brochure and preview it here, or open it in a new tab.
          </DialogDescription>
        </DialogHeader>

        {brochureLinks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-[280px_1fr]">
            <div className="space-y-2">
              {brochureLinks.map((brochure) => {
                const isActive = activeBrochure?.href === brochure.href;

                return (
                  <button
                    key={brochure.title}
                    type="button"
                    onClick={() => setActiveBrochure(brochure)}
                    className={cn(
                      "w-full rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                    )}
                  >
                    <p className="font-medium">{brochure.title}</p>
                    <a
                      href={brochure.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open link
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </button>
                );
              })}
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-2">
              {activeBrochure?.previewUrl ? (
                <iframe
                  title={`${activeBrochure.title} preview`}
                  src={activeBrochure.previewUrl}
                  className="h-[55vh] w-full rounded-md bg-background"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-[55vh] items-center justify-center rounded-md bg-background p-6 text-center text-sm text-muted-foreground">
                  Preview is not available for this link. Use "Open link" to view it in a new tab.
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No brochures are available right now.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  const { list: categoryList, categories } = useCategory();

  useEffect(() => {
    categoryList();
  }, [categoryList]);

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
            <BrochureDialog
              triggerLabel="Download Brochure"
              triggerClassName="border-aira-gold text-aira-gold hover:bg-aira-gold hover:text-foreground w-fit"
            />
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              {categories.length > 0 &&
                categories?.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <Link
                      href="/services"
                      className="text-primary-foreground/80 hover:text-aira-gold transition-colors duration-200"
                    >
                      {service.name}
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
