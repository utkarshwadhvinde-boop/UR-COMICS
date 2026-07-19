import { useAuth } from "@/hooks/useAuth";
import { listComicsByCreator } from "@/services/comicsService";
import type { Comic } from "@/types/index";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const paperBg: React.CSSProperties = {
  background: "#f5f0e8",
  backgroundImage: "radial-gradient(circle, #fbbf2440 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  minHeight: "100vh",
};

export function CreatorDashboard() {
  const { user } = useAuth();
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listComicsByCreator(user.id)
      .then((data) => {
        setComics(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div style={{ ...paperBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", border: "4px solid #111", borderTop: "4px solid #cc0000", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "monospace", fontWeight: 900, color: "#111", fontSize: "13px", letterSpacing: "2px" }}>LOADING...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...paperBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <p style={{ color: "#cc0000", fontFamily: "monospace", fontWeight: 900, fontSize: "16px", marginBottom: "16px" }}>Failed to load your comics.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", background: "#111", border: "2px solid #cc0000", color: "#fff", fontFamily: "monospace", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={paperBg}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ background: "#111", padding: "16px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "10px 10px", pointerEvents: "none" }} />
          <p style={{ color: "#cc0000", fontSize: "10px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "3px", margin: "0 0 4px", textTransform: "uppercase" }}>
            Creator Studio
          </p>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 900, fontFamily: "serif", margin: 0 }}>
            My Studio
          </h1>
        </div>

        {/* New Comic button */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <Link
            to="/creator/comics/new"
            style={{ flex: 1, padding: "12px", background: "#cc0000", border: "2px solid #111", color: "#fff", fontFamily: "monospace", fontWeight: 900, fontSize: "13px", textDecoration: "none", textAlign: "center", boxShadow: "4px 4px 0px #111", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            + New Comic
          </Link>
          <Link
            to="/creator/novels/new"
            style={{ flex: 1, padding: "12px", background: "#fff", border: "2px solid #111", color: "#111", fontFamily: "monospace", fontWeight: 900, fontSize: "13px", textDecoration: "none", textAlign: "center", boxShadow: "4px 4px 0px #111", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            + New Novel
          </Link>
        </div>

        {/* Comics list */}
        {comics.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "#fff", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
            <p style={{ color: "#111", fontFamily: "serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No comics yet</p>
            <p style={{ color: "#666", fontFamily: "serif", fontSize: "14px", marginBottom: "24px" }}>Create your first comic and share it with the world!</p>
            <Link
              to="/creator/comics/new"
              style={{ padding: "12px 28px", background: "#cc0000", border: "2px solid #111", color: "#fff", fontFamily: "monospace", fontWeight: 900, textDecoration: "none", boxShadow: "3px 3px 0px #111", textTransform: "uppercase" }}
            >
              Create First Comic
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {comics.map((comic) => (
              <div
                key={comic.id}
                style={{ background: "#fff", border: "2px solid #111", boxShadow: "4px 4px 0px #111", padding: "16px", display: "flex", gap: "16px", alignItems: "flex-start" }}
              >
                {/* Cover */}
                {comic.cover_url ? (
                  <img src={comic.cover_url} alt={comic.title} style={{ width: "60px", height: "80px", objectFit: "cover", border: "2px solid #111", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: "60px", height: "80px", background: "#f5f0e8", border: "2px solid #111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#999", fontSize: "10px", fontFamily: "monospace", textAlign: "center", margin: 0 }}>NO COVER</p>
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#111", fontSize: "16px", fontWeight: 900, fontFamily: "serif", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {comic.title}
                  </p>
                  <p style={{ color: "#666", fontSize: "12px", fontFamily: "serif", margin: "0 0 8px" }}>
                    {comic.description ? comic.description.slice(0, 60) + "..." : "No description"}
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ padding: "2px 8px", background: comic.status === "published" ? "#111" : "#fbbf24", color: comic.status === "published" ? "#fff" : "#111", fontSize: "10px", fontFamily: "monospace", fontWeight: 900, border: "1px solid #111" }}>
                      {comic.status?.toUpperCase() ?? "DRAFT"}
                    </span>
                    {(comic as any).is_ai_generated && (
                      <span style={{ padding: "2px 8px", background: "#cc0000", color: "#fff", fontSize: "10px", fontFamily: "monospace", fontWeight: 900, border: "1px solid #111" }}>
                        AI
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                  <Link
                    to="/creator/comics/$comicId"
                    params={{ comicId: comic.id }}
                    style={{ padding: "6px 12px", background: "#111", border: "2px solid #111", color: "#fff", fontFamily: "monospace", fontWeight: 700, fontSize: "11px", textDecoration: "none", textAlign: "center", boxShadow: "2px 2px 0px #cc0000", textTransform: "uppercase" }}
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
            }
