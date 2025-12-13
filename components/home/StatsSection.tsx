"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Calendar, Heart, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: 500,
    suffix: "+",
    label: "Events Planned",
    color: "text-aira-gold",
  },
  {
    icon: Heart,
    value: 200,
    suffix: "+",
    label: "Weddings Celebrated",
    color: "text-secondary",
  },
  {
    icon: Users,
    value: 50,
    suffix: "+",
    label: "Corporate Clients",
    color: "text-primary",
  },
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Years Experience",
    color: "text-aira-gold",
  },
];

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20" style={{ backgroundColor: "#f7f3ee" }}>
      <div className="container mx-auto px-4 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background/70 shadow-sm mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
              </div>
              <p className="text-foreground/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
