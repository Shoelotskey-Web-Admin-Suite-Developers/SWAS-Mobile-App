import { getUserId, getUserToken } from '@/utils/session'; // getUserToken should return your JWT

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getCustName = async (): Promise<string | null> => {
  try {
    const cust_id = await getUserId();
    const token = await getUserToken(); // You need to implement this if not present
    if (!cust_id || !token) return null;
    const url = `${API_BASE_URL}/api/customers/${cust_id}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data.customer?.cust_name || null;
  } catch (err) {
    console.error('Failed to fetch customer full name:', err);
    return null;
  }
};