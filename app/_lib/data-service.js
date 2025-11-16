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
  if (error) {
    throw error;
  }
  return data;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
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

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function getAllUsers() {
  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("id_number, name, role, email");
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
    .single();
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
  if (error) {
    throw error;
  }
  return appointments;
}

export async function createAppointment(appointment) {
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointment]);
  if (error) {
    throw error;
  }
  return data;
}

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
