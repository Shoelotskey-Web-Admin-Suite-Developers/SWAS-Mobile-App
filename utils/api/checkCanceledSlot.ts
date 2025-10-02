// src/utils/api/checkCanceledSlot.ts
import { getUserId } from "../session";
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

/**
 * Checks if the current user has previously canceled the exact same slot (branch/date/time_start)
 * Returns { blocked: boolean, reason?: string }
 */
export const checkCanceledSlot = async (branch_id: string, date_for_inquiry: string, time_start: string) => {
  const cust_id = await getUserId();
  if (!cust_id) return { blocked: false };

  try {
    const url = `${API_BASE_URL}/api/appointments/canceled/check?cust_id=${encodeURIComponent(cust_id)}&branch_id=${encodeURIComponent(branch_id)}&date_for_inquiry=${encodeURIComponent(date_for_inquiry)}&time_start=${encodeURIComponent(time_start)}`;
    const res = await fetch(url);
    if (!res.ok) {
      // Treat 404 as no block; other errors escalate
      if (res.status === 404) return { blocked: false };
      const text = await res.text();
      console.warn('Canceled slot check non-OK:', res.status, text);
      return { blocked: false };
    }
    const data = await res.json();
    return data as { blocked: boolean; reason?: string };
  } catch (err) {
    console.warn('Canceled slot check failed:', err);
    return { blocked: false };
  }
};
