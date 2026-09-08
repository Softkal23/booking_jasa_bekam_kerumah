# BekamCare — Website Bekam Panggilan ke Rumah

Project ini terdiri dari 2 bagian:

- `frontend/` — React (Vite), tampilan website + form booking
- `backend/` — Node.js + Express + SQLite, API booking dengan validasi & anti double-booking

## Menjalankan backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend berjalan di `http://localhost:4000`. Database SQLite otomatis dibuat di `backend/data/bekam.db`.

## Menjalankan frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Mengganti foto & video

Letakkan file asli Anda di:
- `frontend/public/images/gallery-1.jpg` dst.
- `frontend/public/videos/proses-bekam.mp4`

Nama file mengikuti yang ada di `frontend/src/data/gallery.js` — sesuaikan jika berbeda.

## Kontak yang sudah diisi

- WhatsApp: 0838-9908-4253
- Email admin: haikalabdn00@gmail.com

Diatur di `frontend/src/components/Footer.jsx`, `frontend/src/components/WhatsAppButton.jsx`, dan `backend/.env` (`ADMIN_WHATSAPP`, `ADMIN_EMAIL`).

## Fitur yang sudah disempurnakan

- **Notifikasi admin otomatis** (`backend/src/notify.js`): setiap booking baru dicatat ke console + link WhatsApp siap-klik. Kalau `SMTP_USER` dan `SMTP_APP_PASSWORD` diisi di `.env` (App Password Gmail), email juga terkirim otomatis ke `ADMIN_EMAIL`.
- **Kalender menandai tanggal penuh**: endpoint baru `GET /api/availability/month` mengembalikan tanggal yang semua jamnya sudah terisi, otomatis dicoret di kalender.
- **Honeypot anti-bot**: field tersembunyi `website` di form booking. Kalau terisi (biasanya oleh bot), request ditolak diam-diam.
- **Dashboard admin** (`frontend/public/admin.html`): buka `http://localhost:5173/admin.html`, masukkan `ADMIN_TOKEN` dari `.env` backend, lihat semua booking dan ubah status (pending/confirmed/completed/cancelled).

## Setup App Password Gmail (untuk notifikasi email)

1. Aktifkan verifikasi 2 langkah di akun Gmail pengirim.
2. Buka https://myaccount.google.com/apppasswords, buat App Password baru.
3. Isi `SMTP_USER` (email pengirim) dan `SMTP_APP_PASSWORD` (16 digit dari Google) di `backend/.env`.
4. Restart backend (`npm run dev`).

Jika SMTP tidak diisi, sistem tetap berjalan normal — notifikasi hanya muncul di log server + link WhatsApp.

## Backup database

```bash
cd backend
npm run backup
```

Menyalin `data/bekam.db` ke `data/backups/` dengan nama bertanggal, menyimpan maksimal 30 backup terbaru. Untuk otomatis tiap hari, tambahkan ke crontab server:

```
0 2 * * * cd /path/ke/backend && npm run backup
```

## Membuat ADMIN_TOKEN yang aman

```bash
cd backend
npm run generate-admin-token
```

Salin hasilnya ke `ADMIN_TOKEN` di `.env`. Jangan pakai nilai placeholder bawaan.

## Mengaktifkan CAPTCHA (Cloudflare Turnstile)

1. Daftar gratis di https://dash.cloudflare.com/?to=/:account/turnstile, buat widget baru.
2. Isi `TURNSTILE_SECRET_KEY` di `backend/.env`.
3. Isi `VITE_TURNSTILE_SITE_KEY` di `frontend/.env`.
4. Restart frontend & backend. Widget CAPTCHA otomatis muncul di form booking.

Kalau kedua key dikosongkan, form tetap berfungsi normal tanpa CAPTCHA (honeypot tetap aktif).

## Metode pembayaran

Edit `frontend/src/data/payment.js` — isi dengan nomor rekening/e-wallet asli Anda. Tampil otomatis di halaman sukses booking.

## Deploy ke hosting

**Backend** (Node + SQLite) — cocok di Railway atau Render:
- Hubungkan repo, set root directory `backend`, build command `npm install`, start command `npm start`.
- `backend/Dockerfile` sudah disediakan kalau hosting Anda butuh Docker.
- Isi semua environment variable dari `.env.example` di dashboard hosting.
- Pastikan `ALLOWED_ORIGIN` diisi domain frontend production (bukan localhost).

**Frontend** (React/Vite) — cocok di Vercel atau Netlify:
- Root directory `frontend`, build command `npm run build`, output folder `dist`.
- Isi `VITE_API_URL` dengan URL backend production (harus HTTPS).
- Setelah deploy, dashboard admin bisa diakses di `https://domain-anda.com/admin.html`.

Kedua platform di atas otomatis memberi HTTPS gratis.

## Catatan keamanan yang sudah diterapkan

- Validasi input dilakukan di **frontend** (UX) dan **backend** (keamanan) — backend tidak percaya data dari client.
- Booking memakai `UNIQUE(booking_date, booking_time)` di database → mencegah dua orang memesan slot yang sama (double booking), walau request datang hampir bersamaan.
- Rate limiting (5 percobaan/10 menit per IP) pada endpoint order untuk mencegah spam/bot.
- Header keamanan dasar via `helmet`, CORS dibatasi ke origin frontend.
- Input dibersihkan dari karakter `<` `>` untuk mengurangi risiko XSS; React juga meng-escape output secara default.
- Tidak ada API key/secret yang disimpan di kode frontend — semua ada di `.env` backend (jangan commit file ini).
- Tidak ada fitur login/password sama sekali, sesuai permintaan.
- Verifikasi CAPTCHA (Cloudflare Turnstile) di backend, aktif otomatis begitu key diisi.
- Dashboard admin dilindungi token rahasia (`ADMIN_TOKEN`), tidak bisa diakses publik.

## Yang masih perlu ditambahkan sebelum production

- Foto & video di galeri masih placeholder — ganti dengan dokumentasi asli.
- Ganti dashboard admin dari token statis menjadi login yang lebih kuat kalau tim admin lebih dari satu orang.
- Isi rekening/e-wallet asli di `frontend/src/data/payment.js`.
