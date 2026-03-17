"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Target, Eye, Users, Award, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "We pour our hearts into every celebration we create.",
  },
  {
    icon: Sparkles,
    title: "Creativity",
    description: "Unique ideas that make your event truly one-of-a-kind.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work closely with you to bring your vision to life.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Uncompromising quality in every detail, every time.",
  },
];

const team = [
  {
    name: "Sneha Agarwal",
    role: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
  },
  {
    name: "Rohan Mehta",
    role: "Operations Head",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
  {
    name: "Priya Sharma",
    role: "Design Lead",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  },
  {
    name: "Amit Patel",
    role: "Vendor Relations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
  },
];

export default function Page() {
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
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Crafting <span className="text-secondary">Memories</span> Since 2072
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Aira Events is more than an event planning company — we're your partners in creating
              moments that last a lifetime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/sangeet-event.jpg" alt="Our Story" className="rounded-3xl shadow-card" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-aira-gold font-medium tracking-wider uppercase text-sm">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                A Journey of <span className="text-primary">Passion</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-justify">
                <p> Aira Events – Crafting Unforgettable Experiences Since 2072 </p>
                <p>
                  At Aira Events, we don’t just plan events — we create timeless experiences that
                  leave lasting impressions. Established on 3rd Baisakh, 2072 (B.S.), our company is
                  built on a strong foundation of creativity, dedication, and excellence, backed by
                  a team with over 10+ years of experience in event management.
                </p>{" "}
                <p>
                  {" "}
                  Led by visionary leaders, <b> Richa Karki</b> (Co-Founder & Managing Director) and
                  <b> Adnan Siddique</b> (Founder & CEO), Aira Events reflects a perfect blend of
                  passion and professionalism. Their leadership drives innovation and ensures that
                  every event is executed with precision and style.
                </p>{" "}
                <p>
                  From luxurious weddings to corporate events and personalized celebrations, we
                  specialize in turning your ideas into extraordinary realities. Our commitment is
                  simple to deliver elegance, creativity, and flawless execution in every event.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 shadow-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create unforgettable celebrations that reflect the unique personality and dreams
                of our clients. We strive to exceed expectations through creativity, precision, and
                heartfelt service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-3xl p-8 shadow-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be Nepal's most loved event planning company, known for turning dreams into
                reality and creating moments that families cherish for generations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-aira-gold font-medium tracking-wider uppercase text-sm">
              Our Values
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
              What We <span className="text-gradient">Stand For</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-aira-gold/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-aira-gold" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-aira-gold font-medium tracking-wider uppercase text-sm">
              Our Team
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 text-primary-foreground">
              Meet the Dreamers
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-aira-gold"
                />
                <h3 className="font-display text-lg font-bold text-primary-foreground">
                  {member.name}
                </h3>
                <p className="text-primary-foreground/70">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Start <span className="text-secondary">Planning?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Let's create something beautiful together.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
