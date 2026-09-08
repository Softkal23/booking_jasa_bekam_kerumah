import { TIME_SLOTS, SERVICES } from "../db.js";
import "dotenv/config";

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^08[0-9]{8,12}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Buang tag/karakter yang bisa dipakai untuk HTML/script injection.
function stripHtml(value) {
  return String(value).replace(/[<>]/g, "").trim();
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET_KEY) return true; // CAPTCHA belum diaktifkan, lewati
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    // Kalau Cloudflare tidak bisa dihubungi, jangan blokir order karena masalah jaringan.
    return true;
  }
}

export async function validateBooking(req, res, next) {
  const body = req.body || {};
  const errors = [];

  // Honeypot: field tersembunyi yang hanya diisi oleh bot.
  // Kalau terisi, tolak diam-diam seolah sukses agar bot tidak tahu kena filter.
  if (body.website) {
    return res.status(201).json({ ok: true, booking: { id: 0, status: "pending" } });
  }

  const name = stripHtml(body.name || "");
  const email = stripHtml(body.email || "");
  const phone = stripHtml(body.phone || "");
  const serviceId = stripHtml(body.service || "");
  const streetAddress = stripHtml(body.streetAddress || "");
  const addressDetail = stripHtml(body.addressDetail || "");
  const bookingDate = stripHtml(body.bookingDate || "");
  const bookingTime = stripHtml(body.bookingTime || "");
  const notes = stripHtml(body.notes || "");

  if (name.length < 3 || name.length > 100) errors.push("Nama tidak valid.");
  if (!EMAIL_RE.test(email)) errors.push("Email tidak valid.");
  if (!PHONE_RE.test(phone)) errors.push("Nomor HP tidak valid. Gunakan format 08xxxxxxxxxx.");
  if (!SERVICES.some((s) => s.id === serviceId)) errors.push("Layanan tidak valid.");
  if (streetAddress.length < 5 || streetAddress.length > 200) errors.push("Nama jalan/alamat tidak valid.");
  if (!DATE_RE.test(bookingDate)) errors.push("Tanggal tidak valid.");
  if (!TIME_SLOTS.includes(bookingTime)) errors.push("Jam tidak valid.");

  // Tanggal tidak boleh di masa lalu.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const chosenDate = new Date(bookingDate + "T00:00:00");
  if (isNaN(chosenDate.getTime()) || chosenDate < today) {
    errors.push("Tanggal booking sudah lewat.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const captchaOk = await verifyTurnstile(body.turnstileToken, req.ip);
  if (!captchaOk) {
    return res.status(400).json({ ok: false, errors: ["Verifikasi CAPTCHA gagal, silakan coba lagi."] });
  }

  req.validated = {
    name,
    email,
    phone,
    service: serviceId,
    streetAddress,
    addressDetail,
    bookingDate,
    bookingTime,
    notes: notes.slice(0, 500),
  };
  next();
}
