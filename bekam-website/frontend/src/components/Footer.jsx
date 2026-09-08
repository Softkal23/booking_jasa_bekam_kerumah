export default function Footer() {
  return (
    <footer id="tentang" className="footer">
      <div className="container footer__inner">
        <div>
          <span className="footer__logo">BekamCare</span>
          <p>Layanan bekam panggilan ke rumah. Higienis, profesional, dan mudah dipesan.</p>
        </div>
        <div>
          <h3>Jam operasional</h3>
          <p>Setiap hari, 08.00 – 20.00</p>
        </div>
        <div>
          <h3>Kontak</h3>
          <p>WhatsApp: 0838-9908-4253</p>
          <p>Email: haikalabdn00@gmail.com</p>
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} BekamCare. Semua hak dilindungi.</p>
    </footer>
  );
}
