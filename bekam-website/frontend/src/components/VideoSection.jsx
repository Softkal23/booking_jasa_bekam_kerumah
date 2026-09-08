export default function VideoSection({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section id="video" className="section section--tight video-section">
      <div className="container">
        <div className="section-head">
          <h2>Video proses bekam</h2>
          <p>Lihat bagaimana proses bekam dilakukan secara higienis di rumah pelanggan.</p>
        </div>

        <div className="video-grid">
          {videos.map((v) => (
            <figure className="video-grid__item" key={v.id}>
              {/* autoPlay hanya berjalan di browser jika video muted */}
              <video
                src={v.src}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
              <figcaption>{v.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
