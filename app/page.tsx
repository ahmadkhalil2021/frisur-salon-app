"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getSession, signOut, getUserRole } from "./_lib/data-service";
import TestimonialsScroll from "@/components/pages/TestimonialsScroll";
import Services from "@/components/pages/Services";
import About from "@/components/pages/About";
import Team from "@/components/pages/Team";
import Contact from "@/components/pages/Contact";
import Footer from "@/components/pages/Footer";

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
          <span className="block w-6 h-0.5 bg-neutral-800"></span>
          <span className="block w-6 h-0.5 bg-neutral-800"></span>
          <span className="block w-6 h-0.5 bg-neutral-800"></span>
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
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 mt-4"
            onClick={async () => {
              setMenuOpen(false);
              await handleSignOut();
            }}
          >
            Abmelden
          </Button>
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
              <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
                Zum Terminbuchen
              </Button>
            </Link>
          )}
          {useRoleAdmin && (
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
                Zum Dashboard
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
      <Services />
      {/* About Section */}
      <About />
      {/* Team Section */}
      <Team />
      {/* Customer Review */}
      <TestimonialsScroll />
      {/* Contact Section */}
      <Contact />
      {/* Footer */}
      <Footer />
    </>
  );
}
