import { useEffect, useState } from "react";
import { buildMonthGrid, toISODate, isPastDate, DAY_NAMES, MONTH_NAMES } from "../utils/date.js";
import { fetchMonthAvailability } from "../services/bookingApi.js";

export default function BookingCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [fullyBookedDates, setFullyBookedDates] = useState(new Set());

  const cells = buildMonthGrid(viewYear, viewMonth);

  useEffect(() => {
    let cancelled = false;
    fetchMonthAvailability(viewYear, viewMonth + 1)
      .then((res) => {
        if (!cancelled) setFullyBookedDates(new Set(res.fullyBookedDates || []));
      })
      .catch(() => {
        if (!cancelled) setFullyBookedDates(new Set());
      });
    return () => { cancelled = true; };
  }, [viewYear, viewMonth]);

  const changeMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Bulan sebelumnya">‹</button>
        <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Bulan berikutnya">›</button>
      </div>

      <div className="calendar__daynames">
        {DAY_NAMES.slice(1).concat(DAY_NAMES[0]).map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {cells.map((date, i) => {
          if (!date) return <span key={i} className="calendar__cell calendar__cell--empty" />;

          const iso = toISODate(date);
          const past = isPastDate(date);
          const full = fullyBookedDates?.has(iso);
          const isSelected = selectedDate === iso;
          const disabled = past || full;

          return (
            <button
              key={i}
              type="button"
              className={[
                "calendar__cell",
                disabled ? "is-disabled" : "",
                isSelected ? "is-selected" : "",
              ].join(" ")}
              disabled={disabled}
              onClick={() => onSelectDate(iso)}
              title={full ? "Tidak tersedia" : "Tersedia"}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="calendar__legend">
        <span><i className="dot dot--available" /> Tersedia</span>
        <span><i className="dot dot--full" /> Penuh</span>
      </div>
    </div>
  );
}
