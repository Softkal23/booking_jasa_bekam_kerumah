import { formatRupiah } from "../data/services.js";

const HIGHLIGHTS = [
  { title: "Datang ke rumah", desc: "Tidak perlu keluar rumah, terapis datang ke lokasi Anda." },
  { title: "Booking mudah", desc: "Pilih sendiri tanggal dan jam yang tersedia." },
  { title: "Terapis profesional", desc: "Ditangani terapis berpengalaman dan bersertifikat." },
  { title: "Higienis", desc: "Alat steril, sekali pakai untuk setiap pelanggan." },
];

export default function Services({ services, onBookingClick }) {
  return (
    <section id="layanan" className="section">
      <div className="container">
        <div className="highlights">
          {HIGHLIGHTS.map((h) => (
            <div className="highlights__item" key={h.title}>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="section-head">
          <h2>Pilihan layanan</h2>
          <p>Semua layanan sudah termasuk kunjungan terapis dan peralatan.</p>
        </div>

        <div className="service-grid">
          {services.map((s) => (
            <div className="service-card" key={s.id}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <div className="service-card__footer">
                <span className="service-card__price">{formatRupiah(s.price)}</span>
                <button className="btn btn-outline" onClick={() => onBookingClick(s.id)}>
                  Pilih
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
