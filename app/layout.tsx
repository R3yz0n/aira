import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import { config } from "@/lib/config";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const title =
  config.companyDetails.name && config.companyDetails.tagline
    ? `${config.companyDetails.name} - ${config.companyDetails.tagline}`
    : "Aira Events - Create the Memory Lane";

export const metadata: Metadata = {
  title,
  description:
    "We craft unforgettable celebrations that tell your unique story. From intimate gatherings to grand weddings, every detail matters.",
  keywords: [
    "wedding planner",
    "event management",
    "corporate events",
    "birthday celebrations",
    "destination weddings",
    "Mumbai events",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <Providers>
          <ScrollToTop />
          <AppChrome>{children}</AppChrome>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
