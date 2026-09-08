// Validasi di frontend hanya untuk UX (feedback cepat).
// Validasi yang menentukan tetap dilakukan di backend.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^08[0-9]{8,12}$/;

export function validateBookingForm(form) {
  const errors = {};

  if (!form.name || form.name.trim().length < 3) {
    errors.name = "Nama minimal 3 karakter.";
  }
  if (!EMAIL_RE.test(form.email || "")) {
    errors.email = "Gunakan email Gmail yang valid, contoh: nama@gmail.com";
  }
  if (!PHONE_RE.test(form.phone || "")) {
    errors.phone = "Format nomor HP: 08xxxxxxxxxx (10–14 digit).";
  }
  if (!form.streetAddress || form.streetAddress.trim().length < 5) {
    errors.streetAddress = "Nama jalan/alamat rumah wajib diisi.";
  }
  if (!form.service) {
    errors.service = "Pilih salah satu layanan.";
  }
  if (!form.bookingDate) {
    errors.bookingDate = "Pilih tanggal booking.";
  }
  if (!form.bookingTime) {
    errors.bookingTime = "Pilih jam booking.";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
