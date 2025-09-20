// src/utils/api/deleteAppointments.ts
import { getUserId } from "../session";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; // or VITE_API_BASE_URL depending on setup

export const deletePendingAppointment = async () => {
  try {
    // Get customer ID
    const cust_id = await getUserId();
    if (!cust_id) throw new Error("Customer ID not found in session storage");

    // Send DELETE request to backend
    const res = await fetch(`${API_BASE_URL}/appointments/customer/${cust_id}/pending`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to delete pending appointment");
    }

    const data = await res.json();
    return data; // e.g., { message: "Pending appointment(s) deleted successfully" }
  } catch (error) {
    console.error("Error deleting pending appointment:", error);
    throw error;
  }
};
