"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import { de } from "date-fns/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAppointments } from "../_lib/data-service";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const locales = de;
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function Appointments() {
  const [events, setEvents] = useState<Event[]>([]);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments();
      const events = data.map((appointment) => ({
        title: appointment.name,
        start: new Date(`${appointment.date}T${appointment.time}`),
        end: new Date(
          new Date(`${appointment.date}T${appointment.time}`).getTime() +
            30 * 60 * 1000
        ),
      }));
      setEvents(events);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-amber-600 mb-4">Terminplanung</h2>
      <div className="w-full h-[600px] md:h-[800px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          culture="de"
          views={["month", "week", "day"]}
          view={currentView}
          onView={(view) => setCurrentView(view)}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
        />
      </div>
    </div>
  );
}
