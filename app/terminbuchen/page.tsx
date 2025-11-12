"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getSession, getUserRole, signOut } from "../_lib/data-service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TermInBuchenPage from "./dashboardCustomer";
import CustomerAppointments from "./overview";

type Tab = "overview" | "appointments";

export default function DashboardCustomer() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/");
        return;
      }
      const userType = getUserRole(session?.user?.id);
      const userIsCustomer = (await userType) === "customer";
      const userIsAdmin = (await userType) === "admin";
      if (session && userIsCustomer) {
        setLoading(false);
        return;
      }
      if (session && userIsAdmin) {
        setLoading(false);
        return;
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:flex flex-col fixed h-full">
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
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between md:hidden z-50">
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
      <main className="flex-1 p-6 mt-16 md:mt-0 md:ml-64 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "overview" && <Overview />}
            {activeTab === "appointments" && <TermInBuchenPage />}
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
    { label: "Terminbuchung", value: "appointments" },
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
      <h2 className="text-2xl font-bold text-amber-600 mb-4">Deine Termine</h2>
      <CustomerAppointments />
    </div>
  );
}
