import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import "dotenv/config";

const dbPath = process.env.DB_PATH || "./data/bekam.db";
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Tabel booking. UNIQUE(booking_date, booking_time) mencegah double booking
// di level database, bukan hanya di frontend.
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    street_address TEXT NOT NULL,
    address_detail TEXT,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(booking_date, booking_time)
  );
`);

export const SERVICES = [
  { id: "sunnah", name: "Bekam Sunnah", price: 150000, description: "Metode bekam tradisional sesuai sunnah, cocok untuk perawatan rutin." },
  { id: "kering", name: "Bekam Kering", price: 120000, description: "Bekam tanpa sayatan, meredakan pegal dan tegang otot." },
  { id: "basah", name: "Bekam Basah", price: 180000, description: "Bekam dengan pengeluaran darah kotor, ditangani terapis bersertifikat." },
  { id: "keluarga", name: "Paket Keluarga", price: 400000, description: "Bekam untuk 3 anggota keluarga dalam satu kunjungan." },
];

export const TIME_SLOTS = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00", "19:00"];
