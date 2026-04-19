import { supabase } from "./superbase.js";

export async function signUp(email, password) {
  let { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
  return data;
}
export async function updateUserName(userId, userName) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ name: userName })
    .eq("id", userId)
    .select();

  console.log("Update User Name Data:", data);
  if (error) {
    throw error;
  }
  return data;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  console.log("Session Data:", data);
  if (error) {
    throw error;
  }
  return data.session;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("Sign In Data:", data);
  if (error) {
    throw error;
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userId)
    .maybeSingle();

  console.log("Profil Daten:", data);
  if (error) {
    console.error("Profil Fehler:", error);
    return null;
  }

  return data;
};

export async function getUserId(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("name", username)
    .maybeSingle();
  console.log("User ID Daten:", data);
  if (error) {
    throw error;
  }
  return data?.id || null;
}

export async function getAllUsers() {
  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("id_number, name, role, email");

  console.log("Alle Profile Daten:", profiles);
  if (error) {
    throw error;
  }
  return profiles;
}

export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  console.log("Rolle Daten:", data);
  if (error) {
    throw error;
  }
  return data?.role || null;
}

export async function getAppointments() {
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function getAppointmentsByUserId(useId) {
  let { data: appointments, error } = await supabase
    .from("appointments")
    .select("id, created_at, date, message, time")
    // Filters
    .eq("userId", useId);
  console.log("Termine nach User ID Daten:", appointments);
  if (error) {
    throw error;
  }
  return appointments;
}

export async function getAppointmentsByDate(date) {
  let { data: appointments, error } = await supabase
    .from("appointments")
    .select("id, date, message, time")
    // Filters
    .eq("date", date);

  console.log("Termine nach Datum Daten:", appointments);
  if (error) {
    throw error;
  }
  return appointments;
}

export const createAppointment = async (appointment) => {
  const { error } = await supabase.from("appointments").insert(appointment);

  if (error) {
    return error.message; // 👈 nur String!
  }

  return true;
};

export async function deleteAppointment(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId);
  if (error) {
    throw error;
  }
  console.log(error);
  return data;
}

export async function editAppointment(appointment, date, time, message) {
  const appointmentId = appointment.id;
  if (message === null) {
    const { data, error } = await supabase
      .from("appointments")
      .update({ date: date, time: time })
      .eq("id", appointmentId)
      .select();
    if (error) {
      throw error;
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from("appointments")
      .update({ date: date, time: time, message: message })
      .eq("id", appointmentId)
      .select();
    if (error) {
      throw error;
    }
    return data;
  }
}
