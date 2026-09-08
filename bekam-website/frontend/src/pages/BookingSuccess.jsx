import { PAYMENT_METHODS } from "../data/payment.js";

export default function BookingSuccess({ booking, onBackHome }) {
  return (
    <section className="success">
      <div className="success__card">
        <div className="success__icon">✓</div>
        <h1>Booking berhasil!</h1>
        <p>Terima kasih, pesanan bekam Anda telah diterima. Admin kami akan menghubungi Anda untuk konfirmasi.</p>

        <dl className="success__details">
          <div><dt>Nama</dt><dd>{booking?.name}</dd></div>
          <div><dt>Layanan</dt><dd>{booking?.service}</dd></div>
          <div><dt>Tanggal</dt><dd>{booking?.bookingDate}</dd></div>
          <div><dt>Jam</dt><dd>{booking?.bookingTime}</dd></div>
        </dl>

        <div className="success__payment">
          <h3>Metode pembayaran</h3>
          <ul>
            {PAYMENT_METHODS.map((m) => (
              <li key={m.label}><strong>{m.label}</strong> — {m.detail}</li>
            ))}
          </ul>
          <p className="hint">Konfirmasi pembayaran akan diminta oleh admin saat menghubungi Anda.</p>
        </div>

        <button className="btn btn-primary" onClick={onBackHome}>Kembali ke beranda</button>
      </div>
    </section>
  );
}
