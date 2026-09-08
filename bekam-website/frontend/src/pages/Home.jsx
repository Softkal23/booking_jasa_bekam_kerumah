import { forwardRef } from "react";
import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import Gallery from "../components/Gallery.jsx";
import VideoSection from "../components/VideoSection.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { GALLERY_PHOTOS, GALLERY_VIDEOS } from "../data/gallery.js";

const Home = forwardRef(function Home(
  { services, onBookingClick, defaultServiceId, onBookingSuccess },
  bookingRef
) {
  return (
    <>
      <Hero onBookingClick={onBookingClick} />
      <Services services={services} onBookingClick={onBookingClick} />
      <Gallery photos={GALLERY_PHOTOS} />
      <VideoSection videos={GALLERY_VIDEOS} />

      <section id="booking" ref={bookingRef} className="section booking-section">
        <div className="container">
          <div className="section-head">
            <h2>Booking sekarang</h2>
            <p>Isi data di bawah, pilih tanggal dan jam, tanpa perlu membuat akun.</p>
          </div>
          <BookingForm
            services={services}
            defaultServiceId={defaultServiceId}
            onSuccess={onBookingSuccess}
          />
        </div>
      </section>
    </>
  );
});

export default Home;
