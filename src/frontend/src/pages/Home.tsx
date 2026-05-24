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

function ComicCard({ comic }: { comic: Comic }) {
  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      className="group flex-shrink-0 w-32 sm:w-36"
    >
      <div className="aspect-[9/14] rounded-xl overflow-hidden mb-2 border border-white/10 group-hover:border-purple-500/40 transition-all">
        {comic.cover_url ? (
          <img
            src={comic.cover_url}
            alt={comic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-purple-900/40 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        )}
      </div>
      <h3 className="text-white text-xs font-semibold truncate group-hover:text-purple-300">
        {comic.title}
      </h3>
      <p className="text-white/40 text-xs truncate">
        {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
      </p>
    </Link>
  );
}

function GenreRow({ genre }: { genre: Genre }) {
  const { data: comics = [], isLoading } = useComicsByGenre(genre.id);
  if (!isLoading && comics.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">{genre.name}</h2>
        <Link
          to="/trending"
          className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1"
        >
          More <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {isLoading
          ? ["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={`hero-skel-${k}`}
                className="flex-shrink-0 w-32 sm:w-36 aspect-[9/14] rounded-xl bg-white/5 animate-pulse"
              />
            ))
          : comics
              .slice(0, 12)
              .map((comic) => <ComicCard key={comic.id} comic={comic} />)}
      </div>
    </section>
  );
}

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: genres = [] } = useGenres();
  const { data: newArrivals = [], isLoading: newLoading } = useComics();
  const { data: trending = [] } = useTrendingComics(6);
  const { data: resumeComics = [] } = useResumeReading(user?.id);
  const { data: searchResults = [] } = useSearchComics(searchQuery);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // TODO: navigate to /search?q=... when search page is available
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)",
      }}
    >
      {/* Hero */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden py-20 text-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
              UR <span className="text-purple-400">COMICS</span>
            </h1>
            <p className="text-white/60 text-lg max-w-lg mx-auto mb-8">
              Discover and read thousands of webtoons &amp; manhwa from creators worldwide.
            </p>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-2xl shadow-purple-500/25"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
            >
              Get Started — It&apos;s Free
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* Ad Banner Top 728x90 */}
        <div className="flex justify-center py-2">
          <AdBanner adKey="0411000e4f313322c3ae696f00a3d412" width={728} height={90} />
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeSearch(e.target.value))}
            onKeyDown={handleSearchKey}
            placeholder="Search comics, creators, genres..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 text-sm"
          />
        </div>

        {/* Continue Reading */}
        {isAuthenticated && resumeComics.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Continue Reading
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {resumeComics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Trending Now
              </h2>
              <Link
                to="/trending"
                className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {trending.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          </section>
        )}

        {/* Search Results */}
        {searchQuery.trim() && (
          <section>
            <h2 className="text-lg font-bold text-white mb-3">
              Search Results for "{searchQuery}"
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {searchResults.length === 0 ? (
                <p className="text-white/40 text-sm">No comics found.</p>
              ) : (
                searchResults.map((comic) => (
                  <ComicCard key={comic.id} comic={comic} />
                ))
              )}
            </div>
          </section>
        )}

        {/* Ad Banner 300x250 */}
        <div className="flex justify-center py-2">
          <AdBanner adKey="fb37617b5e2f1213963184b0b6221dee" width={300} height={250} />
        </div>

        {/* New Arrivals */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">New Arrivals</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {newLoading
              ? ["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
                  <div
                    key={`new-skel-${k}`}
                    className="flex-shrink-0 w-32 sm:w-36 aspect-[9/14] rounded-xl bg-white/5 animate-pulse"
                  />
                ))
              : newArrivals
                  .slice(0, 20)
                  .map((comic) => <ComicCard key={comic.id} comic={comic} />)}
          </div>
        </section>

        {/* Genre Sections with ad after 2nd genre */}
        {genres.map((genre, idx) => (
          <div key={genre.id}>
            <GenreRow genre={genre} />
            {idx === 1 && (
              <div className="flex justify-center py-2 mt-4">
                <AdBanner adKey="e70aff455b682d8f9c0eed8f01af1f25" width={160} height={600} />
              </div>
            )}
          </div>
        ))}

      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
          }
