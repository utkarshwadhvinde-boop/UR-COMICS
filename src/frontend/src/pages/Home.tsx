import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Search, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { AdBanner } from "../components/AdBanner";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../hooks/useAuth";
import { useComics } from "../hooks/useComics";
import { useComicsByGenre, useGenres, useSearchComics } from "../hooks/useGenres";
import { useResumeReading, useTrending as useTrendingComics } from "../hooks/useTrending";
import { sanitizeSearch } from "../lib/utils";
import type { Comic, Genre } from "../types/index";

// ─── Halftone + Paper texture styles ─────────────────────────
const globalStyles = `
  * { box-sizing: border-box; }
  input::placeholder { color: #999; }
  @keyframes speedLines {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: scale(1.2); }
  }
  .comic-card:hover .speed-lines { opacity: 1; }
  .comic-card { transition: transform 0.15s ease; }
  .comic-card:hover { transform: translateY(-4px); }
`;

const paperBg = {
  background: "#f5f0e8",
  backgroundImage: `
    radial-gradient(circle, #fbbf24 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0",
};

// ─── Comic Card ───────────────────────────────────────────────
function ComicCard({ comic, rank, isNew }: { comic: Comic; rank?: number; isNew?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div
        className="comic-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          aspectRatio: "9/14",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
          background: "#fff",
          border: "2px solid #111",
          boxShadow: hovered ? "6px 6px 0px #111" : "3px 3px 0px #111",
          transition: "box-shadow 0.15s ease, transform 0.15s ease",
        }}
      >
        {/* Speed lines on hover */}
        {hovered && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
            background: `repeating-conic-gradient(#11111108 0deg, transparent 1deg, transparent 5deg)`,
            opacity: 0.6,
          }} />
        )}

        {comic.cover_url
          ? <img
              src={comic.cover_url}
              alt={comic.title}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#f5f0e8" }}
              loading="lazy"
            />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f0e8" }}>
              <BookOpen style={{ width: 24, height: 24, color: "#cc0000" }} />
            </div>
        }

        {/* Rank badge */}
        {rank !== undefined && (
          <div style={{
            position: "absolute", top: 6, left: 6,
            width: 26, height: 26, borderRadius: "50%",
            background: "#cc0000",
            border: "2px solid #111",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "11px", fontWeight: 900,
            fontFamily: "monospace",
          }}>
            {rank}
          </div>
        )}

        {/* NEW stamp */}
        {isNew && (
          <div style={{
            position: "absolute", top: 6, right: 6,
            padding: "2px 6px",
            background: "#cc0000",
            border: "2px solid #111",
            color: "#fff", fontSize: "9px", fontWeight: 900,
            letterSpacing: "1px", fontFamily: "monospace",
            transform: "rotate(3deg)",
          }}>
            NEW
          </div>
        )}

        {/* AI badge */}
        {(comic as any).is_ai_generated && (
          <div style={{
            position: "absolute", bottom: 28, right: 6,
            padding: "2px 6px",
            background: "#111",
            border: "1px solid #fff",
            color: "#fff", fontSize: "9px", fontWeight: 800,
          }}>
            AI
          </div>
        )}

        {/* Bottom info */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "6px 8px",
          background: "#111",
          borderTop: "2px solid #111",
        }}>
          <p style={{ color: "#fff", fontSize: "11px", fontWeight: 800, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "monospace" }}>
            {comic.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ title, showMore = true, moreTo = "/trending" }: {
  title: string;
  icon?: React.ReactNode;
  showMore?: boolean;
  moreTo?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "3px solid #111", paddingBottom: "8px" }}>
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#111", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "serif" }}>
        {title}
      </h2>
      {showMore && (
        <Link to={moreTo} style={{ color: "#cc0000", fontSize: "12px", textDecoration: "none", fontWeight: 800, display: "flex", alignItems: "center", gap: "2px", fontFamily: "monospace" }}>
          More <ChevronRight style={{ width: 13, height: 13 }} />
        </Link>
      )}
    </div>
  );
}

// ─── Comic Grid ───────────────────────────────────────────────
function ComicGrid({ comics, loading, withRank = false, withNew = false }: {
  comics: Comic[];
  loading?: boolean;
  withRank?: boolean;
  withNew?: boolean;
}) {
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: "9/14", borderRadius: "4px", background: "#e5e0d8", border: "2px solid #ccc" }} />
        ))}
      </div>
    );
  }
  if (comics.length === 0) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {comics.map((comic, i) => (
        <ComicCard key={comic.id} comic={comic} rank={withRank ? i + 1 : undefined} isNew={withNew} />
      ))}
    </div>
  );
}

// ─── Torn Paper Divider ───────────────────────────────────────
function TornDivider() {
  return (
    <div style={{ margin: "28px 0", position: "relative", height: "20px", overflow: "hidden" }}>
      <svg viewBox="0 0 400 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <path
          d="M0,10 Q20,0 40,10 Q60,20 80,10 Q100,0 120,10 Q140,20 160,10 Q180,0 200,10 Q220,20 240,10 Q260,0 280,10 Q300,20 320,10 Q340,0 360,10 Q380,20 400,10 L400,20 L0,20 Z"
          fill="#111"
        />
      </svg>
    </div>
  );
}

