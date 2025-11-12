"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createAppointment,
  getAppointmentsByDate,
  getSession,
  getUserProfile,
} from "../_lib/data-service";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

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
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Lokale Kopie der Slots
    const slots = generateTimeSlots();

    // Wenn das Datum geändert wurde
    if (name === "date") {
      const now = new Date();
      const selectedDate = new Date(`${value}T00:00:00`);
      const day = selectedDate.getDay();

      // Wochenende ignorieren
      if (day === 0 || day === 6) {
        setTimeSlots([]);
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("Datum liegt am Wochenende");
        return;
      }

      // FormData updaten
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Gebuchte Termine für das Datum abrufen
      const datas = await getAppointmentsByDate(value);

      // Gebuchte Zeiten auf HH:MM kürzen
      const bookedTimes = datas
        ?.filter((d) => d.date === value)
        .map((d) => d.time.slice(0, 5));

      // Buchungen entfernen
      let availableSlots = slots.filter((slot) => !bookedTimes?.includes(slot));

      // Abgelaufene Zeiten entfernen, falls Datum heute
      const todayStr = now.toISOString().slice(0, 10);
      if (value === todayStr) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        availableSlots = availableSlots.filter((slot) => {
          const [h, m] = slot.split(":").map(Number);
          return h * 60 + m > currentMinutes;
        });
      }
      console.log(availableSlots === null);
      if (availableSlots.length === 0) {
        setError("keine Termine vorhanden für den ausgewählten Tag!");
        setTimeSlots(availableSlots);
        return;
      }
      setError("");
      // State setzen
      setTimeSlots(availableSlots);
      return;
    }
    // Für andere Inputs FormData updaten
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData({
        phone: "",
        date: "",
        time: "",
        message: "",
      });
      toast("Termin erfolgreich erstellt.", {
        description: newAppointment.date + " um " + newAppointment.time,
      });
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
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
        {error ? (
          <>
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
            <Button
              type="submit"
              className="bg-amber-600 text-white hover:bg-amber-700 w-full font-semibold"
              disabled
            >
              Termin buchen
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            className="bg-amber-600 text-white hover:bg-amber-700 w-full font-semibold"
          >
            Termin buchen
          </Button>
        )}
      </form>
    </div>
  );
}
