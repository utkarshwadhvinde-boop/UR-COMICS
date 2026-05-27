import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Search, TrendingUp, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { AdBanner } from "../components/AdBanner";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../hooks/useAuth";
import { useComics } from "../hooks/useComics";
import { useComicsByGenre, useGenres, useSearchComics } from "../hooks/useGenres";
import { useResumeReading, useTrending as useTrendingComics } from "../hooks/useTrending";
import { sanitizeSearch } from "../lib/utils";
import type { Comic, Genre } from "../types/index";

const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden" as const,
    background: "linear-gradient(160deg, #000 0%, #0d0118 50%, #1a0b2e 80%, #000 100%)",
    position: "relative" as const,
    boxSizing: "border-box" as const,
  },
  bg: {
    position: "fixed" as const,
    inset: 0,
    pointerEvents: "none" as const,
    zIndex: 0,
    overflow: "hidden",
  },
  content: {
    position: "relative" as const,
    zIndex: 1,
    width: "100%",
    padding: "16px 16px 80px",
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "36px",
  },
};

// ─── Background ───────────────────────────────────────────────
function BgGlow() {
  return (
    <div style={S.bg}>
      <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #7c3aed, transparent 70%)", opacity: 0.18 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, #4f46e5, transparent 70%)", opacity: 0.14 }} />
    </div>
  );
}

