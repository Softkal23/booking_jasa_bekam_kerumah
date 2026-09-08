import rateLimit from "express-rate-limit";

// Batasi maksimal 5 percobaan order per IP setiap 10 menit
// untuk mencegah spam/bot booking.
export const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, errors: ["Terlalu banyak percobaan. Coba lagi beberapa menit lagi."] },
});
