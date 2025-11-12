"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getSession, signOut, getUserRole } from "./_lib/data-service";
import TestimonialsScroll from "@/components/TestimonialsScroll";

const team = [
  { name: "Anna Müller", role: "Senior Stylistin", img: "/team_1.png" },
  { name: "Lukas Schmidt", role: "Color Specialist", img: "/team_2.jpg" },
  { name: "Sophie Weber", role: "Junior Stylistin", img: "/team3.jpg" },
  { name: "Muster Frau", role: "Junior Stylistin", img: "/team1.png" },
  { name: "Muster Frau", role: "Junior Stylistin", img: "/team3.jpg" },
];

const leistung = [
  {
    title: "Haarschnitt",
    desc: "Klassisch, modern oder kreativ – perfekt abgestimmt auf deinen Stil.",
  },
  {
    title: "Styling & Farbe",
    desc: "Professionelle Farbtechniken & Stylings für jeden Anlass.",
  },
  {
    title: "Pflege & Beratung",
    desc: "Exklusive Pflegeprodukte & persönliche Stylingtipps.",
  },
];

const menuItems = [
  { label: "Leistungen", href: "#services" },
  { label: "Über uns", href: "#about" },
  { label: "Unser Team", href: "#team" },
  { label: "Kundenbewertung", href: "#customerReview" },
  { label: "Kontakt", href: "#contact" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [useRoleAdmin, setUserRoleAdmin] = useState<boolean | null>(null);
  const [useRoleCustomer, setUserRoleCustomer] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (!session) {
        setUser(null);
        return;
      }
      setUser(session?.user || null);

      const userRole = await getUserRole(session?.user?.id);
      if (userRole === "admin") {
        setUserRoleAdmin(true);
      } else {
        setUserRoleAdmin(false);
      }
      if (userRole === "customer") {
        setUserRoleCustomer(true);
      } else {
        setUserRoleCustomer(false);
      }
      console.log(userRole);
    }
    fetchSession();
  }, []);

  async function handleSignOut() {
    await signOut();
    setUser(null);
    setUserRoleCustomer(false);
  }

  return (
    <>
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-neutral-200 bg-white/70 backdrop-blur-md fixed top-0 w-full z-50">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="Company Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-lg md:text-2xl font-bold text-amber-600">
            Salon Eleganz
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#services" className="hover:text-amber-600">
            Leistungen
          </Link>
          <Link href="#about" className="hover:text-amber-600">
            Über uns
          </Link>
          <Link href="#team" className="hover:text-amber-600">
            Unser Team
          </Link>
          <Link href="#customerReview" className="hover:text-amber-600">
            Kundenbewertung
          </Link>
          <Link href="#contact" className="hover:text-amber-600">
            Kontakt
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center space-y-1"
        >
          <span className="block w-6 h-0.5 bg-neutral-700"></span>
          <span className="block w-6 h-0.5 bg-neutral-700"></span>
          <span className="block w-6 h-0.5 bg-neutral-700"></span>
        </button>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-2">
          {!user ? (
            <Link href="/login">
              <Button
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                Login
              </Button>
            </Link>
          ) : (
            <div>
              {useRoleAdmin && (
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 ml-2"
                onClick={async () => handleSignOut()}
              >
                Abmelden
              </Button>
            </div>
          )}
          {!user ? (
            <Link href="/register">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Registrieren
              </Button>
            </Link>
          ) : null}
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {menuOpen ? (
        <div className="fixed top-16 left-0 right-0 bg-white border-t border-neutral-200 flex flex-col items-center py-4 md:hidden z-40">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="py-2 text-base font-medium hover:text-amber-600"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-24 md:pt-32 pb-16 gap-12">
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Dein Stil.{" "}
            <span className="text-amber-600">Unsere Leidenschaft.</span>
          </h2>
          <p className="text-neutral-600 text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">
            Willkommen bei <strong>Salon Eleganz</strong> – wo Handwerk, Stil
            und Persönlichkeit zusammenkommen.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/register">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
                  Jetzt registrieren
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 w-full sm:w-auto"
                >
                  Anmelden
                </Button>
              </Link>
            </div>
          )}
          {useRoleCustomer && (
            <Link href="/terminbuchen" className="mt-4 inline-block">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Zum Terminbuchen
              </Button>
            </Link>
          )}
        </motion.div>
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/image.webp"
            alt="Friseursalon"
            width={500}
            height={500}
            loading="eager"
            className="rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-cover"
          />
        </motion.div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 md:py-24 px-6 md:px-20 bg-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
          Unsere Leistungen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leistung.map((s, i) => (
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

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
          Über uns
        </h2>
        <p className="max-w-3xl mx-auto text-neutral-600 text-base md:text-lg">
          Bei <strong>Salon Eleganz</strong> dreht sich alles um dich. Unser
          erfahrenes Team kombiniert handwerkliches Können mit einem Gespür für
          Trends, um deinen individuellen Stil zu unterstreichen.
        </p>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className="py-16 md:py-24 px-6 md:px-20 bg-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
          Unser Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl border border-neutral-200 bg-neutral-100 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="relative aspect-3/4 w-full mb-4">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  quality={75}
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-amber-600">
                {member.name}
              </h3>
              <p className="text-neutral-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customer Review */}
      <TestimonialsScroll />

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 md:py-24 px-6 md:px-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
          Kontakt
        </h2>
        <p className="max-w-3xl mx-auto text-neutral-600 text-base md:text-lg mb-6">
          Hast du Fragen oder möchtest einen Termin vereinbaren? Wir sind für
          dich da!
        </p>
        <div className="space-y-2 text-neutral-600 text-base md:text-lg">
          <p>
            E-Mail:{" "}
            <a
              href="mailto:test@gmail.com"
              className="text-amber-600 hover:underline"
            >
              <strong>test@gmail.com</strong>
            </a>
          </p>
          <p>
            Telefon:{" "}
            <a
              href="tel:+49123456789"
              className="text-amber-600 hover:underline"
            >
              <strong>+49 123 456789</strong>
            </a>
          </p>
          <p>
            Adresse:{" "}
            <span className="text-amber-600 font-semibold">
              Musterstraße 1, 12345 Musterstadt
            </span>
          </p>
          <p>
            Öffnungszeiten:{" "}
            <span className="text-amber-600 font-semibold">
              Mo-Fr: 9:00–18:00 Uhr, Sa: 9:00–14:00 Uhr
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-10 text-center mt-auto">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} Salon Eleganz – Alle Rechte
          vorbehalten.
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 hover:text-white transition"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 hover:text-white transition"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 hover:text-white transition"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 hover:text-white transition"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </footer>
    </>
  );
}
