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

// ─── Floating Bubbles ─────────────────────────────────────────
function FloatingBubbles() {
  const bubbles = [
    { text: "💭", size: 52, x: 5, delay: 0, duration: 9 },
    { text: "💬", size: 44, x: 20, delay: 2, duration: 11 },
    { text: "💭", size: 60, x: 72, delay: 1, duration: 10 },
    { text: "💬", size: 48, x: 88, delay: 3, duration: 8 },
    { text: "💭", size: 40, x: 50, delay: 4, duration: 12 },
    { text: "💬", size: 56, x: 62, delay: 5, duration: 9 },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            bottom: "-80px",
            left: `${b.x}%`,
            fontSize: `${b.size}px`,
            animation: `floatUp ${b.duration}s linear ${b.delay}s infinite`,
            filter: "drop-shadow(0 0 10px rgba(139,92,246,0.7))",
            opacity: 0.3,
            willChange: "transform",
          }}
        >
          {b.text}
        </div>
      ))}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
    </div>
  );
}

// ─── 3D Comic Card ────────────────────────────────────────────
function ComicCard({ comic, index = 0 }: { comic: Comic; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const applyTilt = (x: number, y: number, rect: DOMRect) => {
    const card = cardRef.current;
    if (!card) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -12;
    const ry = ((x - cx) / cx) * 12;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
    card.style.boxShadow = `${-ry * 2}px ${rx * 2}px 40px rgba(124,58,237,0.6)`;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.boxShadow = "0 0 16px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.2)";
  };

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      className="block"
      style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
    >
      <div
        ref={cardRef}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); applyTilt(e.clientX - r.left, e.clientY - r.top, r); }}
        onMouseLeave={resetTilt}
        onTouchMove={(e) => { e.stopPropagation(); const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect(); applyTilt(t.clientX - r.left, t.clientY - r.top, r); }}
        onTouchEnd={resetTilt}
        style={{
          aspectRatio: "9/14",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 16px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.2)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          willChange: "transform",
          background: "#0d0118",
        }}
      >
        {comic.cover_url
          ? <img src={comic.cover_url} alt={comic.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 32, height: 32, color: "#a855f7" }} />
            </div>
        }
        {/* Neon border */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "16px", boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.35)", pointerEvents: "none" }} />
        {/* Bottom gradient */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
          padding: "12px 10px 10px",
        }}>
          <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{comic.title}</p>
          <p style={{ color: "rgba(196,168,255,0.7)", fontSize: "11px", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Trending Card ────────────────────────────────────────────
function TrendingCard({ comic, index = 0 }: { comic: Comic; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const baseTilt = [-5, 0, 5][index % 3];

  const applyTilt = (x: number, y: number, rect: DOMRect) => {
    const card = cardRef.current;
    if (!card) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -15;
    const ry = ((x - cx) / cx) * 15;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.07)`;
    card.style.boxShadow = `${-ry * 3}px ${rx * 3}px 50px rgba(124,58,237,0.75)`;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(900px) rotateZ(${baseTilt}deg)`;
    card.style.boxShadow = "0 10px 35px rgba(124,58,237,0.35), 0 0 0 1px rgba(139,92,246,0.25)";
  };

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", flexShrink: 0, width: "140px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); applyTilt(e.clientX - r.left, e.clientY - r.top, r); }}
        onMouseLeave={resetTilt}
        onTouchMove={(e) => { e.stopPropagation(); const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect(); applyTilt(t.clientX - r.left, t.clientY - r.top, r); }}
        onTouchEnd={resetTilt}
        style={{
          aspectRatio: "9/14",
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          transform: `perspective(900px) rotateZ(${baseTilt}deg)`,
          boxShadow: "0 10px 35px rgba(124,58,237,0.35), 0 0 0 1px rgba(139,92,246,0.25)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          willChange: "transform",
          background: "#0d0118",
          animation: `floatCard ${3 + index * 0.4}s ease-in-out ${index * 0.25}s infinite`,
        }}
      >
        {comic.cover_url
          ? <img src={comic.cover_url} alt={comic.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.2)" }}>
              <BookOpen style={{ width: 28, height: 28, color: "#a855f7" }} />
            </div>
        }
        {/* Rank badge */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
          boxShadow: "0 0 14px rgba(124,58,237,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "12px", fontWeight: 900,
        }}>
          {index + 1}
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)",
          padding: "10px 8px 8px",
        }}>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{comic.title}</p>
          <p style={{ color: "rgba(196,168,255,0.65)", fontSize: "10px", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "18px", fontWeight: 900, color: "#fff" }}>
        {icon}
        <span style={{ background: "linear-gradient(to right, #fff, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {title}
        </span>
      </h2>
      {showMore && (
        <Link to="/trending" style={{ color: "#a855f7", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
          More <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      )}
    </div>
  );
}

// ─── Comic Grid ───────────────────────────────────────────────
function ComicGrid({ comics, loading }: { comics: Comic[]; loading?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "9/14", borderRadius: "16px", background: "rgba(124,58,237,0.1)", animation: "pulse 1.5s ease infinite" }} />
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
      <SectionHeader title={genre.name} icon={<span style={{ color: "#a855f7", fontSize: "16px" }}>◆</span>} />
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
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: "linear-gradient(160deg, #000 0%, #0d0118 45%, #1a0b2e 75%, #000 100%)", position: "relative" }}>
      <FloatingBubbles />

      {/* Hero */}
      {!isAuthenticated && (
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "80px 24px 60px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(124,58,237,0.25), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", marginBottom: "20px", padding: "8px 20px", borderRadius: "999px", border: "1px solid rgba(124,58,237,0.35)", background: "rgba(124,58,237,0.12)", color: "#c4b5fd", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
              🔥 New Chapters Daily
            </div>
            <h1 style={{ fontSize: "clamp(52px, 14vw, 80px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1, letterSpacing: "-2px" }}>
              UR{" "}
              <span style={{ background: "linear-gradient(135deg, #a855f7, #c4b5fd, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 24px rgba(139,92,246,0.8))" }}>
                COMICS
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", maxWidth: "380px", margin: "0 auto 40px", lineHeight: 1.6 }}>
              Discover and read thousands of webtoons &amp; manhwa from creators worldwide.
            </p>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              style={{ padding: "16px 40px", borderRadius: "16px", fontWeight: 900, color: "#fff", fontSize: "17px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", cursor: "pointer", boxShadow: "0 0 40px rgba(124,58,237,0.5)", transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Get Started — It&apos;s Free
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "520px", margin: "0 auto", padding: "0 16px 80px", display: "flex", flexDirection: "column", gap: "40px" }}>

        {/* Ad 728x90 */}
        <div style={{ display: "none" }} className="sm:flex justify-center">
          <AdBanner adKey="0411000e4f313322c3ae696f00a3d412" width={728} height={90} />
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "100%" }}>
          <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", color: "rgba(255,255,255,0.35)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeSearch(e.target.value))}
            placeholder="Search comics, creators, genres..."
            style={{
              width: "100%",
              paddingLeft: "48px",
              paddingRight: "16px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "16px",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              backdropFilter: "blur(8px)",
            }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <section>
            <SectionHeader title={`"${searchQuery}"`} icon={<Search style={{ width: 18, height: 18, color: "#a855f7" }} />} showMore={false} />
            {searchResults.length === 0
              ? <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>No comics found.</p>
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
              borderRadius: "20px",
              padding: "20px 16px",
              background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(109,40,217,0.05))",
              border: "1px solid rgba(124,58,237,0.2)",
              backdropFilter: "blur(8px)",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}>
              <div style={{ display: "flex", gap: "24px", paddingBottom: "8px", width: "max-content" }}>
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
          <SectionHeader title="New Arrivals" icon={<span style={{ color: "#4ade80", fontSize: "18px" }}>✦</span>} showMore={false} />
          <ComicGrid comics={newArrivals.slice(0, 18)} loading={newLoading} />
        </section>

        {/* Genres */}
        {genres.map((genre, idx) => (
          <div key={genre.id} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <GenreSection genre={genre} />
            {idx === 1 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
                <AdBanner adKey="e70aff455b682d8f9c0eed8f01af1f25" width={160} height={600} />
              </div>
            )}
          </div>
        ))}

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0.3; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
        @keyframes floatCard {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -8px; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        input::placeholder { color: rgba(255,255,255,0.35); }
        ::-webkit-scrollbar { height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 4px; }
      `}</style>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
                            }
