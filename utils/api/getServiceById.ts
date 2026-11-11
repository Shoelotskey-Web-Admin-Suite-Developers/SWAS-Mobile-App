const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export type Service = {
  service_id: string;
  service_base_price: number;
  service_type: 'Service' | 'Additional';
  service_duration: number;
  service_name: string;
  service_description?: string | null;
};

export const getServiceById = async (serviceId: string): Promise<Service> => {
  if (!serviceId) {
    throw new Error('Service ID is required');
  }

  const response = await fetch(`${API_BASE_URL}/api/services/${encodeURIComponent(serviceId)}`);
  const text = await response.text();
  let data: Service | { message?: string };

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Service request returned invalid JSON (status ${response.status})`);
  }

  if (!response.ok) {
    throw new Error(
      ('message' in data && data.message) || `Failed to load ${serviceId} (status ${response.status})`,
    );
  }

  return data as Service;
};
