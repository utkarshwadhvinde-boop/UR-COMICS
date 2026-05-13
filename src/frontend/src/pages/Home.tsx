import { ComicCard } from "@/components/ui/ComicCard";
import { ALL_GENRES, GenreChip } from "@/components/ui/GenreChip";
import { SkeletonCard, SkeletonRow } from "@/components/ui/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type ComicPublic,
  useListComics,
} from "@/hooks/useBackend";
import { useDeleteComic } from "@/hooks/useComicBackend";
import { formatNumber } from "@/lib/sampleData";
import { useAppStore } from "@/store";
import type { Comic, Genre } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Returns true only when a comic has a real HTTP cover URL — hides ghost/orphan entries */
function isValidComic(comic: { coverImage: string }): boolean {
  return (
    typeof comic.coverImage === "string" &&
    comic.coverImage.length > 0 &&
    (comic.coverImage.startsWith("http://") ||
      comic.coverImage.startsWith("https://"))
  );
}
const ITEMS_PER_PAGE = 20;

const SKELETON_KEYS_10 = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
] as const;
const SKELETON_KEYS_6 = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;
const SKELETON_KEYS_5 = ["t1", "t2", "t3", "t4", "t5"] as const;

function trendingScore(c: Comic) {
  return c.likes * 0.5 + c.views * 0.1;
}

/** Full-page empty state shown when there are zero comics in the platform */
function ComicsEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-card border border-border/50 text-center"
      data-ocid="comics.empty_state"
    >
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-400/20 border border-orange-400/40 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-orange-400" />
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-3">
        No comics yet.
      </h2>
      <p className="text-lg text-muted-foreground mb-2 font-medium">
        Be the first to upload!
      </p>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        This platform is powered entirely by creators like you. Upload your
        first comic and start building your audience today.
      </p>

      <Link to="/create">
        <Button
          className="gradient-primary text-white border-0 px-8 py-3 h-auto rounded-2xl font-semibold text-base shadow-glow hover:opacity-90 transition-smooth btn-press"
          data-ocid="comics.upload_cta_button"
        >
          📤 Upload Your Comic
        </Button>
      </Link>
    </div>
  );
}

