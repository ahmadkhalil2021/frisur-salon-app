"use client";

import { motion } from "framer-motion";

const leistungMan = [
  {
    title: "Haarschnitt",
    desc: "Klassisch, modern oder kreativ – perfekt abgestimmt auf deinen Stil.",
  },
  {
    title: "Bartpflege",
    desc: "Präzise Schnitte & Pflege für den perfekten Look.",
  },
  {
    title: "Maschinenhaarschnitt",
    desc: "Schnell, sauber & stylisch – ideal für den Alltag.",
  },
];

const leistungWoman = [
  {
    title: "Trendhaarschnitt",
    desc: "Individuelle Schnitte, die deinen Look unterstreichen.",
  },
  {
    title: "Balayage / Ombré",
    desc: "Natürliche Farbverläufe für ein sonnengeküsstes Aussehen.",
  },
  {
    title: "Strähnen",
    desc: "Exklusive Pflegeprodukte & persönliche Stylingtipps.",
  },
  {
    title: "Dauerwelle",
    desc: "Volumen und Locken, die begeistern.",
  },
  {
    title: "Glanz- & Tönungsservice",
    desc: "Intensive Farberlebnisse mit langanhaltendem Glanz.",
  },
];

const styling_and_events = [
  {
    title: "Brautstyling",
  },
  {
    title: "Abendfrisuren",
  },
  {
    title: "Föhnen & Styling",
  },
  {
    title: "Make-up",
  },
];

const pflege_and_treatments = [
  {
    title: "Olaplex / Plex Treatments",
  },
  {
    title: "Kopfhautbehandlungen",
  },
  {
    title: "Intensive Pflegeprogramme",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-16 md:py-24 px-6 md:px-20 bg-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
        Unsere Leistungen
      </h2>
      <h3 className="text-2xl font-semibold mb-6 text-amber-600">Damen</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {leistungWoman.map((s, i) => (
          <motion.div
            key={i}
            className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-amber-600">
              {s.title}
            </h3>
            <p className="text-neutral-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <h3 className="text-2xl font-semibold mb-6 text-amber-600 mt-6">
        Herren
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {leistungMan.map((s, i) => (
          <motion.div
            key={i}
            className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-amber-600">
              {s.title}
            </h3>
            <p className="text-neutral-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
