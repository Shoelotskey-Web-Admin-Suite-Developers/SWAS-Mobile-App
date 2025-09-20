// src/utils/api/getAppointment.ts
import { getUserId } from "../session";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getAppointment = async () => {
  try {
    const cust_id = await getUserId();
    if (!cust_id) throw new Error("Customer ID not found in session storage");

    const url = `${API_BASE_URL}/appointments/customer/${cust_id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const text = await res.text();

    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      throw new Error(`Server response is not JSON (status ${res.status}): ${text.substring(0, 200)}`);
    }

    if (!res.ok) {
      // If the backend says "no upcoming appointments", treat it as normal
      if (data?.error?.toLowerCase().includes("no upcoming")) {
        return null;
      }
      throw new Error(data?.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    // Only log unexpected errors
    if (!err.message.toLowerCase().includes("no upcoming")) {
      console.error("Error in getAppointment:", err);
    }
    return null; // treat "no upcoming appointments" as no data
  }
};
