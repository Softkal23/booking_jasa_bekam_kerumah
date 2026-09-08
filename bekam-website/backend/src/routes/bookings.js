import { Router } from "express";
import { db, SERVICES, TIME_SLOTS } from "../db.js";
import { validateBooking } from "../middleware/validate.js";
import { bookingLimiter } from "../middleware/rateLimit.js";
import { notifyAdminNewBooking } from "../notify.js";

export const bookingsRouter = Router();

bookingsRouter.get("/services", (req, res) => {
  res.json({ ok: true, services: SERVICES });
});

// Ambil jam yang sudah terisi untuk tanggal tertentu, supaya kalender
// bisa menandai slot yang penuh sebelum user submit.
bookingsRouter.get("/availability", (req, res) => {
  const date = String(req.query.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ ok: false, errors: ["Parameter tanggal tidak valid."] });
  }
  const rows = db
    .prepare(`SELECT booking_time FROM bookings WHERE booking_date = ? AND status != 'cancelled'`)
    .all(date);
  const bookedTimes = rows.map((r) => r.booking_time);
  res.json({ ok: true, date, allSlots: TIME_SLOTS, bookedTimes });
});

// Tandai tanggal yang SEMUA slotnya sudah penuh dalam satu bulan,
// dipakai kalender untuk mencoret tanggal tersebut.
bookingsRouter.get("/availability/month", (req, res) => {
  const year = parseInt(req.query.year, 10);
  const month = parseInt(req.query.month, 10); // 1-12
  if (!year || !month || month < 1 || month > 12) {
    return res.status(400).json({ ok: false, errors: ["Parameter bulan tidak valid."] });
  }
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const rows = db
    .prepare(
      `SELECT booking_date, COUNT(*) as total FROM bookings
       WHERE booking_date LIKE ? AND status != 'cancelled'
       GROUP BY booking_date`
    )
    .all(`${prefix}%`);

  const fullyBookedDates = rows
    .filter((r) => r.total >= TIME_SLOTS.length)
    .map((r) => r.booking_date);

  res.json({ ok: true, fullyBookedDates });
});

bookingsRouter.post("/bookings", bookingLimiter, validateBooking, async (req, res) => {
  const d = req.validated;
  try {
    const stmt = db.prepare(`
      INSERT INTO bookings
        (name, email, phone, service, street_address, address_detail, booking_date, booking_time, notes)
      VALUES (@name, @email, @phone, @service, @streetAddress, @addressDetail, @bookingDate, @bookingTime, @notes)
    `);
    const info = stmt.run(d);
    const service = SERVICES.find((s) => s.id === d.service);

    // Kirim notifikasi ke admin (email otomatis jika SMTP di-set,
    // plus link WhatsApp siap-klik). Tidak menunda respons ke user.
    notifyAdminNewBooking({ ...d, serviceName: service?.name || d.service }).catch(() => {});

    res.status(201).json({
      ok: true,
      booking: {
        id: info.lastInsertRowid,
        name: d.name,
        service: service?.name || d.service,
        bookingDate: d.bookingDate,
        bookingTime: d.bookingTime,
        status: "pending",
      },
    });
  } catch (err) {
    // UNIQUE constraint gagal -> slot sudah diambil orang lain lebih dulu.
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ ok: false, errors: ["Slot jam ini baru saja dipesan orang lain. Silakan pilih jam lain."] });
    }
    console.error(err);
    res.status(500).json({ ok: false, errors: ["Terjadi kesalahan server. Coba lagi."] });
  }
});
