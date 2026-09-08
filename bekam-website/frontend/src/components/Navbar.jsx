export default function Navbar({ onBookingClick }) {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <span className="navbar__logo">BekamCare</span>
        <nav className="navbar__links">
          <a href="#layanan">Layanan</a>
          <a href="#galeri">Galeri</a>
          <a href="#video">Video</a>
          <a href="#tentang">Tentang</a>
        </nav>
        <button className="btn btn-primary navbar__cta" onClick={onBookingClick}>
          Booking Sekarang
        </button>
      </div>
    </header>
  );
}
