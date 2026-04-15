import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api/client";

export default function SlotsList({ type, date }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient(`/appointments/slots?type=${type}&date=${date}`)
      .then((data) => {
        setSlots(data.slots || []);
        setLoading(false);
      })
      .catch((err) => {
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
