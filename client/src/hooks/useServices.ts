import { useEffect, useState } from "react";
import { serviceCatalogApi } from "../services/serviceCatalog";
import type { Service } from "../types";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    serviceCatalogApi
      .list()
      .then((res) => {
        if (active) setServices(res.services);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load services.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { services, loading, error };
}
