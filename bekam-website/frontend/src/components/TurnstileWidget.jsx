import { useEffect, useRef } from "react";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

// Widget CAPTCHA Cloudflare Turnstile. Kalau VITE_TURNSTILE_SITE_KEY kosong,
// komponen ini tidak menampilkan apa pun dan form tetap berfungsi normal
// (backend akan otomatis melewati verifikasi CAPTCHA juga saat itu).
export default function TurnstileWidget({ onToken }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) return;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onToken(token),
          "expired-callback": () => onToken(""),
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    }
  }, [onToken]);

  if (!SITE_KEY) return null;

  return <div className="field" ref={containerRef} />;
}
