"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAllUsers, signOut } from "../_lib/data-service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Appointment from "./Appointments";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

type Tab = "overview" | "customers" | "appointments" | "reports";

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
            {activeTab === "customers" && <Customers />}
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
    { label: "Kundenverwaltung", value: "customers" },
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

type Customer = {
  id_number: any;
  name: any;
  role: any;
  email: any;
};

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await getAllUsers();
      if (response) {
        setCustomers(response);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-600 mb-3">
        Kundenverwaltung
      </h2>

      <div className="border-b-2 border-amber-600 pb-2 mb-10"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card
            key={customer.id_number}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <p className="text-sm text-neutral-600">{customer.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Editieren</DropdownMenuItem>
                    <DropdownMenuItem>Profil blockieren</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
          </Card>
        ))}
      </div>
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
