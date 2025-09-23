const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getLineItemById = async (line_item_id: string) => {
  try {
    if (!line_item_id) throw new Error("Line Item ID is required");

    const url = `${API_BASE_URL}/api/line-items/${line_item_id}`;
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
      throw new Error(data?.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    console.error("Error in getLineItemById:", err);
    return null;
  }
};