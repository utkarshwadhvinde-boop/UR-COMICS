import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Search, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AdBanner } from "../components/AdBanner";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../hooks/useAuth";
import { useComics } from "../hooks/useComics";
import { useComicsByGenre, useGenres, useSearchComics } from "../hooks/useGenres";
import { useResumeReading, useTrending as useTrendingComics } from "../hooks/useTrending";
import { sanitizeSearch } from "../lib/utils";
import type { Comic, Genre } from "../types/index";

// ─── Floating Bubbles Background ─────────────────────────────
function FloatingBubbles() {
  const bubbles = [
    { text: "💭", size: 32, x: 8, delay: 0, duration: 6 },
    { text: "💬", size: 24, x: 20, delay: 1, duration: 8 },
    { text: "⚡", size: 20, x: 35, delay: 2, duration: 7 },
    { text: "💭", size: 28, x: 55, delay: 0.5, duration: 9 },
    { text: "✨", size: 18, x: 70, delay: 3, duration: 6 },
    { text: "💬", size: 30, x: 82, delay: 1.5, duration: 8 },
    { text: "⚡", size: 22, x: 92, delay: 2.5, duration: 7 },
    { text: "💭", size: 26, x: 15, delay: 4, duration: 9 },
    { text: "✨", size: 20, x: 48, delay: 3.5, duration: 6 },
    { text: "💬", size: 24, x: 75, delay: 0.8, duration: 8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0 opacity-20"
          style={{
            left: `${b.x}%`,
            fontSize: `${b.size}px`,
            animation: `floatUp ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        >
          {b.text}
        </div>
      ))}
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }} />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #4f46e5, transparent 70%)" }} />
      <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #9333ea, transparent 70%)", transform: "translate(-50%,-50%)" }} />
    </div>
  );
}

// ─── 3D Comic Card ────────────────────────────────────────────
function ComicCard({ comic, index = 0, big = false }: { comic: Comic; index?: number; big?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const applyTilt = (x: number, y: number, rect: DOMRect) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -15;
    const rotateY = ((x - cx) / cx) * 15;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.06,1.06,1.06)`;
    card.style.boxShadow = `${-rotateY * 3}px ${rotateX * 3}px 50px rgba(124,58,237,0.6), 0 0 30px rgba(124,58,237,0.3)`;
    if (glow) {
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.25), transparent 60%)`;
      glow.style.opacity = "1";
    }
  };

  const resetTilt = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    card.style.boxShadow = "0 8px 32px rgba(124,58,237,0.2)";
    if (glow) glow.style.opacity = "0";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    applyTilt(e.clientX - rect.left, e.clientY - rect.top, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    applyTilt(touch.clientX - rect.left, touch.clientY - rect.top, rect);
  };

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      className="group block"
      style={{
        animation: `fadeSlideUp 0.5s ease both`,
        animationDelay: `${Math.min(index * 0.06, 0.5)}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetTilt}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          aspectRatio: "9/14",
          boxShadow: "0 8px 32px rgba(124,58,237,0.2)",
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          background: "linear-gradient(145deg, #1a0b2e, #0d0118)",
          border: "1px solid rgba(124,58,237,0.3)",
        }}
      >
        {/* Cover image */}
        {comic.cover_url ? (
          <img src={comic.cover_url} alt={comic.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        )}

        {/* Shine/glow overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{ opacity: 0 }}
        />

        {/* Glassmorphism bottom */}
        <div
          className="absolute bottom-0 inset-x-0 p-3"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            backdropFilter: "blur(2px)",
          }}
        >
          <h3 className="text-white text-xs font-bold truncate leading-tight">{comic.title}</h3>
          <p className="text-purple-300/70 text-xs truncate mt-0.5">
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>

        {/* Corner glow */}
        <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(139,92,246,0.4), transparent 70%)" }}
        />
      </div>
    </Link>
  );
}

