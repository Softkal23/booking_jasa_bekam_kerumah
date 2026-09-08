import { useEffect, useState, useCallback } from "react";
import BookingCalendar from "./BookingCalendar.jsx";
import Loading from "./Loading.jsx";
import TurnstileWidget from "./TurnstileWidget.jsx";
import { validateBookingForm, hasErrors } from "../utils/validation.js";
import { fetchAvailability, createBooking } from "../services/bookingApi.js";

const ALL_SLOTS = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00", "19:00"];
const MIN_LOADING_MS = 900; // agar animasi loading tidak "berkedip" terlalu cepat

export default function BookingForm({ services, defaultServiceId, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: defaultServiceId || "",
    streetAddress: "",
    addressDetail: "",
    bookingDate: "",
    bookingTime: "",
    notes: "",
    website: "", // honeypot: field tersembunyi, harus tetap kosong
    turnstileToken: "",
  });
  const [errors, setErrors] = useState({});
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (defaultServiceId) {
      setForm((f) => ({ ...f, service: defaultServiceId }));
    }
  }, [defaultServiceId]);

  const loadAvailability = useCallback(async (dateISO) => {
    setAvailabilityLoading(true);
    try {
      const res = await fetchAvailability(dateISO);
      setBookedTimes(res.bookedTimes || []);
    } catch {
      setBookedTimes([]);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  const handleSelectDate = (iso) => {
    setForm((f) => ({ ...f, bookingDate: iso, bookingTime: "" }));
    loadAvailability(iso);
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateBookingForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitting(true);
    const startedAt = Date.now();
    try {
      const res = await createBooking(form);
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((r) => setTimeout(r, MIN_LOADING_MS - elapsed));
      }
      onSuccess(res.booking);
    } catch (err) {
      setServerError(err.message || "Gagal mengirim pesanan. Coba lagi.");
      // Slot mungkin baru saja penuh, refresh ketersediaan.
      if (form.bookingDate) loadAvailability(form.bookingDate);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot anti-bot: disembunyikan secara visual, bukan dengan display:none
          agar tetap "terlihat" oleh bot sederhana yang mengabaikan CSS, tapi
          tidak terlihat/terjangkau oleh pengguna manusia. */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={handleChange("website")}
        className="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="booking-form__grid">
        <div className="booking-form__fields">
          <label className="field">
            <span>Nama lengkap</span>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nama Anda"
              maxLength={100}
            />
            {errors.name && <em className="field__error">{errors.name}</em>}
          </label>

          <label className="field">
            <span>Email Gmail</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="nama@gmail.com"
            />
            {errors.email && <em className="field__error">{errors.email}</em>}
          </label>

          <label className="field">
            <span>Nomor HP</span>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="081234567890"
              maxLength={15}
            />
            {errors.phone && <em className="field__error">{errors.phone}</em>}
          </label>

          <label className="field">
            <span>Layanan</span>
            <select value={form.service} onChange={handleChange("service")}>
              <option value="">Pilih layanan</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.service && <em className="field__error">{errors.service}</em>}
          </label>

          <label className="field">
            <span>Nama jalan / alamat rumah</span>
            <input
              type="text"
              value={form.streetAddress}
              onChange={handleChange("streetAddress")}
              placeholder="Jl. Contoh No. 123"
              maxLength={200}
            />
            {errors.streetAddress && <em className="field__error">{errors.streetAddress}</em>}
          </label>

          <label className="field">
            <span>Detail alamat (RT/RW, patokan)</span>
            <input
              type="text"
              value={form.addressDetail}
              onChange={handleChange("addressDetail")}
              placeholder="RT 02/RW 05, dekat masjid"
              maxLength={200}
            />
          </label>

          <label className="field">
            <span>Catatan tambahan (opsional)</span>
            <textarea
              value={form.notes}
              onChange={handleChange("notes")}
              placeholder="Contoh: keluhan pegal di punggung"
              maxLength={500}
              rows={3}
            />
          </label>
        </div>

        <div className="booking-form__schedule">
          <div className="field">
            <span>Pilih tanggal</span>
            <BookingCalendar
              selectedDate={form.bookingDate}
              onSelectDate={handleSelectDate}
            />
            {errors.bookingDate && <em className="field__error">{errors.bookingDate}</em>}
          </div>

          <div className="field">
            <span>Pilih jam</span>
            {!form.bookingDate && <p className="hint">Pilih tanggal terlebih dahulu.</p>}
            {form.bookingDate && availabilityLoading && <p className="hint">Memuat jam tersedia...</p>}
            {form.bookingDate && !availabilityLoading && (
              <div className="time-slots">
                {ALL_SLOTS.map((slot) => {
                  const isFull = bookedTimes.includes(slot);
                  const isSelected = form.bookingTime === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isFull}
                      className={[
                        "time-slot",
                        isFull ? "is-full" : "",
                        isSelected ? "is-selected" : "",
                      ].join(" ")}
                      onClick={() => setForm((f) => ({ ...f, bookingTime: slot }))}
                    >
                      {slot}
                      {isFull && <small>Penuh</small>}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.bookingTime && <em className="field__error">{errors.bookingTime}</em>}
          </div>
        </div>
      </div>

      {serverError && <p className="form-error">{serverError}</p>}

      <TurnstileWidget onToken={(token) => setForm((f) => ({ ...f, turnstileToken: token }))} />

      <button type="submit" className="btn btn-primary booking-form__submit" disabled={submitting}>
        {submitting ? <Loading label="Memproses pesanan..." /> : "Order Sekarang"}
      </button>
    </form>
  );
}
