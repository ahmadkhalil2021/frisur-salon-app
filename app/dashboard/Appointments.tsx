"use client";

import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { parse, startOfWeek, getDay, format, set } from "date-fns";
import { de } from "date-fns/locale/de";
import {
  createAppointment,
  deleteAppointment,
  getAllUsers,
  getAppointments,
  getUserId,
} from "../_lib/data-service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { se } from "date-fns/locale";

const generateTimeSlots = () => {
  const times = [];
  for (let h = 8; h <= 16; h++) {
    times.push(`${h.toString().padStart(2, "0")}:00`);
    times.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return times;
};

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

interface User {
  id: any;
  name: any;
  role: any;
  email: any;
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
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [viewList, setViewList] = useState(false);

  // Modal-State
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { showToast } = useToast();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [formData, setFormData] = useState({
    userId: "",
    Kundenname: "",
    date: "",
    time: "",
    message: "",
  });

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments();
      const allDataUsers = await getAllUsers();
      const users = (allDataUsers || [])
        .filter((user: any) => user.role === "customer")
        .map((user: any) => ({
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
        }));
      setAllUsers(users);
      setAppointments(data);
      const events = data.map((appointment) => ({
        title: appointment.name,
        start: new Date(`${appointment.date}T${appointment.time}`),
        end: new Date(
          new Date(`${appointment.date}T${appointment.time}`).getTime() +
            30 * 60 * 1000,
        ),
        message: appointment.message,
      }));
      setEvents(events);
    };
    fetchAppointments();
  }, []);

  function normalizeTime(t: string) {
    return t.trim().slice(0, 5); // "09:00"
  }

  function normalizeDate(d: string) {
    return new Date(d).toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  const handleOpenShareDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowShareDialog(true);
    console.log(appointment);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleChangeDate = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const date = new Date(`${e.target.value}T${"00:00:00"}`);
    const day = date.getDay();
    if (day === 0 || day === 6) return true;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleChangeUser = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const allDataUsers = await getAllUsers();
    const customer = (allDataUsers || []).find(
      (user) => user.name === e.target.value,
    );
    const customerId = customer ? (customer.id_number ?? "") : "";

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      userId: customerId,
    });
    console.log(formData);
  };

  const handleCreateAnAppointment = async () => {
    if (
      formData.Kundenname === "" ||
      formData.date === "" ||
      formData.time === ""
    ) {
      showToast({
        title: "Fehler",
        message: "Bitte füllen Sie alle Pflichtfelder aus.",
        type: "error",
      });
      return;
    }
    // Implement create functionality here
    const customerID = await getUserId(formData.Kundenname);
    const newAppointment = {
      userId: customerID ? customerID : "",
      name: formData.Kundenname,
      date: formData.date,
      time: formData.time,
      message: formData.message,
    };
    const getAllAppointments = await getAppointments();
    const isTimeSlotTaken = getAllAppointments.some((appointment) => {
      return (
        normalizeDate(appointment.date) ===
          normalizeDate(newAppointment.date) &&
        normalizeTime(appointment.time) === normalizeTime(newAppointment.time)
      );
    });

    if (isTimeSlotTaken) {
      showToast({
        title: "Fehler",
        message: "Dieser Termin ist bereits vergeben.",
        type: "error",
      });
      return;
    }
    // Call API to create appointment
    const createdAppointment = await createAppointment(newAppointment);

    if (createdAppointment) {
      showToast({
        title: "Termin erfolgreich erstellt.",
        message: "",
        type: "success",
      });
    }
    handleOpenCalender();
    setFormData({
      userId: "",
      Kundenname: "",
      date: "",
      time: "",
      message: "",
    });
    setShowCreateDialog(false);
  };

  const handleDeleteAppointment = async () => {
    // Implement delete functionality here
    if (selectedAppointment) {
      await deleteAppointment(selectedAppointment?.id);
      setAppointments((prev) =>
        prev.filter(
          (appointment) => appointment.id !== selectedAppointment?.id,
        ),
      );
      setShowShareDialog(false);
      const deletedAppointment =
        selectedAppointment.date + " um " + selectedAppointment.time;

      showToast({
        title: "Termin erfolgreich gelöscht.",
        message: deletedAppointment,
        type: "success",
      });
    }
  };

  const handleOpenCalender = async () => {
    const data = await getAppointments();
    setAppointments(data);
    const events = data.map((appointment) => ({
      title: appointment.name,
      start: new Date(`${appointment.date}T${appointment.time}`),
      end: new Date(
        new Date(`${appointment.date}T${appointment.time}`).getTime() +
          30 * 60 * 1000,
      ),
      message: appointment.message,
    }));
    setEvents(events);
    setViewList(false);
  };

  const handleCloseCreateDialog = () => {
    setFormData({
      userId: "",
      Kundenname: "",
      date: "",
      time: "",
      message: "",
    });
    setShowCreateDialog(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-amber-600 mb-4">Terminplanung</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
          Erstellen
        </Button>
        <Button onClick={handleOpenCalender}>Kalender</Button>
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
              <TableHead>Aktion</TableHead>
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
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleOpenShareDialog(appointment)}
                  >
                    Löschen
                  </Button>
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
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex justify-between items-start">
            <DialogTitle>Termin löschen</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Bist du sicher, dass du den Termin löschen willst?
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button type="submit" onClick={handleDeleteAppointment}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>neue Termin erstellen</DialogTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Kundenname*</label>
                <select
                  name="Kundenname"
                  required
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  onChange={handleChangeUser}
                >
                  <option value="">-- Bitte wählen --</option>
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Datum*</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  onChange={handleChangeDate}
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

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Nachricht</label>
                <textarea
                  name="message"
                  value={formData.message}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCloseCreateDialog}>
                Abbrechen
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleCreateAnAppointment}>
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
