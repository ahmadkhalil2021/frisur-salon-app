"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut } from "../_lib/data-service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Appointment from "./Appointments";

type Tab = "overview" | "users" | "appointments" | "reports";

export default function DashboardAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 p-6 fixed h-full">
        <Logo />
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <Button
          className="mt-auto bg-red-600 text-white hover:bg-red-700"
          onClick={handleSignOut}
        >
          Abmelden
        </Button>
      </aside>

      {/* Mobile Topbar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 flex items-center justify-between p-4 md:hidden z-40">
        <Logo />
        <div className="flex items-center gap-2">
          <Button
            className="bg-amber-600 text-white hover:bg-amber-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Menü
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 md:hidden">
          <aside className="w-64 bg-white h-full p-6">
            <SidebarNav
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
            />
            <Button
              className="mt-auto bg-red-600 text-white hover:bg-red-700"
              onClick={handleSignOut}
            >
              Abmelden
            </Button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 mt-32 md:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "overview" && <Overview />}
            {activeTab === "appointments" && <Appointments />}
            {activeTab === "users" && <Users />}
            {activeTab === "reports" && <Reports />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* --- Components --- */
function Logo() {
  return (
    <div className="flex items-center gap-2 mb-10">
      <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
      <h1 className="text-lg font-bold text-amber-600">Salon Eleganz</h1>
    </div>
  );
}

function SidebarNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: Tab) => void;
}) {
  const tabs: { label: string; value: Tab }[] = [
    { label: "Übersicht", value: "overview" },
    { label: "Terminplanung", value: "appointments" },
    { label: "Benutzerverwaltung", value: "users" },
    { label: "Berichte & Analysen", value: "reports" },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => setActiveTab(tab.value)}
          className={`text-left px-3 py-2 rounded-md font-medium transition-colors ${
            activeTab === tab.value
              ? "bg-amber-100 text-amber-700"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

/* --- Content Components --- */
function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-600 mb-4">
        Dashboard Übersicht
      </h2>
      <p>Hier siehst du eine Zusammenfassung der wichtigsten Infos.</p>
    </div>
  );
}

function Users() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-600 mb-4">
        Benutzerverwaltung
      </h2>
      <p>Verwalten Sie Benutzerkonten, Rollen und Berechtigungen.</p>
    </div>
  );
}

function Appointments() {
  return <Appointment />;
}

function Reports() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-600 mb-4">
        Berichte & Analysen
      </h2>
      <p>Sehen Sie sich Leistungsberichte und Analysen an.</p>
    </div>
  );
}
