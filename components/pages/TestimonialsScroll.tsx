"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Maria L.",
    text: "Super freundliches Team! Mein Haarschnitt war perfekt, ich komme auf jeden Fall wieder.",
    rating: 5,
  },
  {
    name: "Jonas P.",
    text: "Sehr professionell und gemütliche Atmosphäre. Kann ich nur empfehlen!",
    rating: 5,
  },
  {
    name: "Aylin K.",
    text: "Toller Service, schnell und zuverlässig. Die Stylistin hat genau verstanden, was ich wollte.",
    rating: 4,
  },
  {
    name: "Luca T.",
    text: "Sauberer Salon, sehr nettes Personal. Preis-Leistung top!",
    rating: 5,
  },
  {
    name: "Luca T.",
    text: "Sauberer Salon, sehr nettes Personal. Preis-Leistung top!",
    rating: 5,
  },
  {
    name: "Aylin K.",
    text: "Toller Service, schnell und zuverlässig. Die Stylistin hat genau verstanden, was ich wollte.",
    rating: 4,
  },
  {
    name: "Maria L.",
    text: "Super freundliches Team! Mein Haarschnitt war perfekt, ich komme auf jeden Fall wieder.",
    rating: 5,
  },
  {
    name: "Jonas P.",
    text: "Sehr professionell und gemütliche Atmosphäre. Kann ich nur empfehlen!",
    rating: 5,
  },
];

export default function TestimonialsScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 350; // Scrollweite pro Klick
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="py-20 bg-neutral-50 relative overflow-hidden"
      id="customerReview"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Überschrift */}
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-10 text-amber-600 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Kundenbewertungen
        </motion.h2>

        {/* Pfeile */}
        <div className="absolute left-2 sm:left-10 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => scroll("left")}
            className="p-3 bg-white shadow-md rounded-full hover:bg-amber-100 transition"
            aria-label="Nach links scrollen"
          >
            <ChevronLeft className="w-5 h-5 text-amber-600" />
          </button>
        </div>
        <div className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => scroll("right")}
            className="p-3 bg-white shadow-md rounded-full hover:bg-amber-100 transition"
            aria-label="Nach rechts scrollen"
          >
            <ChevronRight className="w-5 h-5 text-amber-600" />
          </button>
        </div>

        {/* Scroll Container */}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar scroll-smooth"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              className="snap-start shrink-0 w-[300px] sm:w-[350px] bg-white border border-neutral-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex mb-3 text-amber-500">
                {[...Array(item.rating)].map((_, idx) => (
                  <Star key={idx} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-neutral-700 italic mb-4">“{item.text}”</p>
              <h4 className="font-semibold text-neutral-900">— {item.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
