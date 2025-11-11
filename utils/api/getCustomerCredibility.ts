import { getUserId, getUserToken } from '@/utils/session';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getCustomerCredibility = async (): Promise<number | null> => {
  try {
    const cust_id = await getUserId();
    const token = await getUserToken();
    
    if (!cust_id || !token) return null;
    
    const url = `${API_BASE_URL}/api/customers/${cust_id}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch customer credibility:', res.status);
      return null;
    }
    
    const data = await res.json();
    return data.customer?.credibility ?? null;
  } catch (err) {
    console.error('Failed to fetch customer credibility:', err);
    return null;
  }
};
