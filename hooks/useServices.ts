import { getServiceById, Service } from '@/utils/api/getServiceById';
import { useCallback, useEffect, useState } from 'react';

const SERVICE_IDS = [
  'SERVICE-1',
  'SERVICE-2',
  'SERVICE-3',
  'SERVICE-4',
  'SERVICE-5',
  'SERVICE-6',
  'SERVICE-7',
  'SERVICE-8',
  'SERVICE-9',
] as const;

export function useServices() {
  const [services, setServices] = useState<Record<string, Service>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedServices = await Promise.all(SERVICE_IDS.map(getServiceById));
      setServices(
        Object.fromEntries(loadedServices.map(service => [service.service_id, service])),
      );
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Failed to load services';
      setError(message);
      setServices({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return { services, loading, error, reload: loadServices };
}
