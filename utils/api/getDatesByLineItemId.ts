import { getUserToken } from '@/utils/session';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

/**
 * Fetch Dates by line_item_id
 * @param lineItemId string
 * @returns Dates object or null
 */
export const getDatesByLineItemId = async (lineItemId: string): Promise<any | null> => {
  try {
    const token = await getUserToken();
    if (!lineItemId || !token) return null;
    const url = `${API_BASE_URL}/api/dates/${lineItemId}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch dates');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch dates:', err);
    return null;
  }
};