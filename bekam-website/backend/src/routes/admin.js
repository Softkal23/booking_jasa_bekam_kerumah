import { Router } from "express";
import { db } from "../db.js";
import "dotenv/config";

export const adminRouter = Router();

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

// Semua route admin wajib menyertakan header X-Admin-Token yang cocok.
// Ini bukan sistem login penuh, tapi cukup untuk melindungi data booking
// (nama, HP, alamat pelanggan) agar tidak bisa diakses publik begitu saja.
function requireAdminToken(req, res, next) {
  const token = req.header("x-admin-token");
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, errors: ["Token admin tidak valid."] });
  }
  next();
}

adminRouter.use(requireAdminToken);

adminRouter.get("/bookings", (req, res) => {
  const rows = db
    .prepare(`SELECT * FROM bookings ORDER BY booking_date DESC, booking_time DESC`)
    .all();
  res.json({ ok: true, bookings: rows });
});

adminRouter.patch("/bookings/:id/status", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const status = String(req.body.status || "");
  const allowed = ["pending", "confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ ok: false, errors: ["Status tidak valid."] });
  }
  const info = db.prepare(`UPDATE bookings SET status = ? WHERE id = ?`).run(status, id);
  if (info.changes === 0) {
    return res.status(404).json({ ok: false, errors: ["Booking tidak ditemukan."] });
  }
  res.json({ ok: true });
});

adminRouter.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const info = db.prepare(`DELETE FROM bookings WHERE id = ?`).run(id);
  if (info.changes === 0) {
    return res.status(404).json({ ok: false, errors: ["Booking tidak ditemukan."] });
  }
  res.json({ ok: true });
});