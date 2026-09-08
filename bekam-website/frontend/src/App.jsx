import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import Home from "./pages/Home.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import { fetchServices } from "./services/bookingApi.js";
import { FALLBACK_SERVICES } from "./data/services.js";

export default function App() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [defaultServiceId, setDefaultServiceId] = useState("");
  const [completedBooking, setCompletedBooking] = useState(null);
  const bookingRef = useRef(null);

  useEffect(() => {
    fetchServices()
      .then((res) => res.services && setServices(res.services))
      .catch(() => {
        // API belum berjalan, tetap tampilkan data fallback.
      });
  }, []);

  const scrollToBooking = (serviceId = "") => {
    if (serviceId) setDefaultServiceId(serviceId);
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookingSuccess = (booking) => {
    setCompletedBooking(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackHome = () => {
    setCompletedBooking(null);
    window.scrollTo({ top: 0 });
  };

  if (completedBooking) {
    return <BookingSuccess booking={completedBooking} onBackHome={handleBackHome} />;
  }

  return (
    <>
      <Navbar onBookingClick={() => scrollToBooking()} />
      <Home
        ref={bookingRef}
        services={services}
        defaultServiceId={defaultServiceId}
        onBookingClick={scrollToBooking}
        onBookingSuccess={handleBookingSuccess}
      />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
