type Promo = {
  id: string;
  title: string;
  description: string;
  duration?: string;
  branchName?: string;
};

// EXPO_PUBLIC_API_BASE_URL is expected to be the host (for example http://192.168.254.109:5001)
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const getPromos = async (): Promise<Promo[] | null> => {
  try {
    if (!API_BASE_URL) throw new Error('API base URL not configured');

  const res = await fetch(`${API_BASE_URL}/api/promos`, {
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

    const mapped: Promo[] = (data.promos || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      duration: p.duration || '',
      branchName: p.branch_name || p.branch_id || undefined,
    }));

    return mapped;
  } catch (err) {
    console.error('getPromos error:', err);
    return null;
  }
};
