import { useCallback, useEffect, useState } from "react";
import { appointmentsApi } from "../services/appointments";
import type { Appointment, AppointmentStatus } from "../types";

export function useAppointments(status?: AppointmentStatus) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return appointmentsApi
      .list(status)
      .then((res) => setAppointments(res.appointments))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load appointments."))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { appointments, loading, error, refresh };
}
