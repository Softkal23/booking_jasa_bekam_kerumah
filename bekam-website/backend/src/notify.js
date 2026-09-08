import nodemailer from "nodemailer";
import "dotenv/config";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || "";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD || "";

let transporter = null;
if (SMTP_USER && SMTP_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
  });
}

function buildWhatsAppLink(booking) {
  const text = encodeURIComponent(
    `BOOKING BARU\n\n` +
    `Nama: ${booking.name}\n` +
    `HP: ${booking.phone}\n` +
    `Layanan: ${booking.serviceName}\n` +
    `Tanggal: ${booking.bookingDate}\n` +
    `Jam: ${booking.bookingTime}\n` +
    `Alamat: ${booking.streetAddress}, ${booking.addressDetail || "-"}`
  );
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`;
}

// Kirim notifikasi booking baru ke admin.
// - Jika SMTP dikonfigurasi di .env, email terkirim otomatis.
// - Selalu dicatat ke console beserta link WhatsApp siap-klik,
//   sehingga tetap ada jejak notifikasi walau email belum di-setup.
export async function notifyAdminNewBooking(booking) {
  const waLink = buildWhatsAppLink(booking);

  console.log("=== BOOKING BARU ===");
  console.log(`Nama       : ${booking.name}`);
  console.log(`Email      : ${booking.email}`);
  console.log(`HP         : ${booking.phone}`);
  console.log(`Layanan    : ${booking.serviceName}`);
  console.log(`Tanggal    : ${booking.bookingDate} ${booking.bookingTime}`);
  console.log(`Alamat     : ${booking.streetAddress}, ${booking.addressDetail || "-"}`);
  console.log(`Link WA    : ${waLink}`);
  console.log("=====================");

  if (!transporter || !ADMIN_EMAIL) return;

  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: ADMIN_EMAIL,
      subject: `Booking Baru — ${booking.name} (${booking.bookingDate} ${booking.bookingTime})`,
      text:
        `Ada pesanan bekam baru.\n\n` +
        `Nama: ${booking.name}\n` +
        `Email: ${booking.email}\n` +
        `HP: ${booking.phone}\n` +
        `Layanan: ${booking.serviceName}\n` +
        `Tanggal: ${booking.bookingDate}\n` +
        `Jam: ${booking.bookingTime}\n` +
        `Alamat: ${booking.streetAddress}, ${booking.addressDetail || "-"}\n` +
        `Catatan: ${booking.notes || "-"}\n\n` +
        `Balas cepat via WhatsApp: ${waLink}`,
    });
  } catch (err) {
    // Jangan gagalkan proses booking hanya karena email gagal terkirim.
    console.error("Gagal mengirim email notifikasi:", err.message);
  }
}
