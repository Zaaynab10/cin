
import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api/client";

type Slot = {
  id: string;
  type: string;
  date: string;
  startAt: string;
  endAt: string;
  available: boolean;
};

type SlotsListProps = {
  type: string;
  date: string;
};

export default function SlotsList({ type, date }: SlotsListProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient(`/appointments/slots?type=${type}&date=${date}`)
      .then((data) => {
        setSlots((data.slots as Slot[]) || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des créneaux");
        setLoading(false);
      });
  }, [type, date]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!slots.length) return <div>Aucun créneau disponible</div>;

  return (
    <ul>
      {slots.map((slot) => (
        <li
          key={slot.id}
          className={slot.available ? "slot-available" : "slot-unavailable"}
        >
          {slot.type} {new Date(slot.startAt).toLocaleString()} à {new Date(slot.endAt).toLocaleString()} {slot.available ? "(disponible)" : "(indisponible)"}
        </li>
      ))}
    </ul>
  );
}
