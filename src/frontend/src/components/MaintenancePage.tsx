import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-07-05T00:00:00");

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function MaintenancePage() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0010",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "sans-serif",
    }}>
      {/* Logo */}
      <img
        src="/assets/IMG-20260428-WA0003.jpg"
        alt="UR COMICS"
        style={{ width: "80px", height: "80px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}
      />

      <h1 style={{ fontSize: "36px", fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center" }}>
        UR <span style={{ color: "#a855f7" }}>COMICS</span>
      </h1>

      <p style={{ color: "#a855f7", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 32px" }}>
        🔧 Under Maintenance
      </p>

      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", textAlign: "center", maxWidth: "320px", lineHeight: 1.6, margin: "0 0 40px" }}>
        We're upgrading our servers to serve you better. We'll be back on <strong style={{ color: "#fff" }}>July 5, 2026</strong>!
      </p>

      {/* Countdown */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
        {[
          { label: "Days", value: time.days },
          { label: "Hours", value: time.hours },
          { label: "Minutes", value: time.minutes },
          { label: "Seconds", value: time.seconds },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
              color: "#fff",
              boxShadow: "0 0 20px rgba(124,58,237,0.2)",
            }}>
              {String(value).padStart(2, "0")}
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "6px 0 0", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Social links */}
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center" }}>
        Follow us on Instagram{" "}
        <a
          href="https://instagram.com/ur.comics"
          style={{ color: "#a855f7", textDecoration: "none", fontWeight: 700 }}
          target="_blank"
          rel="noreferrer"
        >
          @ur.comics
        </a>
        {" "}for updates! 
      </p>
    </div>
  );
}
