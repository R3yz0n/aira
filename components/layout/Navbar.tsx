"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-soft" : "bg-transparent",
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold">
                <span className="text-primary">Aira</span>
                <span className="text-secondary"> Events</span>
              </span>
              <span className="text-xs text-aira-gold tracking-wider">
                {config.companyDetails.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "relative font-medium transition-colors duration-200",
                  pathname === link.path ? "text-primary" : "text-foreground/80 hover:text-primary",
                )}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-aira-gold"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${config.companyDetails.contact.phonePrimary.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{config.companyDetails.contact.phonePrimary}</span>
            </a>
            <BrochureDialog triggerLabel="Brochure" />
            <Button variant="hero" size="lg" asChild>
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.path}
                    className={cn(
                      "block py-2 font-medium transition-colors",
                      pathname === link.path ? "text-primary" : "text-foreground/80",
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <BrochureDialog triggerLabel="View Brochure" triggerClassName="mt-4" />
              <Button variant="hero" size="lg" asChild>
                <Link href="/contact">Book Consultation</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