// ─── 3D Comic Card ────────────────────────────────────────────
function ComicCard({ comic, index = 0 }: { comic: Comic; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (x: number, y: number, rect: DOMRect) => {
    if (!ref.current) return;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    ref.current.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    ref.current.style.boxShadow = `${-ry * 2}px ${rx * 2}px 32px rgba(124,58,237,0.55)`;
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)";
    ref.current.style.boxShadow = "0 0 14px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.18)";
  };

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", textDecoration: "none", animationDelay: `${Math.min(index * 0.05, 0.35)}s`, animation: "fadeUp 0.4s ease both" }}
    >
      <div
        ref={ref}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); tilt(e.clientX - r.left, e.clientY - r.top, r); }}
        onMouseLeave={reset}
        onTouchMove={(e) => { e.stopPropagation(); const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect(); tilt(t.clientX - r.left, t.clientY - r.top, r); }}
        onTouchEnd={reset}
        style={{
          width: "100%",
          aspectRatio: "9/14",
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          background: "#0d0118",
          boxShadow: "0 0 14px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.18)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          willChange: "transform",
          cursor: "pointer",
        }}
      >
        {comic.cover_url
          ? <img src={comic.cover_url} alt={comic.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 28, height: 28, color: "#a855f7" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, borderRadius: "14px", boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.3)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 10px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5) 60%, transparent)" }}>
          <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{comic.title}</p>
          <p style={{ color: "rgba(196,168,255,0.65)", fontSize: "11px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Trending Card ────────────────────────────────────────────
function TrendingCard({ comic, index = 0 }: { comic: Comic; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const baseTilt = [-4, 0, 4][index % 3];

  const tilt = (x: number, y: number, rect: DOMRect) => {
    if (!ref.current) return;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -13;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 13;
    ref.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.06)`;
    ref.current.style.boxShadow = `${-ry * 2}px ${rx * 2}px 40px rgba(124,58,237,0.65)`;
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(800px) rotateZ(${baseTilt}deg)`;
    ref.current.style.boxShadow = "0 8px 28px rgba(124,58,237,0.35), 0 0 0 1px rgba(139,92,246,0.25)";
  };

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", flexShrink: 0, width: "42vw", maxWidth: "180px", textDecoration: "none" }}
    >
      <div
        ref={ref}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); tilt(e.clientX - r.left, e.clientY - r.top, r); }}
        onMouseLeave={reset}
        onTouchMove={(e) => { e.stopPropagation(); const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect(); tilt(t.clientX - r.left, t.clientY - r.top, r); }}
        onTouchEnd={reset}
        style={{
          width: "100%",
          aspectRatio: "9/14",
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          background: "#0d0118",
          transform: `perspective(800px) rotateZ(${baseTilt}deg)`,
          boxShadow: "0 8px 28px rgba(124,58,237,0.35), 0 0 0 1px rgba(139,92,246,0.25)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          willChange: "transform",
          cursor: "pointer",
          animation: `floatCard ${3 + index * 0.5}s ease-in-out ${index * 0.2}s infinite`,
        }}
      >
        {comic.cover_url
          ? <img src={comic.cover_url} alt={comic.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.15)" }}>
              <BookOpen style={{ width: 28, height: 28, color: "#a855f7" }} />
            </div>
        }
        <div style={{ position: "absolute", top: 8, left: 8, width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", boxShadow: "0 0 12px rgba(124,58,237,0.8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 900 }}>
          {index + 1}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 10px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)" }}>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{comic.title}</p>
          <p style={{ color: "rgba(196,168,255,0.6)", fontSize: "10px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ title, icon, showMore = true }: { title: string; icon: React.ReactNode; showMore?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
      <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 900, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
        {icon}
        <span style={{ background: "linear-gradient(90deg, #fff 0%, #c4b5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {title}
        </span>
      </h2>
      {showMore && (
        <Link to="/trending" style={{ color: "#a855f7", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
          More <ChevronRight style={{ width: 13, height: 13 }} />
        </Link>
      )}
    </div>
  );
}

// ─── Comic Grid (always 2 cols) ───────────────────────────────
function ComicGrid({ comics, loading }: { comics: Comic[]; loading?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%" }}>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "9/14", borderRadius: "14px", background: "rgba(124,58,237,0.1)", animation: "pulse 1.5s ease infinite" }} />
          ))
        : comics.map((comic, i) => <ComicCard key={comic.id} comic={comic} index={i} />)}
    </div>
  );
}

// ─── Genre Section ────────────────────────────────────────────
function GenreSection({ genre }: { genre: Genre }) {
  const { data: comics = [], isLoading } = useComicsByGenre(genre.id);
  if (!isLoading && comics.length === 0) return null;
  return (
    <section>
      <SectionHeader title={genre.name} icon={<span style={{ color: "#a855f7" }}>◆</span>} />
      <ComicGrid comics={comics.slice(0, 8)} loading={isLoading} />
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────
export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: genres = [] } = useGenres();
  const { data: newArrivals = [], isLoading: newLoading } = useComics();
  const { data: trending = [] } = useTrendingComics(6);
  const { data: resumeComics = [] } = useResumeReading(user?.id);
  const { data: searchResults = [] } = useSearchComics(searchQuery);

  return (
    <div style={S.page}>
      <BgGlow />

      {/* Hero */}
      {!isAuthenticated && (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "72px 20px 48px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(124,58,237,0.2), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", marginBottom: "16px", padding: "7px 18px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.1)", color: "#c4b5fd", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" as const }}>
              🔥 New Chapters Daily
            </div>
            <h1 style={{ fontSize: "clamp(48px, 13vw, 72px)", fontWeight: 900, color: "#fff", margin: "0 0 14px", lineHeight: 1, letterSpacing: "-1px" }}>
              UR{" "}
              <span style={{ background: "linear-gradient(135deg, #a855f7, #c4b5fd, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                COMICS
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", maxWidth: "320px", margin: "0 auto 32px", lineHeight: 1.6 }}>
              Discover and read thousands of webtoons &amp; manhwa from creators worldwide.
            </p>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              style={{ padding: "14px 36px", borderRadius: "14px", fontWeight: 900, color: "#fff", fontSize: "16px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", cursor: "pointer", boxShadow: "0 0 32px rgba(124,58,237,0.45)" }}
            >
              Get Started — It&apos;s Free
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={S.content}>

        {/* Ad 728x90 desktop only */}
        <div className="hidden sm:flex justify-center">
          <AdBanner adKey="0411000e4f313322c3ae696f00a3d412" width={728} height={90} />
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "100%", boxSizing: "border-box" as const }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeSearch(e.target.value))}
            placeholder="Search comics, creators, genres..."
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box" as const,
              paddingLeft: "44px",
              paddingRight: "16px",
              paddingTop: "14px",
              paddingBottom: "14px",
              borderRadius: "14px",
              background: "rgba(124,58,237,0.09)",
              border: "1px solid rgba(124,58,237,0.28)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <section>
            <SectionHeader title={`"${searchQuery}"`} icon={<Search style={{ width: 18, height: 18, color: "#a855f7" }} />} showMore={false} />
            {searchResults.length === 0
              ? <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>No comics found.</p>
              : <ComicGrid comics={searchResults} />}
          </section>
        )}

        {/* Continue Reading */}
        {isAuthenticated && resumeComics.length > 0 && (
          <section>
            <SectionHeader title="Continue Reading" icon={<Zap style={{ width: 18, height: 18, color: "#facc15" }} />} showMore={false} />
            <ComicGrid comics={resumeComics} />
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <SectionHeader title="Trending Now" icon={<TrendingUp style={{ width: 18, height: 18, color: "#fb923c" }} />} />
            <div style={{
              borderRadius: "18px",
              padding: "20px 16px",
              background: "rgba(124,58,237,0.07)",
              border: "1px solid rgba(124,58,237,0.18)",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch" as const,
              touchAction: "pan-x" as const,
            }}>
              <div style={{ display: "flex", gap: "20px", width: "max-content", alignItems: "flex-end", paddingBottom: "4px" }}>
                {trending.map((comic, i) => (
                  <TrendingCard key={comic.id} comic={comic} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ad 300x250 */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <AdBanner adKey="fb37617b5e2f1213963184b0b6221dee" width={300} height={250} />
        </div>

        {/* New Arrivals */}
        <section>
          <SectionHeader title="New Arrivals" icon={<span style={{ color: "#4ade80" }}>✦</span>} showMore={false} />
          <ComicGrid comics={newArrivals.slice(0, 18)} loading={newLoading} />
        </section>

        {/* Genres */}
        {genres.map((genre, idx) => (
          <div key={genre.id}>
            <GenreSection genre={genre} />
            {idx === 1 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "36px" }}>
                <AdBanner adKey="e70aff455b682d8f9c0eed8f01af1f25" width={160} height={600} />
              </div>
            )}
          </div>
        ))}

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatCard {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -8px; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        * { box-sizing: border-box; }
      `}</style>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
          }
