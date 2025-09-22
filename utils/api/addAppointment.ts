// src/utils/api/addAppointment.ts
import { getUserId } from "../session"; // ✅ import getUserId
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

interface AddAppointmentPayload {
  branch_id: string;
  date_for_inquiry: string; // YYYY-MM-DD
  time_start: string;       // HH:mm
  time_end: string;         // HH:mm
  status?: "Pending" | "Approved";
}

export const addAppointment = async (payload: AddAppointmentPayload) => {
  try {
    // Get customer ID using session util
    const cust_id = await getUserId();
    if (!cust_id) throw new Error("Customer ID not found in session storage");

    // Send POST request to backend
  const res = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cust_id,
        branch_id: payload.branch_id,
        date_for_inquiry: payload.date_for_inquiry,
        time_start: payload.time_start,
        time_end: payload.time_end,
        status: payload.status || "Pending",
      }),
    });


    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to add appointment");
    }

    const data = await res.json();
    return data; // returns the newly created appointment with generated appointment_id
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }
};
