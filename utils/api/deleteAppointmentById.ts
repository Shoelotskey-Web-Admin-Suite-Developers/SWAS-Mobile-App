// src/utils/api/deleteAppointmentById.ts
import { getUserId } from "../session";
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const deleteAppointmentById = async (appointment_id: string) => {
  const cust_id = await getUserId(); // optional scoping
  try {
    const url = `${API_BASE_URL}/api/appointments/${encodeURIComponent(appointment_id)}${cust_id ? '' : ''}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to delete appointment');
    }
    return res.json();
  } catch (err) {
    console.error('Error deleting appointment by id:', err);
    throw err;
  }
};
