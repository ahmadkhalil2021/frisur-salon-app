"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import { de } from "date-fns/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAppointments } from "../_lib/data-service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Event {
  title: string;
  start: Date;
  end: Date;
  message: string;
}
interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  message?: string;
  [key: string]: unknown;
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [viewList, setViewList] = useState(false);

  // Modal-State
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments();
      setAppointments(data);
      const events = data.map((appointment) => ({
        title: appointment.name,
        start: new Date(`${appointment.date}T${appointment.time}`),
        end: new Date(
          new Date(`${appointment.date}T${appointment.time}`).getTime() +
            30 * 60 * 1000
        ),
        message: appointment.message,
      }));
      setEvents(events);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-amber-600 mb-4">Terminplanung</h2>
      <div className="flex gap-2">
        <Button onClick={() => setViewList(false)}>Kalender</Button>
        <Button variant="destructive" onClick={() => setViewList(true)}>
          List
        </Button>
      </div>

      {!viewList && (
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
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }}
          />
        </div>
      )}
      {viewList && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Datum</TableHead>
              <TableHead>Uhrzeit</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Nachricht</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {appointment.date}
                </TableCell>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell className="break-all whitespace-normal">
                  {appointment.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-96 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-amber-600">
              {selectedEvent.title}
            </h3>
            <p>
              <strong>Start:</strong>{" "}
              {selectedEvent.start.toLocaleString("de-DE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>
              <strong>Ende:</strong>{" "}
              {selectedEvent.end.toLocaleString("de-DE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p className="mt-3">
              <strong>Nachricht:</strong> <p>{selectedEvent.message}</p>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