// ─── Trending 3D Card (bigger, floating) ─────────────────────
function TrendingCard({ comic, index = 0 }: { comic: Comic; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const applyTilt = (x: number, y: number, rect: DOMRect) => {
    const card = cardRef.current;
    if (!card) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -18;
    const rotateY = ((x - cx) / cx) * 18;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08,1.08,1.08) translateZ(20px)`;
    card.style.boxShadow = `${-rotateY * 4}px ${rotateX * 4}px 60px rgba(124,58,237,0.7), 0 0 40px rgba(139,92,246,0.4)`;
    if (glowRef.current) {
      const gx = (x / rect.width) * 100;
      const gy = (y / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.3), transparent 60%)`;
      glowRef.current.style.opacity = "1";
    }
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0px)";
    card.style.boxShadow = "0 12px 40px rgba(124,58,237,0.3)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  const tiltAngles = [-6, 0, 6];
  const baseTilt = tiltAngles[index % 3];

  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      className="group block flex-shrink-0"
      style={{
        width: "160px",
        animation: `fadeSlideUp 0.6s ease both`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); applyTilt(e.clientX - r.left, e.clientY - r.top, r); }}
        onMouseLeave={resetTilt}
        onTouchMove={(e) => { const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect(); applyTilt(t.clientX - r.left, t.clientY - r.top, r); }}
        onTouchEnd={resetTilt}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          aspectRatio: "9/14",
          transform: `perspective(1000px) rotateZ(${baseTilt}deg)`,
          boxShadow: "0 12px 40px rgba(124,58,237,0.3)",
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          border: "1px solid rgba(139,92,246,0.4)",
          animation: `float ${3 + index * 0.5}s ease-in-out ${index * 0.3}s infinite`,
        }}
      >
        {comic.cover_url ? (
          <img src={comic.cover_url} alt={comic.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-900/40 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        )}

        <div ref={glowRef} className="absolute inset-0 pointer-events-none transition-opacity duration-200" style={{ opacity: 0 }} />

        {/* Rank badge */}
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", boxShadow: "0 0 12px rgba(124,58,237,0.8)" }}
        >
          {index + 1}
        </div>

        {/* Neon border glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: "inset 0 0 20px rgba(139,92,246,0.3)" }}
        />

        <div className="absolute bottom-0 inset-x-0 p-3"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)" }}
        >
          <h3 className="text-white text-xs font-bold truncate">{comic.title}</h3>
          <p className="text-purple-300/70 text-xs truncate mt-0.5">
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
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-black text-white flex items-center gap-2">
        {icon}
        <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {showMore && (
        <Link to="/trending" className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1 transition-colors">
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
            <div key={`skel-${i}`} className="aspect-[9/14] rounded-2xl animate-pulse"
              style={{ background: "linear-gradient(145deg, rgba(124,58,237,0.15), rgba(109,40,217,0.08))" }}
            />
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
      <SectionHeader title={genre.name} icon={<span className="text-purple-400">◆</span>} />
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
    <div className="min-h-screen overflow-x-hidden relative"
      style={{ background: "linear-gradient(160deg, #000000 0%, #0d0118 40%, #1a0b2e 70%, #000000 100%)" }}
    >
      <FloatingBubbles />

      {/* Hero */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden py-24 text-center px-4 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-purple-500/15 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <div className="relative z-10">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest uppercase">
              🔥 New Chapters Daily
            </div>
            <h1 className="text-6xl sm:text-7xl font-black text-white mb-4 leading-none tracking-tight">
              UR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-purple-500 bg-clip-text text-transparent"
                style={{ filter: "drop-shadow(0 0 20px rgba(139,92,246,0.8))" }}>
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
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", boxShadow: "0 0 40px rgba(124,58,237,0.5)" }}
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
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/30 focus:outline-none text-sm transition-colors"
            style={{
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.25)",
              backdropFilter: "blur(10px)",
            }}
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

        {/* Trending — floating 3D cards */}
        {trending.length > 0 && (
          <section>
            <SectionHeader title="Trending Now" icon={<TrendingUp className="w-4 h-4 text-orange-400" />} />
            <div
              className="relative rounded-3xl p-6 overflow-x-auto"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(109,40,217,0.04))",
                border: "1px solid rgba(124,58,237,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex gap-6 pb-2" style={{ minWidth: "max-content" }}>
                {trending.map((comic, i) => (
                  <TrendingCard key={comic.id} comic={comic} index={i} />
                ))}
              </div>
            </div>
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

      {/* CSS */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: perspective(1000px) translateY(0px) rotateZ(var(--tilt, 0deg)); }
          50% { transform: perspective(1000px) translateY(-8px) rotateZ(var(--tilt, 0deg)); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0px); opacity: 0.2; }
          50% { opacity: 0.15; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
  }
