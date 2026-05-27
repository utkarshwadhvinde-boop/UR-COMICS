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

// ─── 3D Card ──────────────────────────────────────────────────
function ComicCard({ comic, index = 0 }: { comic: Comic; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(124,58,237,0.5)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    card.style.boxShadow = "0 4px 24px rgba(124,58,237,0.15)";
  };

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      className="group block"
      style={{
        animation: `fadeSlideUp 0.5s ease both`,
        animationDelay: `${Math.min(index * 0.05, 0.4)}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[9/14] rounded-2xl overflow-hidden border border-purple-500/20 transition-all duration-200 cursor-pointer"
        style={{
          boxShadow: "0 4px 24px rgba(124,58,237,0.15)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Cover */}
        {comic.cover_url ? (
          <img
            src={comic.cover_url}
            alt={comic.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-900/40 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        )}

        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Bottom gradient */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white text-xs font-bold truncate">{comic.title}</h3>
          <p className="text-white/50 text-xs truncate">
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ title, icon, showMore = true, genreId }: { title: string; icon: React.ReactNode; showMore?: boolean; genreId?: string }) {
}: { title: string; icon: React.ReactNode; showMore?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-black text-white flex items-center gap-2">
        {icon}
        <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {showMore && (
        <Link
          to={genreId ? `/genre/${genreId}` : "/trending"}
          className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          More <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

// ─── Comic Grid ───────────────────────────────────────────────
function ComicGrid({ comics, loading }: { comics: Comic[]; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div key={`skel-${i}`} className="aspect-[9/14] rounded-2xl bg-purple-900/20 animate-pulse" />
          ))
        : comics.map((comic, i) => (
            <ComicCard key={comic.id} comic={comic} index={i} />
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
      <SectionHeader title={genre.name} icon={<span className="text-purple-400">◆</span>} genreId={genre.id} />
      <ComicGrid comics={comics.slice(0, 12)} loading={isLoading} />
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(160deg, #000000 0%, #0d0118 40%, #1a0b2e 70%, #000000 100%)" }}>

      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }} />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #4f46e5, transparent 70%)" }} />
      </div>

      {/* Hero */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden py-24 text-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent" />
          {/* Ink splash rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-purple-500/15 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <div className="relative z-10">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest uppercase">
              🔥 New Chapters Daily
            </div>
            <h1 className="text-6xl sm:text-7xl font-black text-white mb-4 leading-none tracking-tight">
              UR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                COMICS
              </span>
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto mb-10">
              Discover and read thousands of webtoons &amp; manhwa from creators worldwide.
            </p>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="relative px-10 py-4 rounded-2xl font-black text-white text-lg transition-all duration-300 hover:scale-105 overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
            >
              <span className="relative z-10">Get Started — It&apos;s Free</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* Ad 728x90 */}
        <div className="hidden sm:flex justify-center py-2">
          <AdBanner adKey="0411000e4f313322c3ae696f00a3d412" width={728} height={90} />
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeSearch(e.target.value))}
            placeholder="Search comics, creators, genres..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/30 focus:outline-none text-sm border border-purple-500/20 focus:border-purple-500/60 transition-colors"
            style={{ background: "rgba(124,58,237,0.08)" }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <section>
            <SectionHeader title={`Results for "${searchQuery}"`} icon={<Search className="w-4 h-4 text-purple-400" />} showMore={false} />
            {searchResults.length === 0
              ? <p className="text-white/40 text-sm">No comics found.</p>
              : <ComicGrid comics={searchResults} />}
          </section>
        )}

        {/* Continue Reading */}
        {isAuthenticated && resumeComics.length > 0 && (
          <section>
            <SectionHeader title="Continue Reading" icon={<Zap className="w-4 h-4 text-yellow-400" />} showMore={false} />
            <ComicGrid comics={resumeComics} />
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <SectionHeader title="Trending Now" icon={<TrendingUp className="w-4 h-4 text-orange-400" />} />
            <ComicGrid comics={trending} />
          </section>
        )}

        {/* Ad 300x250 */}
        <div className="flex justify-center py-2">
          <AdBanner adKey="fb37617b5e2f1213963184b0b6221dee" width={300} height={250} />
        </div>

        {/* New Arrivals */}
        <section>
          <SectionHeader title="New Arrivals" icon={<span className="text-green-400">✦</span>} showMore={false} />
          <ComicGrid comics={newArrivals.slice(0, 18)} loading={newLoading} />
        </section>

        {/* Genres */}
        {genres.map((genre, idx) => (
          <div key={genre.id}>
            <GenreSection genre={genre} />
            {idx === 1 && (
              <div className="flex justify-center py-2 mt-4">
                <AdBanner adKey="e70aff455b682d8f9c0eed8f01af1f25" width={160} height={600} />
              </div>
            )}
          </div>
        ))}

      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
