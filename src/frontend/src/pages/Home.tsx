import { BookOpen, Zap } from "lucide-react";

export function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0a0010",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
          padding: "28px",
          borderRadius: "16px",
          background: "linear-gradient(180deg, #1a0b2e 0%, #0a0010 100%)",
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 0 20px rgba(124,58,237,0.15)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 16px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <Zap style={{ color: "#a855f7", width: 28, height: 28 }} />
        </div>

        {/* Title */}
        <h1
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: 800,
            marginBottom: "10px",
          }}
        >
          Under Maintenance
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "18px",
          }}
        >
          We are currently improving UR-COMICS to bring a faster, smoother and
          better reading experience.
        </p>

        {/* Loader */}
        <div
          style={{
            width: "40px",
            height: "40px",
            margin: "0 auto 18px",
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTop: "3px solid #a855f7",
            animation: "spin 1s linear infinite",
          }}
        />

        {/* Info box */}
        <div
          style={{
            padding: "14px",
            borderRadius: "12px",
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            UR-COMICS is temporarily unavailable. All data and chapters are safe
            and will be restored shortly.
          </p>
        </div>

        {/* Small footer */}
        <p
          style={{
            marginTop: "14px",
            fontSize: "11px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Please check back soon
        </p>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
