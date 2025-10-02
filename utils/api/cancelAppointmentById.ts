// src/utils/api/cancelAppointmentById.ts
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const cancelAppointmentById = async (appointment_id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/appointments/${encodeURIComponent(appointment_id)}/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    throw new Error(data?.error || `Failed to cancel appointment (${res.status})`);
  }
  return data;
};
