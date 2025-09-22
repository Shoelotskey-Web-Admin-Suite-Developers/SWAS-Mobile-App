import { Announcement } from '@/hooks/useAnnouncements';

// EXPO_PUBLIC_API_BASE_URL is expected to be the host (for example http://192.168.254.109:5001)
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getAnnouncements = async (): Promise<Announcement[] | null> => {
  try {
  if (!API_BASE_URL) throw new Error('API base URL not configured');

  const res = await fetch(`${API_BASE_URL}/api/announcements`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      throw new Error(`Server response is not JSON (status ${res.status}): ${text.substring(0, 200)}`);
    }

    if (!res.ok) {
      throw new Error(data?.error || `Request failed with status ${res.status}`);
    }

    const mapped: Announcement[] = (data.announcements || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description || '',
      date: new Date(a.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      branchName: a.branch_name || a.branch_id || undefined,
    }));

    return mapped;
  } catch (err) {
    console.error('getAnnouncements error:', err);
    return null;
  }
};
