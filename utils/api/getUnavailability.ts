// utils/api/getUnavailability.ts
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export async function getUnavailability(branch: string, date: Date, time?: Date) {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD

    // You can expand later to also send time if needed
    const url = `${API_BASE_URL}/api/unavailability?date=${formattedDate}&branch_id=${branch}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch unavailability");

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    console.error("❌ getUnavailability error:", err);
    return { data: null, error: err.message };
  }
}
