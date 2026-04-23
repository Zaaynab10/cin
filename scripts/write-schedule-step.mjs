import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(
	__dirname,
	"../src/features/appointment/components/schedule-step.tsx",
);

const SRC = `\
// Expected: Display available slots and let user pick a valid time slot.
"use client";

import { useState } from "react";

// --- Slot config by appointment type -----------------------------------------

const SLOTS_BY_TYPE: Record<string, { time: string; full: boolean }[]> = {
  pickup: [
    { time: "14h00", full: false },
    { time: "15h00", full: false },
    { time: "16h00", full: true  },
  ],
  new_request: [
    { time: "9h00",  full: false },
    { time: "10h00", full: true  },
    { time: "11h00", full: false },
  ],
  renewal: [
    { time: "9h00",  full: false },
    { time: "10h00", full: true  },
    { time: "11h00", full: false },
  ],
};

const DEFAULT_SLOTS = SLOTS_BY_TYPE.new_request;

// --- Calendar constants -------------------------------------------------------

const CLOSED_DAYS = [0];

const MONTH_NAMES_FR = [
  "Janvier", "F\u00e9vrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Ao\u00fbt", "Septembre", "Octobre", "Novembre", "D\u00e9cembre",
];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

const TODAY      = new Date();
const CURR_YEAR  = TODAY.getFullYear();
const YEAR_OPTIONS = [CURR_YEAR, CURR_YEAR + 1, CURR_YEAR + 2];

// --- Helpers ------------------------------------------------------------------

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

// --- Icons --------------------------------------------------------------------

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

// --- Component ----------------------------------------------------------------

type ScheduleStepProps = {
  appointmentType?: string;
  onNext: () => void;
  onPrevious: () => void;
};

export function ScheduleStep({ appointmentType, onNext, onPrevious }: ScheduleStepProps) {
  const [viewYear,     setViewYear]     = useState(TODAY.getFullYear());
  const [viewMonth,    setViewMonth]    = useState(TODAY.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = (appointmentType && SLOTS_BY_TYPE[appointmentType])
    ? SLOTS_BY_TYPE[appointmentType]
    : DEFAULT_SLOTS;

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
  }

  function handleYearSelect(y: number) {
    setViewYear(y);
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  function isDateDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    if (d < todayStart) return true;
    if (CLOSED_DAYS.includes(d.getDay())) return true;
    return false;
  }

  function selectDate(day: number) {
    if (isDateDisabled(day)) return;
    setSelectedDate(day);
    setSelectedSlot(null);
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
            aria-label="Mois pr\u00e9c\u00e9dent"
          >
            <IconChevronLeft className="sch-nav__arrow-icon" />
          </button>
          <span className="sch-nav__headline">
            {MONTH_NAMES_FR[viewMonth]}\u00a0{viewYear}
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
              className={\`sch-year-tab\${viewYear === y ? " sch-year-tab--sel" : ""}\`}
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
        <div className="sch-cal__grid">
          {cells.map((cell, i) => {
            if (cell.month !== "curr") {
              return <span key={i} className="sch-cal__day sch-cal__day--other">{cell.day}</span>;
            }
            const disabled = isDateDisabled(cell.day);
            const selected  = selectedDate === cell.day;
            let cls = "sch-cal__day";
            if (disabled)      cls += " sch-cal__day--disabled";
            else if (selected) cls += " sch-cal__day--selected";
            else               cls += " sch-cal__day--available";
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={() => selectDate(cell.day)}
                disabled={disabled}
                aria-pressed={selected}
                aria-label={\`\${cell.day} \${MONTH_NAMES_FR[viewMonth]}\`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sch-slots">
        <p className="sch-slots__title">
          Cr\u00e9neaux disponibles
          {selectedDate && (
            <span className="sch-slots__date">
              {" "}&mdash;{" "}{selectedDate} {MONTH_NAMES_FR[viewMonth]}
            </span>
          )}
        </p>
        {!selectedDate ? (
          <p className="sch-slots__empty">S\u00e9lectionnez un jour dans le calendrier.</p>
        ) : (
          <div className="sch-slots__list">
            {slots.map(({ time, full }) => {
              const sel = selectedSlot === time;
              let cls = "sch-slot";
              if (full)      cls += " sch-slot--full";
              else if (sel)  cls += " sch-slot--selected";
              else           cls += " sch-slot--free";
              return (
                <button
                  key={time}
                  type="button"
                  className={cls}
                  onClick={() => !full && setSelectedSlot(time)}
                  disabled={full}
                  aria-pressed={sel}
                >
                  {time}
                  <span className="sch-slot__badge">
                    {full ? "complet" : sel ? "s\u00e9lectionn\u00e9" : "disponible"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div className="sch-slots__notice">
          <IconInfo className="sch-slots__notice-icon" />
          <span>Les rendez-vous sont confirm\u00e9s par e-mail sous 48&nbsp;h.</span>
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
          onClick={onNext}
        >
          Continuer
          <IconArrowRight className="apf-submit__icon" />
        </button>
      </div>
    </section>
  );
}
`;

writeFileSync(OUT, SRC, { encoding: "utf8" });
console.log("written", OUT);