/** Hero section shown when at least one comic exists */
function HeroBanner({ comic }: { comic: Comic }) {
  return (
    <section className="relative overflow-hidden" data-ocid="hero.section">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1400x600.jpg')",
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.04 265 / 0.94) 0%, oklch(0.14 0.05 290 / 0.87) 50%, oklch(0.12 0.04 310 / 0.92) 100%)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 py-12 md:py-18 flex flex-col md:flex-row items-center gap-10 z-10">
        {/* Hero text content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex justify-center md:justify-start mb-5">
            <div className="inline-flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="UR Comics"
                className="h-10 w-auto drop-shadow-[0_0_12px_rgba(90,59,255,0.7)] animate-fade-in-up"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                }}
              />
              <div
                className="text-2xl font-display font-bold text-white/90 drop-shadow-[0_0_8px_rgba(90,59,255,0.5)]"
                aria-hidden="true"
              >
                UR Comics
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 border border-primary/40 text-white/90 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Featured Series
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-4 drop-shadow-lg">
            {comic.title}
          </h1>

          <p className="text-base md:text-lg text-white/75 max-w-lg mb-6 line-clamp-3">
            {comic.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-6">
            {comic.genres.map((g) => (
              <span
                key={g}
                className="text-xs px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full bg-primary/30 border border-primary/40 text-white/90 backdrop-blur-sm capitalize">
              {comic.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <Link
              to="/read/$comicId/$chapterId"
              params={{
                comicId: comic.id,
                chapterId: comic.chapters[0]?.id ?? "",
              }}
            >
              <Button
                className="gradient-primary text-white border-0 px-8 py-3 h-auto rounded-2xl font-semibold text-base shadow-glow hover:opacity-90 transition-smooth btn-press"
                data-ocid="hero.read_now_button"
              >
                ▶ Read Now
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatNumber(comic.views)} views
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {comic.chapters.length} Chapters
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {comic.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Hero cover image with glow */}
        <div className="shrink-0 z-10 relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/40 blur-2xl scale-110 opacity-60" />
          <Link
            to="/read/$comicId/$chapterId"
            params={{
              comicId: comic.id,
              chapterId: comic.chapters[0]?.id ?? "",
            }}
          >
            <img
              src={comic.coverImage}
              alt={comic.title}
              className="relative w-44 md:w-60 rounded-2xl shadow-2xl border-2 border-white/20 hover:scale-105 transition-smooth"
            />
          </Link>
          {comic.isFeatured && (
            <div className="absolute -top-2 -right-2 z-20">
              <Badge className="gradient-primary text-white border-0 shadow-glow text-xs px-2 py-0.5">
                ⭐ Featured
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

export default function HomePage() {
  const { searchQuery, readingProgress, currentUser, setComics } =
    useAppStore();
  const [activeGenre, setActiveGenre] = useState<Genre | "All">("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  // Backend queries
  const { data: backendComics = [], isLoading } = useListComics();
const trendingBackend: any[] = [];

  // On first mount: scrub any ghost/orphan entries from the React Query caches
  // by filtering out comics that have no valid cover URL. This is a fire-and-forget
  // frontend cleanup — no backend call needed (backend listComics already returns live data).
  useEffect(() => {
    const timer = setTimeout(() => {
      qc.setQueryData<ComicPublic[]>(["backend", "comics"], (prev) =>
        prev
          ? prev.filter(
              (c) =>
                typeof c.coverUrl === "string" &&
                c.coverUrl.length > 0 &&
                (c.coverUrl.startsWith("http://") ||
                  c.coverUrl.startsWith("https://")),
            )
          : prev,
      );
      qc.setQueryData<ComicPublic[]>(["backend", "trending", 5], (prev) =>
        prev
          ? prev.filter(
              (c) =>
                typeof c.coverUrl === "string" &&
                c.coverUrl.length > 0 &&
                (c.coverUrl.startsWith("http://") ||
                  c.coverUrl.startsWith("https://")),
            )
          : prev,
      );
    }, 500);
    return () => clearTimeout(timer);
    // qc is stable (QueryClient never changes), so this runs exactly once on mount
  }, [qc]);

  // Sync backend comics into the Zustand store so child components (ComicCard, etc) can reference them
  useEffect(() => {
    if (backendComics.length > 0) {
      const mapped = backendComics
        .filter((c) => !!c.coverUrl) // never sync ghost/orphan entries without a cover
        .map((c) => ({
          id: String(c.id),
          title: c.title,
          description: c.description,
          author: c.author,
          coverImage: c.coverUrl,
          genres: c.genres as Genre[],
          status: "ongoing" as const,
          likes: Number(c.likesCount),
          views: Number(c.viewsCount),
          rating: 0,
          chapters: [],
          createdAt: Number(c.createdAt),
          updatedAt: Number(c.createdAt),
          isFeatured: c.isFeatured,
          isTrending: c.isTrending,
          isPremium: c.isPremium,
          isPinned: c.isPinned,
          creatorId: c.creatorId,
          isOwnerComic: c.ownerUploaded,
        }));
      setComics(mapped);
    }
  }, [backendComics, setComics]);

  const comics = backendComics.map((c) => ({
    id: String(c.id),
    title: c.title,
    description: c.description,
    author: c.author,
    coverImage: c.coverUrl,
    genres: c.genres as Genre[],
    status: "ongoing" as const,
    likes: Number(c.likesCount),
    views: Number(c.viewsCount),
    rating: 0,
    chapters: [] as Comic["chapters"],
    createdAt: Number(c.createdAt),
    updatedAt: Number(c.createdAt),
    isFeatured: c.isFeatured,
    isTrending: c.isTrending,
    isPremium: c.isPremium,
    isPinned: c.isPinned,
    creatorId: c.creatorId,
    isOwnerComic: c.ownerUploaded,
  }));

  // ORPHAN FILTER: only show comics with a real permanent HTTP cover URL
  // This prevents ghost cards from deleted/incomplete entries appearing
  const visibleComics = comics.filter(isValidComic);

  const hasComics = visibleComics.length > 0;
  const heroComic = visibleComics.find((c) => c.isFeatured) ?? visibleComics[0];
  const streak = currentUser?.dailyStreak ?? 0;

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting)
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset count when genre/search changes
  const prevFilterRef = useRef(`${activeGenre}|${searchQuery}`);
  const filterKey = `${activeGenre}|${searchQuery}`;
  if (prevFilterRef.current !== filterKey) {
    prevFilterRef.current = filterKey;
    setVisibleCount(ITEMS_PER_PAGE);
  }

  const filtered = visibleComics.filter((c) => {
    const matchesGenre =
      activeGenre === "All" || c.genres.includes(activeGenre as Genre);
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  const sorted = [...filtered].sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0),
  );
  const paginated = sorted.slice(0, visibleCount);
  const hasMore = paginated.length < sorted.length;

  const continueReadingItems = readingProgress
    .sort((a, b) => b.lastReadAt - a.lastReadAt)
    .map((p) => {
      const comic = visibleComics.find((c) => c.id === p.comicId);
      return comic ? { comic, progress: p } : null;
    })
    .filter(Boolean)
    .slice(0, 4) as { comic: Comic; progress: (typeof readingProgress)[0] }[];

  const trendingComics =
    trendingBackend.length > 0
      ? trendingBackend
          .filter(
            (c) =>
              typeof c.coverUrl === "string" &&
              c.coverUrl.length > 0 &&
              (c.coverUrl.startsWith("http://") ||
                c.coverUrl.startsWith("https://")),
          )
          .map((c) => ({
            id: String(c.id),
            title: c.title,
            description: c.description,
            author: c.author,
            coverImage: c.coverUrl,
            genres: c.genres as Genre[],
            status: "ongoing" as const,
            likes: Number(c.likesCount),
            views: Number(c.viewsCount),
            rating: 0,
            chapters: [] as Comic["chapters"],
            createdAt: Number(c.createdAt),
            updatedAt: Number(c.createdAt),
            isFeatured: c.isFeatured,
            isTrending: c.isTrending,
            isPremium: c.isPremium,
            isPinned: c.isPinned,
            creatorId: c.creatorId,
            isOwnerComic: c.ownerUploaded,
          }))
      : [...visibleComics]
          .sort((a, b) => trendingScore(b) - trendingScore(a))
          .slice(0, 5);

  const popularThisWeek = [...visibleComics]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);
  const recentlyUpdated = [...visibleComics]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6);

  const getRecommended = useCallback(() => {
    const bookmarkedGenres = visibleComics
      .filter((c) => readingProgress.some((p) => p.comicId === c.id))
      .flatMap((c) => c.genres);
    if (bookmarkedGenres.length === 0) return visibleComics.slice(0, 4);
    const genreCount: Record<string, number> = {};
    for (const g of bookmarkedGenres) genreCount[g] = (genreCount[g] ?? 0) + 1;
    return [...visibleComics]
      .sort(
        (a, b) =>
          b.genres.reduce((s, g) => s + (genreCount[g] ?? 0), 0) -
          a.genres.reduce((s, g) => s + (genreCount[g] ?? 0), 0),
      )
      .filter((c) => !readingProgress.some((p) => p.comicId === c.id))
      .slice(0, 4);
  }, [visibleComics, readingProgress]);

  const recommended = getRecommended();
  const hasReadingHistory = readingProgress.length > 0;

  // Platform empty state
  if (!isLoading && !hasComics) {
    return (
      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden" data-ocid="hero.section">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-bg.dim_1400x600.jpg')",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.10 0.04 265 / 0.94) 0%, oklch(0.14 0.05 290 / 0.87) 50%, oklch(0.12 0.04 310 / 0.92) 100%)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
            <img
              src="/assets/logo.png"
              alt="UR Comics"
              className="h-14 w-auto mb-4 drop-shadow-[0_0_14px_rgba(90,59,255,0.8)] animate-fade-in-up"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white/90 drop-shadow-lg">
              The future of comics starts here
            </h2>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <ComicsEmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {heroComic && <HeroBanner comic={heroComic} />}
      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-14">
        {streak > 0 && (
          <div
            className="flex items-center justify-center"
            data-ocid="hero.streak_banner"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 backdrop-blur-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-foreground">
                🔥 {streak} day streak! Keep reading
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        )}

        {/* Continue Reading */}
        {continueReadingItems.length > 0 ? (
          <section data-ocid="continue_reading.section">
            <SectionHeader
              title="Continue Reading"
              icon={<BookOpen className="w-5 h-5 text-primary" />}
              to="/library"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {continueReadingItems.map(({ comic, progress }, i) => {
                const chapter = comic.chapters.find(
                  (ch) => ch.id === progress.chapterId,
                );
                const totalChapters = comic.chapters.length;
                const chapterIdx = comic.chapters.findIndex(
                  (ch) => ch.id === progress.chapterId,
                );
                const pct =
                  totalChapters > 0
                    ? Math.round(((chapterIdx + 1) / totalChapters) * 100)
                    : 0;
                return (
                  <div
                    key={comic.id}
                    className="flex gap-3 items-center p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-smooth group"
                    data-ocid={`continue_reading.item.${i + 1}`}
                  >
                    <Link
                      to="/read/$comicId/$chapterId"
                      params={{
                        comicId: comic.id,
                        chapterId: progress.chapterId,
                      }}
                    >
                      <img
                        src={comic.coverImage}
                        alt={comic.title}
                        className="w-14 h-20 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-smooth"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-smooth">
                        {comic.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ch. {chapter?.chapterNumber ?? "?"} — {chapter?.title}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{pct}% read</span>
                          <span>
                            {chapterIdx + 1}/{totalChapters} chapters
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                      <Link
                        to="/read/$comicId/$chapterId"
                        params={{
                          comicId: comic.id,
                          chapterId: progress.chapterId,
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 px-3 text-xs text-primary hover:bg-primary/10 rounded-lg"
                          data-ocid={`continue_reading.resume_button.${i + 1}`}
                        >
                          Resume →
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section data-ocid="continue_reading.section">
            <SectionHeader
              title="Continue Reading"
              icon={<BookOpen className="w-5 h-5 text-primary" />}
              to="/library"
            />
            <div
              className="flex flex-col items-center justify-center py-10 mt-4 rounded-2xl bg-card border border-border/40 text-center"
              data-ocid="continue_reading.empty_state"
            >
              <div className="text-5xl mb-3">📖</div>
              <h3 className="font-semibold text-base text-foreground mb-1">
                Start reading to see your progress here
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your reading history and progress will appear once you begin a
                comic.
              </p>
              {visibleComics.length > 0 && (
                <Link
                  to="/read/$comicId/$chapterId"
                  params={{
                    comicId: visibleComics[0]?.id ?? "",
                    chapterId: visibleComics[0]?.chapters[0]?.id ?? "",
                  }}
                >
                  <Button
                    className="mt-4 gradient-primary text-white border-0 rounded-xl shadow-glow"
                    data-ocid="continue_reading.start_button"
                  >
                    Start Reading
                  </Button>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Genre Explorer */}
        <section data-ocid="genre.section">
          <SectionHeader
            title="Browse by Genre"
            icon={<span className="text-lg">🎭</span>}
          />
          <div className="flex gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide">
            {ALL_GENRES.map((genre, i) => (
              <GenreChip
                key={genre}
                genre={genre}
                isActive={activeGenre === genre}
                onClick={() =>
                  setActiveGenre(
                    activeGenre === genre && genre !== "All" ? "All" : genre,
                  )
                }
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Comic Grid */}
        <section data-ocid="comics.section">
          <SectionHeader
            title={
              searchQuery
                ? `Search: "${searchQuery}"`
                : activeGenre === "All"
                  ? "All Comics"
                  : `${activeGenre} Comics`
            }
            icon={<span className="text-lg">📚</span>}
          />
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {SKELETON_KEYS_10.map((k) => (
                <SkeletonCard key={k} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="text-center py-16 bg-card rounded-2xl mt-4 border border-border"
              data-ocid="comics.filter_empty_state"
            >
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No results for this filter
              </h3>
              <p className="text-muted-foreground text-sm">
                Try a different genre or search term.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveGenre("All")}
                data-ocid="comics.clear_filter_button"
              >
                Clear Filter
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {paginated.map((comic, i) => (
                  <ComicCard key={comic.id} comic={comic} index={i} />
                ))}
              </div>
              {hasMore && (
                <div ref={sentinelRef} className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {SKELETON_KEYS_5.map((k) => (
                      <SkeletonCard key={k} />
                    ))}
                  </div>
                </div>
              )}
              {!hasMore && sorted.length > ITEMS_PER_PAGE && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  All {sorted.length} comics loaded
                </p>
              )}
            </>
          )}
        </section>

        {/* Trending Now */}
        {trendingComics.length > 0 && (
          <section
            className="bg-muted/30 -mx-4 px-4 py-8 rounded-3xl"
            data-ocid="trending.section"
          >
            <SectionHeader
              title="Trending Now"
              icon={<Flame className="w-5 h-5 text-orange-500" />}
              to="/trending"
            />
            <div className="flex gap-4 overflow-x-auto pb-2 mt-4 scrollbar-hide">
              {trendingComics.map((comic, i) => (
                <div
                  key={comic.id}
                  className="shrink-0 w-40"
                  data-ocid={`trending.item.${i + 1}`}
                >
                  <ComicCard
                    comic={comic}
                    index={i}
                    variant="featured"
                    engagementScore={trendingScore(comic)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular This Week */}
        {popularThisWeek.length > 0 && (
          <section data-ocid="popular.section">
            <SectionHeader
              title="Popular This Week"
              icon={<Trophy className="w-5 h-5 text-amber-500" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {popularThisWeek.map((comic, i) => (
                <Link
                  key={comic.id}
                  to="/read/$comicId/$chapterId"
                  params={{
                    comicId: comic.id,
                    chapterId: comic.chapters[0]?.id ?? "",
                  }}
                  className="group"
                  data-ocid={`popular.item.${i + 1}`}
                >
                  <div className="relative flex gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-smooth">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg ${
                        i === 0
                          ? "gradient-primary text-white shadow-glow"
                          : i === 1
                            ? "bg-amber-400/20 text-amber-600 border border-amber-400/30"
                            : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      #{i + 1}
                    </div>
                    <img
                      src={comic.coverImage}
                      alt={comic.title}
                      className="w-12 h-16 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-smooth"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-smooth">
                        {comic.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {comic.author}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold">
                          {comic.rating}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          · {formatNumber(comic.likes)} likes
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Updated */}
        {recentlyUpdated.length > 0 && (
          <section data-ocid="recent.section">
            <SectionHeader
              title="Recently Updated"
              icon={<Clock className="w-5 h-5 text-blue-500" />}
            />
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {SKELETON_KEYS_6.map((k) => (
                  <SkeletonRow key={k} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {recentlyUpdated.map((comic, i) => (
                  <ComicCard
                    key={comic.id}
                    comic={comic}
                    index={i}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <section
            className="bg-muted/20 -mx-4 px-4 py-8 rounded-3xl border border-border/30"
            data-ocid="recommended.section"
          >
            <SectionHeader
              title="Recommended For You"
              icon={<Sparkles className="w-5 h-5 text-purple-400" />}
            />
            {!hasReadingHistory && (
              <p className="mt-2 text-sm text-muted-foreground">
                ✨ Explore these picks — handpicked to get you started!
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {recommended.map((comic, i) => (
                <ComicCard key={comic.id} comic={comic} index={i} />
              ))}
            </div>
          </section>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  to?: string;
}

function SectionHeader({ title, icon, to }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-smooth"
          data-ocid="section.view_all_link"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
