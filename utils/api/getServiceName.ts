const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getServiceName = async (service_id: string): Promise<string | null> => {
  try {
    if (!service_id) throw new Error("Service ID is required");

    const url = `${API_BASE_URL}/api/services/${service_id}`;
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
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }

    return data?.service_name || null;
  } catch (err: any) {
    console.error("Error in getServiceName:", err);
    return null;
  }
};