// ─── Genre Section ────────────────────────────────────────────
function GenreSection({ genre }: { genre: Genre }) {
  const { data: comics = [], isLoading } = useComicsByGenre(genre.id);
  if (!isLoading && comics.length === 0) return null;
  return (
    <section>
      <SectionHeader title={genre.name} moreTo={`/genre/${genre.id}`} />
      <ComicGrid comics={comics.slice(0, 6)} loading={isLoading} />
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
    <div style={{ minHeight: "100vh", width: "100%", ...paperBg, paddingBottom: "80px" }}>

      {/* Hero */}
      {!isAuthenticated && (
        <div style={{
          textAlign: "center",
          padding: "48px 20px 36px",
          background: "#111",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Yellow screentone dots on hero */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.15,
            backgroundImage: "radial-gradient(circle, #fbbf24 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            pointerEvents: "none",
          }} />

          <p style={{ color: "#cc0000", fontSize: "11px", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 10px", fontFamily: "monospace" }}>
            NEW CHAPTERS DAILY
          </p>
          <h1 style={{ fontSize: "56px", fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1, fontFamily: "serif" }}>
            UR <span style={{ color: "#cc0000", WebkitTextStroke: "2px #cc0000" }}>COMICS</span>
          </h1>
          <div style={{ width: "60px", height: "4px", background: "#cc0000", margin: "0 auto 16px" }} />
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 auto 24px", lineHeight: 1.6, maxWidth: "260px", fontFamily: "serif" }}>
            Discover and read thousands of webtoons & manhwa by Indian creators.
          </p>
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            style={{
              padding: "12px 28px",
              borderRadius: "0px",
              fontWeight: 900,
              color: "#111",
              fontSize: "14px",
              background: "#fbbf24",
              border: "3px solid #fff",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Get Started — It's Free
          </button>
        </div>
      )}

      {/* Torn paper effect after hero */}
      <div style={{ height: "20px", background: "#111", position: "relative" }}>
        <svg viewBox="0 0 400 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <path
            d="M0,0 Q20,20 40,0 Q60,20 80,0 Q100,20 120,0 Q140,20 160,0 Q180,20 200,0 Q220,20 240,0 Q260,20 280,0 Q300,20 320,0 Q340,20 360,0 Q380,20 400,0 L400,20 L0,20 Z"
            fill="#f5f0e8"
          />
        </svg>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 14px 0" }}>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 17, height: 17, color: "#999", pointerEvents: "none" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeSearch(e.target.value))}
            placeholder="Search comics, creators, genres..."
            style={{
              width: "100%",
              padding: "12px 14px 12px 38px",
              borderRadius: "0px",
              background: "#fff",
              border: "2px solid #111",
              color: "#111",
              fontSize: "14px",
              outline: "none",
              display: "block",
              fontFamily: "monospace",
              boxShadow: "3px 3px 0px #111",
            }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <>
            <SectionHeader title={`Results for "${searchQuery}"`} showMore={false} />
            {searchResults.length === 0
              ? <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px", fontFamily: "serif" }}>No comics found.</p>
              : <div style={{ marginBottom: "28px" }}><ComicGrid comics={searchResults} /></div>
            }
            <TornDivider />
          </>
        )}

        {/* Continue Reading */}
        {isAuthenticated && resumeComics.length > 0 && (
          <>
            <div style={{ marginBottom: "28px", marginTop: "8px" }}>
              <SectionHeader title="Continue Reading" showMore={false} />
              <ComicGrid comics={resumeComics} />
            </div>
            <TornDivider />
          </>
        )}

        {/* Trending Now */}
        {trending.length > 0 && (
          <>
            <div style={{ marginBottom: "28px", marginTop: "8px" }}>
              <SectionHeader title="Trending Now" />
              <ComicGrid comics={trending} withRank />
            </div>
            <TornDivider />
          </>
        )}

        {/* Ad */}
        <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
          <AdBanner adKey="fb37617b5e2f1213963184b0b6221dee" width={300} height={250} />
        </div>

        <TornDivider />

        {/* New Arrivals */}
        <div style={{ marginBottom: "28px", marginTop: "8px" }}>
          <SectionHeader title="New Arrivals" showMore={false} />
          <ComicGrid comics={newArrivals.slice(0, 18)} loading={newLoading} withNew />
        </div>

        {/* Genre Sections */}
        {genres.map((genre, idx) => (
          <div key={genre.id}>
            <TornDivider />
            <div style={{ marginTop: "8px", marginBottom: "28px" }}>
              <GenreSection genre={genre} />
            </div>
            {idx === 1 && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <AdBanner adKey="e70aff455b682d8f9c0eed8f01af1f25" width={160} height={600} />
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{globalStyles}</style>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
              }
