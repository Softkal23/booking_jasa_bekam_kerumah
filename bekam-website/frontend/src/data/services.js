// Data ini juga tersedia dari backend (GET /api/services). Dipakai di sini
// sebagai fallback tampilan awal sebelum API selesai dimuat.
export const FALLBACK_SERVICES = [
  { id: "sunnah", name: "Bekam Sunnah", price: 150000, description: "Metode bekam tradisional sesuai sunnah, cocok untuk perawatan rutin." },
  { id: "kering", name: "Bekam Kering", price: 120000, description: "Bekam tanpa sayatan, meredakan pegal dan tegang otot." },
  { id: "basah", name: "Bekam Basah", price: 180000, description: "Bekam dengan pengeluaran darah kotor, ditangani terapis bersertifikat." },
  { id: "keluarga", name: "Paket Keluarga", price: 400000, description: "Bekam untuk 3 anggota keluarga dalam satu kunjungan." },
];

export function formatRupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}
