import { useState, useRef } from "react";

export default function Gallery({ photos }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef(null);

  const open = (index) => {
    setActiveIndex(index);
    setZoomed(false);
  };
  const close = () => setActiveIndex(null);
  const next = () => setActiveIndex((i) => (i + 1) % photos.length);
  const prev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section id="galeri" className="section section--tight">
      <div className="container">
        <div className="section-head">
          <h2>Dokumentasi bekam</h2>
          <p>Klik foto untuk memperbesar. Semua foto ditampilkan atas izin pelanggan.</p>
        </div>

        <div className="gallery-grid">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              className="gallery-grid__item"
              onClick={() => open(i)}
              aria-label={`Perbesar ${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          ref={(el) => el && el.focus()}
        >
          <button className="lightbox__close" onClick={close} aria-label="Tutup">✕</button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Sebelumnya">‹</button>

          <div className={`lightbox__stage ${zoomed ? "is-zoomed" : ""}`}>
            <img
              ref={imgRef}
              src={photos[activeIndex].src}
              alt={photos[activeIndex].alt}
              onClick={() => setZoomed((z) => !z)}
            />
          </div>

          <button className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Berikutnya">›</button>
          <button className="lightbox__zoom-hint" onClick={() => setZoomed((z) => !z)}>
            {zoomed ? "Perkecil" : "🔍 Zoom"}
          </button>
        </div>
      )}
    </section>
  );
}
