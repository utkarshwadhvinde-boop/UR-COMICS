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
function ComicCard({ comic }: { comic: Comic }) {
  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div style={{
        width: "100%",
        aspectRatio: "9/14",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        background: "#0d0118",
        border: "1px solid rgba(124,58,237,0.25)",
      }}>
        {comic.cover_url
          ? <img
              src={comic.cover_url}
              alt={comic.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 28, height: 28, color: "#a855f7" }} />
            </div>
        }
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "32px 10px 10px",
          background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4) 60%, transparent)",
        }}>
          <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {comic.title}
          </p>
          <p style={{ color: "rgba(196,168,255,0.65)", fontSize: "11px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Trending Card ────────────────────────────────────────────
function TrendingCard({ comic, index }: { comic: Comic; index: number }) {
  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", flexShrink: 0, width: "38vw", maxWidth: "160px", textDecoration: "none" }}
    >
      <div style={{
        width: "100%",
        aspectRatio: "9/14",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        background: "#0d0118",
        border: "1px solid rgba(124,58,237,0.3)",
      }}>
        {comic.cover_url
          ? <img
              src={comic.cover_url}
              alt={comic.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 24, height: 24, color: "#a855f7" }} />
            </div>
        }
        {/* Rank badge */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          width: 26, height: 26, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "11px", fontWeight: 900,
        }}>
          {index + 1}
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "28px 8px 8px",
          background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
        }}>
          <p style={{ color: "#fff", fontSize: "11px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
function SectionHeader({
  title, icon, showMore = true,
}: {
  title: string; icon: React.ReactNode; showMore?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
        {icon}
        {title}
      </h2>
      {showMore && (
        <Link to="/trending" style={{ color: "#a855f7", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
          More <ChevronRight style={{ width: 13, height: 13 }} />
        </Link>
      )}
    </div>
  );
}

// ─── Comic Grid ───────────────────────────────────────────────
function ComicGrid({ comics, loading }: { comics: Comic[]; loading?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "9/14", borderRadius: "12px", background: "rgba(124,58,237,0.1)" }} />
          ))
        : comics.map((comic) => <ComicCard key={comic.id} comic={comic} />)}
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
        icon={<span style={{ color: "#a855f7", fontSize: "14px" }}>◆</span>}
      />
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
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(180deg, #000 0%, #0d0118 40%, #1a0b2e 70%, #0d0118 100%)",
    }}>

      {/* Hero — only for logged out users */}
      {!isAuthenticated && (
        <div style={{ textAlign: "center", padding: "64px 20px 48px" }}>
          <p style={{ color: "#a855f7", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
            🔥 New Chapters Daily
          </p>
          <h1 style={{ fontSize: "clamp(44px, 12vw, 68px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1 }}>
            UR <span style={{ color: "#a855f7" }}>COMICS</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", maxWidth: "300px", margin: "0 auto 28px", lineHeight: 1.6 }}>
            Discover and read thousands of webtoons &amp; manhwa from creators worldwide.
          </p>
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
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

      {/* Page content */}
      <div style={{ padding: "16px 16px 80px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Ad 728x90 desktop */}
        <div className="hidden sm:flex justify-center">
          <AdBanner adKey="0411000e4f313322c3ae696f00a3d412" width={728} height={90} />
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)",
            width: 18, height: 18,
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
              padding: "14px 16px 14px 44px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(124,58,237,0.25)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              display: "block",
            }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <section>
            <SectionHeader
              title={`Results for "${searchQuery}"`}
              icon={<Search style={{ width: 16, height: 16, color: "#a855f7" }} />}
              showMore={false}
            />
            {searchResults.length === 0
              ? <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>No comics found.</p>
              : <ComicGrid comics={searchResults} />
            }
          </section>
        )}

        {/* Continue Reading */}
        {isAuthenticated && resumeComics.length > 0 && (
          <section>
            <SectionHeader
              title="Continue Reading"
              icon={<Zap style={{ width: 16, height: 16, color: "#facc15" }} />}
              showMore={false}
            />
            <ComicGrid comics={resumeComics} />
          </section>
        )}

        {/* Trending Now */}
        {trending.length > 0 && (
          <section>
            <SectionHeader
              title="Trending Now"
              icon={<TrendingUp style={{ width: 16, height: 16, color: "#fb923c" }} />}
            />
            <div style={{
              overflowX: "auto",
              overflowY: "visible",
              touchAction: "pan-x",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "4px",
            }}>
              <div style={{ display: "flex", gap: "12px", width: "max-content" }}>
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
          <SectionHeader
            title="New Arrivals"
            icon={<span style={{ color: "#4ade80", fontSize: "14px" }}>✦</span>}
            showMore={false}
          />
          <ComicGrid comics={newArrivals.slice(0, 18)} loading={newLoading} />
        </section>

        {/* Genre Sections */}
        {genres.map((genre, idx) => (
          <div key={genre.id}>
            <GenreSection genre={genre} />
            {idx === 1 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
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
