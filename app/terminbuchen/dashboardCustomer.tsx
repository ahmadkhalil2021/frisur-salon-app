"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createAppointment,
  getSession,
  getUserProfile,
} from "../_lib/data-service";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const generateTimeSlots = () => {
  const times = [];
  for (let h = 8; h <= 16; h++) {
    times.push(`${h.toString().padStart(2, "0")}:00`);
    times.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return times;
};

export default function TermInBuchenPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    date: "",
    time: "",
    message: "",
  });
  const [session, setSession] = useState<Session | null>(null);

  const [error, setError] = useState("");
  // Generiere Zeit-Slots von 08:00 bis 17:30
  const timeSlots = generateTimeSlots();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBuchAnAppointment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (session) {
      const name = await getUserProfile(session.user.id);
      const newAppointment = {
        ...formData,
        userId: session.user.id,
        name: name?.name || "Unbekannt",
      };
      if (newAppointment.message === "") {
        newAppointment.message = "keine Nachricht";
      }
      const data = await createAppointment(newAppointment);
      if (data) {
        setError(data);
        return;
      }
      console.log(data);
      setFormData({
        phone: "",
        date: "",
        time: "",
        message: "",
      });
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      console.log(session);
      const userSession = await getSession();
      setSession(userSession);
      if (!userSession) {
        router.push("/");
      }
    };
    fetchSession();
  }, [router]);

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-50">
      <h1 className="text-3xl font-bold mb-6 text-amber-600 text-center">
        Termin buchen
      </h1>

      <form className="space-y-4" onSubmit={handleBuchAnAppointment}>
        <div>
          <label className="block mb-1 font-medium">Telefon*</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Datum*</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Uhrzeit*</label>
            <select
              name="time"
              required
              value={formData.time}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
              onChange={handleChange}
            >
              <option value="">-- Bitte wählen --</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nachricht</label>
          <textarea
            name="message"
            value={formData.message}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>
        )}

        <Button
          type="submit"
          className="bg-amber-600 text-white hover:bg-amber-700 w-full font-semibold"
        >
          Termin buchen
        </Button>
      </form>
    </div>
  );
}
