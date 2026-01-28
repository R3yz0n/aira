"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingCreateSchema, TBookingCreateInput } from "@/domain/booking";
import { useBooking } from "@/hooks/use-booking";
import { config } from "@/lib/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";

const budgetRanges = [
  "Under ₹50,000",
  "Rs50,000 - Rs1,00,000",
  "Rs1,00,000 - Rs2,50,000",
  "Rs2,50,000 - Rs5,00,000",
  "Above Rs5,00,000",
];

export default function Page() {
  // map url form google maps
  const mapEmbedUrl = config.companyDetails.office.mapEmbedUrl;
  const { create } = useBooking();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TBookingCreateInput>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      eventType: "",
      eventDate: undefined,
      budgetRange: "",
      message: "",
    },
  });

  const onSubmit = async (data: TBookingCreateInput) => {
    try {
      await create(data);
      reset();
    } catch (error) {}
  };

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
              Contact Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Let's Create <span className="text-secondary">Magic</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ready to start planning your dream event? Get in touch with us and let's make it
              happen together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions or ready to book? Reach out to us through any of these channels.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Our Office</h4>
                    <p className="text-muted-foreground text-sm">
                      {config.companyDetails.office.address},
                      <br />
                      {config.companyDetails.office.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a
                      href={`tel:${config.companyDetails.contact.phonePrimary.replace(/\s/g, "")}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {config.companyDetails.contact.phonePrimary}
                    </a>
                    {config.companyDetails.contact.phoneSecondary && (
                      <>
                        <br />
                        <a
                          href={`tel:${config.companyDetails.contact.phoneSecondary.replace(
                            /\s/g,
                            "",
                          )}`}
                          className="text-muted-foreground text-sm hover:text-primary transition-colors"
                        >
                          {config.companyDetails.contact.phoneSecondary}
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-aira-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-aira-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a
                      href={`mailto:${config.companyDetails.contact.email}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {config.companyDetails.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Working Hours</h4>
                    <p className="text-muted-foreground text-sm">
                      {config.companyDetails.workingHours.weekdays}
                      <br />
                      {config.companyDetails.workingHours.sunday}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${config.companyDetails.contact.phonePrimary.replace(
                  /[^0-9]/g,
                  "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">Chat on WhatsApp</span>
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-card  rounded-3xl md:p-8 lg:p-12 shadow-card">
                <h2 className="font-display text-2xl font-bold mb-8">Book Your Consultation</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Your name"
                        aria-invalid={errors.fullName ? "true" : "false"}
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 99999 99999"
                        aria-invalid={errors.phone ? "true" : "false"}
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      {...register("email")}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <Input
                        id="eventType"
                        placeholder="Enter event type"
                        aria-invalid={errors.eventType ? "true" : "false"}
                        {...register("eventType")}
                      />
                      {errors.eventType && (
                        <p className="text-sm text-red-600">{errors.eventType.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Set min to tomorrow's date
                        aria-invalid={errors.eventDate ? "true" : "false"}
                        {...register("eventDate")}
                      />
                      {errors.eventDate && (
                        <p className="text-sm text-red-600">{errors.eventDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <select
                      id="budgetRange"
                      className="input ml-3 border-aira-gold/80 border rounded"
                      aria-invalid={errors.budgetRange ? "true" : "false"}
                      {...register("budgetRange")}
                    >
                      <option value="">Select a budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                    {errors.budgetRange && (
                      <p className="text-sm text-red-600">{errors.budgetRange.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell Us About Your Event</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your vision, preferences, or any specific requirements..."
                      rows={4}
                      aria-invalid={errors.message ? "true" : "false"}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {mapEmbedUrl && (
        <section className="h-96">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Aira Events Location"
          />
        </section>
      )}
    </>
  );
}
