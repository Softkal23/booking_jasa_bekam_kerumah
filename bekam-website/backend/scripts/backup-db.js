import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

// Menyalin file database SQLite ke folder backup dengan nama bertanggal.
// Jalankan manual: node scripts/backup-db.js
// Atau jadwalkan otomatis lewat cron (lihat README bagian "Backup database").
const dbPath = process.env.DB_PATH || "./data/bekam.db";
const backupDir = "./data/backups";

if (!fs.existsSync(dbPath)) {
  console.error(`Database tidak ditemukan di ${dbPath}. Jalankan backend minimal sekali dulu.`);
  process.exit(1);
}

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = path.join(backupDir, `bekam-${timestamp}.db`);

fs.copyFileSync(dbPath, destination);
console.log(`Backup berhasil: ${destination}`);

// Simpan maksimal 30 backup terbaru, hapus yang lebih lama.
const files = fs
  .readdirSync(backupDir)
  .filter((f) => f.endsWith(".db"))
  .sort();

const MAX_BACKUPS = 30;
if (files.length > MAX_BACKUPS) {
  const toDelete = files.slice(0, files.length - MAX_BACKUPS);
  for (const f of toDelete) fs.unlinkSync(path.join(backupDir, f));
  console.log(`Menghapus ${toDelete.length} backup lama.`);
}
