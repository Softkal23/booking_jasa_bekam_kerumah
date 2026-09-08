import crypto from "node:crypto";

// Jalankan: node scripts/generate-admin-token.js
// Lalu salin hasilnya ke ADMIN_TOKEN di file .env
const token = crypto.randomBytes(32).toString("hex");
console.log("\nADMIN_TOKEN baru (salin ke file .env Anda):\n");
console.log(token);
console.log("");
