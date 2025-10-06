import { getUserId } from "../session";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getLineItems = async () => {
  try {
    const cust_id = await getUserId();
    if (!cust_id) throw new Error("Customer ID not found in session storage");

    const url = `${API_BASE_URL}/api/line-items/customer/${cust_id}`;
    console.log(`getLineItems: fetching line-items for cust_id=${cust_id} url=${url}`);
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(`getLineItems: response status=${res.status}`);
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
    console.error("Error in getLineItems:", err);
    return null;
  }
}