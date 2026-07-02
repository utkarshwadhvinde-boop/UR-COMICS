
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

// ─── Comic Card ───────────────────────────────────────────────
function ComicCard({ comic, rank }: { comic: Comic; rank?: number }) {
  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", textDecoration: "none" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{
        width: "100%",
        aspectRatio: "9/14",
        borderRadius: "14px",
        overflow: "hidden",
        position: "relative",
        background: "#111",
        border: "1px solid rgba(124,58,237,0.35)",
        boxShadow: "0 0 12px rgba(124,58,237,0.2), 0 4px 16px rgba(0,0,0,0.4)",
        transition: "transform 0.15s ease",
      }}>
        {comic.cover_url
          ? <img
              src={comic.cover_url}
              alt={comic.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a0b2e" }}>
              <BookOpen style={{ width: 24, height: 24, color: "#a855f7" }} />
            </div>
        }
        {/* Shine line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          pointerEvents: "none",
        }} />
        {/* Top gradient overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "40%",
          background: "linear-gradient(to bottom, rgba(124,58,237,0.08), transparent)",
          pointerEvents: "none",
        }} />
    {/* Rank badge */}
        {rank !== undefined && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            width: 24, height: 24, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "11px", fontWeight: 900,
          }}>
            {rank}
          </div>
        )}
        {/* AI badge */}
        {(comic as any).is_ai_generated && (
          <div style={{
            position: "absolute", top: 8, right: 8,
            padding: "2px 7px", borderRadius: "6px",
            background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)", fontSize: "9px", fontWeight: 800,
            letterSpacing: "0.5px",
          }}>
            AI
          </div>
        )}
        {/* Bottom info */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 8px 8px",
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)",
        }}>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {comic.title}
          </p>
          <p style={{ color: "rgba(196,168,255,0.6)", fontSize: "10px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ title, icon, showMore = true, moreTo = "/trending" }: {
  title: string;
  icon: React.ReactNode;
  showMore?: boolean;
  moreTo?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
      <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "7px" }}>
        {icon}
        {title}
      </h2>
      {showMore && (
        <Link to={moreTo} style={{ color: "#a855f7", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
          More <ChevronRight style={{ width: 13, height: 13 }} />
        </Link>
      )}
    </div>
  );
}

// ─── Comic Grid ───────────────────────────────────────────────
function ComicGrid({ comics, loading, withRank = false }: {
  comics: Comic[];
  loading?: boolean;
  withRank?: boolean;
}) {
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: "9/14", borderRadius: "14px", background: "rgba(124,58,237,0.1)" }} />
        ))}
      </div>
    );
  }

  if (comics.length === 0) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {comics.map((comic, i) => (
        <ComicCard key={comic.id} comic={comic} rank={withRank ? i + 1 : undefined} />
      ))}
    </div>
  );
}

// ─── Genre Section ────────────────────────────────────────────
function GenreSection({ genre }: { genre: Genre }) {
  const { data: comics = [], isLoading } = useComicsByGenre(genre.id);
  if (!isLoading && comics.length === 0) return null;
  return (
    <section>
      <SectionHeader
        title={genre.name}
        icon={<span style={{ color: "#a855f7", fontSize: "13px" }}>◆</span>}
        moreTo={`/genre/${genre.id}`}
      />
      <ComicGrid comics={comics.slice(0, 6)} loading={isLoading} />
    </section>
  );
}

// ─── Divider ──────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ height: "1px", background: "rgba(124,58,237,0.15)", margin: "4px 0" }} />
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
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0a0010",
      paddingBottom: "80px",
    }}>

      {/* Hero */}
      {!isAuthenticated && (
        <div style={{
          textAlign: "center",
          padding: "56px 20px 40px",
          background: "linear-gradient(180deg, #1a0b2e 0%, #0a0010 100%)",
        }}>
          <p style={{ color: "#a855f7", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 10px" }}>
            🔥 New Chapters Daily
          </p>
          <h1 style={{ fontSize: "52px", fontWeight: 900, color: "#fff", margin: "0 0 10px", lineHeight: 1 }}>
            UR <span style={{ color: "#a855f7" }}>COMICS</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: "0 auto 24px", lineHeight: 1.6, maxWidth: "280px" }}>
            Discover and read thousands of webtoons &amp; manhwa.
          </p>
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            style={{
              padding: "13px 30px",
              borderRadius: "10px",
              fontWeight: 800,
              color: "#fff",
              fontSize: "15px",
              background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Get Started — It&apos;s Free
          </button>
        </div>
      )}

      {/* All content in one single flow */}
      <div style={{ padding: "16px 14px 0" }}>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)",
            width: 17, height: 17,
            color: "rgba(255,255,255,0.3)",
            pointerEvents: "none",
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeSearch(e.target.value))}
            placeholder="Search comics, creators, genres..."
            style={{
              width: "100%",
              padding: "13px 14px 13px 38px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
              display: "block",
            }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <>
            <SectionHeader
              title={`Results for "${searchQuery}"`}
              icon={<Search style={{ width: 15, height: 15, color: "#a855f7" }} />}
              showMore={false}
            />
            {searchResults.length === 0
              ? <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "24px" }}>No comics found.</p>
              : <div style={{ marginBottom: "28px" }}><ComicGrid comics={searchResults} /></div>
            }
            <Divider />
          </>
        )}

        {/* Continue Reading */}
        {isAuthenticated && resumeComics.length > 0 && (
          <>
            <div style={{ marginBottom: "28px", marginTop: "24px" }}>
              <SectionHeader
                title="Continue Reading"
                icon={<Zap style={{ width: 15, height: 15, color: "#facc15" }} />}
                showMore={false}
              />
              <ComicGrid comics={resumeComics} />
            </div>
            <Divider />
          </>
        )}

        {/* Trending Now */}
        {trending.length > 0 && (
          <>
            <div style={{ marginBottom: "28px", marginTop: "24px" }}>
              <SectionHeader
                title="Trending Now"
                icon={<TrendingUp style={{ width: 15, height: 15, color: "#fb923c" }} />}
              />
              <ComicGrid comics={trending} withRank />
            </div>
            <Divider />
          </>
        )}

        {/* Ad 300x250 */}
        <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
          <AdBanner adKey="fb37617b5e2f1213963184b0b6221dee" width={300} height={250} />
        </div>


        <Divider />

        {/* New Arrivals */}
        <div style={{ marginBottom: "28px", marginTop: "24px" }}>
          <SectionHeader
            title="New Arrivals"
            icon={<span style={{ color: "#4ade80", fontSize: "13px" }}>✦</span>}
            showMore={false}
          />
          <ComicGrid comics={newArrivals.slice(0, 18)} loading={newLoading} />
        </div>

        {/* Genre Sections */}
        {genres.map((genre, idx) => (
          <div key={genre.id}>
            <Divider />
            <div style={{ marginTop: "24px", marginBottom: "28px" }}>
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

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }
        * { box-sizing: border-box; }
      `}</style>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
            }
