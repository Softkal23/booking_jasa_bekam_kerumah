export default function Hero({ onBookingClick }) {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__eyebrow">Bekam panggilan ke rumah</p>
          <h1 className="hero__title">
            Terapi bekam yang tenang, di rumah Anda sendiri
          </h1>
          <p className="hero__desc">
            Pilih tanggal dan jam yang cocok, terapis bersertifikat datang
            langsung membawa peralatan steril. Tanpa perlu keluar rumah,
            tanpa perlu daftar akun.
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary" onClick={onBookingClick}>
              Booking Sekarang
            </button>
            <a href="#layanan" className="btn btn-ghost">Lihat Layanan</a>
          </div>
        </div>
        <div className="hero__mark" aria-hidden="true">
          <div className="hero__circle hero__circle--1" />
          <div className="hero__circle hero__circle--2" />
          <div className="hero__circle hero__circle--3" />
        </div>
      </div>
    </section>
  );
}
