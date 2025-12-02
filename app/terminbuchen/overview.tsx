import { useEffect, useState } from "react";
import {
  deleteAppointment,
  editAppointment,
  getAppointmentsByUserId,
  getSession,
} from "../_lib/data-service";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const generateTimeSlots = () => {
  const times = [];
  for (let h = 8; h <= 16; h++) {
    times.push(`${h.toString().padStart(2, "0")}:00`);
    times.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return times;
};

interface Appointment {
  id: string;
  date: string;
  time: string;
  message?: string;
  [key: string]: unknown;
}

export default function CustomerAppointments() {
  const [dataAppointments, setDataAppointments] = useState<Appointment[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  // Generiere Zeit-Slots von 08:00 bis 17:30
  const timeSlots = generateTimeSlots();
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    time: "",
    message: "",
  });

  useEffect(() => {
    const getAppointments = async () => {
      const userSession = await getSession();
      const data = await getAppointmentsByUserId(userSession?.user.id);
      if (data) {
        const now = new Date();

        const dataWithDisabled = data.map((appointment: Appointment) => {
          // Datum + Zeit kombinieren
          const appointmentDateTime = new Date(
            `${appointment.date}T${appointment.time}`
          );

          // Differenz in Millisekunden
          const diffMs = appointmentDateTime.getTime() - now.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);

          // disabled, wenn vorbei oder weniger als 24h entfernt
          const isDisabled = diffHours < 24;

          return {
            ...appointment,
            disabled: isDisabled,
          };
        });

        dataWithDisabled.sort((a, b) => {
          // disabled hinten
          if (a.disabled && !b.disabled) return 1;
          if (!a.disabled && b.disabled) return -1;

          // beide disabled gleich → nach Datum/Uhrzeit sortieren
          const dateTimeA = new Date(`${a.date}T${a.time}`);
          const dateTimeB = new Date(`${b.date}T${b.time}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });
        setDataAppointments(dataWithDisabled);
      }
    };
    getAppointments();
  }, []);

  const handleDeleteAppointment = async () => {
    // Implement delete functionality here
    if (selectedAppointment) {
      await deleteAppointment(selectedAppointment?.id);
      setDataAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== selectedAppointment?.id)
      );
      setShowShareDialog(false);
      const deletedAppointment =
        selectedAppointment.date + " um " + selectedAppointment.time;
      toast("Termin erfolgreich gelöscht.", {
        description: deletedAppointment,
      });
    }
  };

  const handleEditAppointment = async () => {
    // Implement Edit functionality here
    console.log(formData);
    if (formData.date === "" || formData.time === "") {
      toast("Keine Daten. eingegeben!");
    }
    if (selectedAppointment) {
      const now = new Date();
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      // Differenz in Millisekunden
      const diffMs = appointmentDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const date_cannot_changed = diffHours < 24;
      if (date_cannot_changed) {
        toast(
          "Termin liegt in der Vergangenheit oder nach 24 stunden von jetzt.",
          {
            description:
              selectedAppointment.date + " um " + selectedAppointment.time,
          }
        );
        return;
      }
      const data = await editAppointment(
        selectedAppointment,
        formData.date,
        formData.time,
        formData.message ? formData.message : null
      );
      if (data) {
        setDataAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === selectedAppointment.id
              ? {
                  ...appointment,
                  date: formData.date,
                  time: formData.time,
                  message: formData.message,
                }
              : appointment
          )
        );
        toast("Termin erfolgreich geändert.", {
          description:
            selectedAppointment.date + " um " + selectedAppointment.time,
        });
        setShowNewDialog(false);
      } else {
        toast("Termin konnte nicht geändert werden.");
        setShowNewDialog(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    >
  ) => {
    const date = new Date(`${e.target.value}T${"00:00:00"}`);
    const day = date.getDay();
    console.log(day);
    if (day === 0 || day === 6) return true;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleClose = () => {
    setFormData({
      id: "",
      date: "",
      time: "",
      message: "",
    });
  };

  return (
    <>
      <Table>
        <TableCaption>
          Termine können vor 24 Stunden nicht geändert oder gelöscht werden.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Datum</TableHead>
            <TableHead>Uhrzeit</TableHead>
            <TableHead>Nachricht</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell className="break-all whitespace-normal">
                {appointment.message}
              </TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    {appointment.disabled ? (
                      <Button
                        variant="outline"
                        aria-label="Open menu"
                        size="icon-sm"
                        disabled
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        aria-label="Open menu"
                        size="icon-sm"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedAppointment(appointment);
                          setShowNewDialog(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedAppointment(appointment);
                          setShowShareDialog(true);
                        }}
                      >
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog für Löschen */}
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
              <Button variant="outline" onClick={handleClose}>
                Abbrechen
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleDeleteAppointment}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog für Editieren */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>Termin ändern</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du den Termin ändern willst?
            </DialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button variant="outline" onClick={handleClose}>
                Abbrechen
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleEditAppointment}>
              Ändern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
