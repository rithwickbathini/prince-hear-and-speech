import { useEffect, useState } from "react";
import { therapistsApi } from "../services/therapists";
import type { Therapist } from "../types";

export function useTherapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    therapistsApi
      .list()
      .then((res) => {
        if (active) setTherapists(res.therapists);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load therapists.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { therapists, loading, error };
}
