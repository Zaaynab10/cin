// Expected: Display available slots and let user pick a valid time slot.
"use client";

import { useEffect, useState } from "react";
import { fetchSlots, fetchAvailableDays } from "../lib/appointment-api";
import type { ScheduleData } from "../types/appointment.types";

// Slot types

type BackendSlot = { id: string; startAt: string; endAt: string; available: boolean };

// Calendar constants

const CLOSED_DAYS = [0];

const MONTH_NAMES_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

const TODAY      = new Date();
const CURR_YEAR  = TODAY.getFullYear();
const YEAR_OPTIONS = [CURR_YEAR, CURR_YEAR + 1, CURR_YEAR + 2];

// Helpers

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function formatSlotTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString("fr-FR", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(":", "h");
}

function toDateStr(day: number, month: number, year: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Icons

type SvgProps = { className?: string };

function IconChevronLeft({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconArrowLeft({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconArrowRight({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconInfo({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// Component

type ScheduleStepProps = {
  appointmentType?: string;
  onNext: (data: ScheduleData) => void;
  onPrevious: () => void;
};

export function ScheduleStep({ appointmentType, onNext, onPrevious }: ScheduleStepProps) {
  const [viewYear,          setViewYear]          = useState(TODAY.getFullYear());
  const [viewMonth,         setViewMonth]         = useState(TODAY.getMonth());
  const [selectedDate,      setSelectedDate]      = useState<number | null>(null);
  const [selectedSlot,      setSelectedSlot]      = useState<string | null>(null);
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string | null>(null);
  const [backendSlots,      setBackendSlots]      = useState<BackendSlot[]>([]);
  const [slotsLoading,      setSlotsLoading]      = useState(false);
  const [slotsError,        setSlotsError]        = useState<string | null>(null);
  const [availableDays,     setAvailableDays]     = useState<Set<number>>(new Set());
  const [daysLoading,       setDaysLoading]       = useState(false);

  // Load available days whenever month/year/type changes
  useEffect(() => {
    if (!appointmentType) return;
    console.log("DEBUG fetchAvailableDays params", { appointmentType, viewYear, viewMonth: viewMonth + 1 });
    let cancelled = false;
    setDaysLoading(true);
    setAvailableDays(new Set());
    fetchAvailableDays(appointmentType, viewYear, viewMonth + 1)
      .then((res) => {
        console.log("DEBUG fetchAvailableDays response", res);
        if (!cancelled) {
          const days = ((res as { days?: number[] }).days) ?? [];
          setAvailableDays(new Set(days));
        }
      })
      .catch((err) => {
        console.log("DEBUG fetchAvailableDays error", err);
        if (!cancelled) setAvailableDays(new Set());
      })
      .finally(() => {
        if (!cancelled) setDaysLoading(false);
      });
    return () => { cancelled = true; };
  }, [appointmentType, viewYear, viewMonth]);

  useEffect(() => {
    if (!selectedDate || !appointmentType) {
      setBackendSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(null);
    setSelectedSlot(null);
    setSelectedSlotLabel(null);
    fetchSlots(appointmentType, toDateStr(selectedDate, viewMonth, viewYear))
      .then((res) => {
        if (!cancelled) setBackendSlots(((res as { slots?: BackendSlot[] }).slots) ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlotsError("Impossible de charger les créneaux.");
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedDate, viewMonth, viewYear, appointmentType]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstOffset = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInPrev  = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

  const minYear = CURR_YEAR;
  const maxYear = CURR_YEAR + 2;

  function prevMonth() {
    if (viewMonth === 0) {
      if (viewYear <= minYear) return;
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedSlotLabel(null);
    setBackendSlots([]);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      if (viewYear >= maxYear) return;
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedSlotLabel(null);
    setBackendSlots([]);
  }

  function handleYearSelect(y: number) {
    setViewYear(y);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedSlotLabel(null);
    setBackendSlots([]);
  }

  function isDateDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    if (d < todayStart) return true;
    if (CLOSED_DAYS.includes(d.getDay())) return true;
    return false;
  }

  function hasAvailableSlots(day: number): boolean {
    return availableDays.has(day);
  }

  function selectDate(day: number) {
    if (isDateDisabled(day)) return;
    setSelectedDate(day);
    setSelectedSlot(null);
    setSelectedSlotLabel(null);
  }

  const canContinue = selectedDate !== null && selectedSlot !== null;
  const atMin = viewYear === minYear && viewMonth === 0;
  const atMax = viewYear === maxYear && viewMonth === 11;

  const totalCells = Math.ceil((firstOffset + daysInMonth) / 7) * 7;
  const cells: { day: number; month: "prev" | "curr" | "next" }[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < firstOffset) {
      cells.push({ day: daysInPrev - firstOffset + 1 + i, month: "prev" });
    } else if (i < firstOffset + daysInMonth) {
      cells.push({ day: i - firstOffset + 1, month: "curr" });
    } else {
      cells.push({ day: i - firstOffset - daysInMonth + 1, month: "next" });
    }
  }

  // DEBUG: Affiche les jours disponibles dans la console navigateur
  console.log("availableDays", Array.from(availableDays));

  return (
    <section className="apf-section">
      <div className="apf-section__header">
        <h2 className="apf-section__heading">Date &amp; heure</h2>
        <div className="apf-section__bar" />
      </div>

      <div className="sch-nav">
        <div className="sch-nav__month-row">
          <button
            type="button"
            className="sch-nav__arrow"
            onClick={prevMonth}
            disabled={atMin}
            aria-label="Mois précédent"
          >
            <IconChevronLeft className="sch-nav__arrow-icon" />
          </button>
          <span className="sch-nav__headline">
            {MONTH_NAMES_FR[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            className="sch-nav__arrow"
            onClick={nextMonth}
            disabled={atMax}
            aria-label="Mois suivant"
          >
            <IconChevronRight className="sch-nav__arrow-icon" />
          </button>
        </div>
        <div className="sch-year-tabs">
          {YEAR_OPTIONS.map((y) => (
            <button
              key={y}
              type="button"
              className={`sch-year-tab${viewYear === y ? " sch-year-tab--sel" : ""}`}
              onClick={() => handleYearSelect(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="sch-cal">
        <div className="sch-cal__dow-row">
          {DAY_LABELS.map((l, i) => (
            <span key={i} className="sch-cal__dow">{l}</span>
          ))}
        </div>
        {daysLoading ? (
          <div className="sch-cal__grid">
            {Array.from({ length: 35 }).map((_, i) => (
              <span key={i} className="sch-cal__day sch-cal__day--skeleton" aria-hidden="true" />
            ))}
          </div>
        ) : (
        <div className="sch-cal__grid">
          {cells.map((cell, i) => {
            if (cell.month !== "curr") {
              return <span key={i} className="sch-cal__day sch-cal__day--other">{cell.day}</span>;
            }
            const disabled  = isDateDisabled(cell.day);
            const selected  = selectedDate === cell.day;
            const hasSlotsAvailable = !disabled && hasAvailableSlots(cell.day);
            let cls = "sch-cal__day";
            if (disabled)         cls += " sch-cal__day--disabled";
            else if (selected)    cls += " sch-cal__day--selected";
            else if (hasSlotsAvailable) cls += " sch-cal__day--available";
            else                  cls += " sch-cal__day--no-slots";
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={() => selectDate(cell.day)}
                disabled={disabled}
                aria-pressed={selected}
                aria-label={`${cell.day} ${MONTH_NAMES_FR[viewMonth]}`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
        )}
      </div>

      <div className="sch-slots">
        <p className="sch-slots__title">
          Créneaux disponibles
          {selectedDate && (
            <span className="sch-slots__date">
              {" "}&mdash;{" "}{selectedDate} {MONTH_NAMES_FR[viewMonth]}
            </span>
          )}
        </p>
        {!selectedDate ? (
          <p className="sch-slots__empty">Sélectionnez un jour dans le calendrier.</p>
        ) : slotsLoading ? (
          <p className="sch-slots__empty">Chargement des créneaux…</p>
        ) : slotsError ? (
          <p className="sch-slots__empty">{slotsError}</p>
        ) : backendSlots.length === 0 ? (
          <p className="sch-slots__empty">Aucun créneau disponible pour ce jour.</p>
        ) : (
          <div className="sch-slots__list">
            {backendSlots.map((slot) => {
              const label = formatSlotTime(slot.startAt);
              const sel   = selectedSlot === slot.id;
              let cls = "sch-slot";
              if (!slot.available) cls += " sch-slot--full";
              else if (sel)        cls += " sch-slot--selected";
              else                 cls += " sch-slot--free";
              return (
                <button
                  key={slot.id}
                  type="button"
                  className={cls}
                  onClick={() => {
                    if (!slot.available) return;
                    setSelectedSlot(slot.id);
                    setSelectedSlotLabel(label);
                  }}
                  disabled={!slot.available}
                  aria-pressed={sel}
                >
                  {label}
                  <span className="sch-slot__badge">
                    {!slot.available ? "complet" : sel ? "sélectionné" : "disponible"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div className="sch-slots__notice">
          <IconInfo className="sch-slots__notice-icon" />
          <span>Les rendez-vous sont confirmés par e-mail sous 48&nbsp;h.</span>
        </div>
      </div>

      <div className="apf-actions">
        <button type="button" className="apf-back" onClick={onPrevious}>
          <IconArrowLeft className="apf-back__icon" />
          Retour
        </button>
        <button
          type="button"
          className="apf-submit"
          style={{ flex: 1 }}
          disabled={!canContinue}
          onClick={() => onNext({ day: selectedDate!, month: viewMonth, year: viewYear, slotId: selectedSlot!, slotLabel: selectedSlotLabel! })}
        >
          Continuer
          <IconArrowRight className="apf-submit__icon" />
        </button>
      </div>
    </section>
  );
}
