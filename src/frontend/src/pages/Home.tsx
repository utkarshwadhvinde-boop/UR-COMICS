import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import { BookOpen, Flame, Sparkles, TrendingUp, Clock, Trophy } from "lucide-react";
import { formatNumber } from "@/lib/sampleData";
import type { Comic, Genre } from "@/types";
import {
  ComicCard,
  SkeletonCard,
  SkeletonRow,
  GenreChip,
  ALL_GENRES,
} from "@/components/ui";
import { useListComics, useGetTrending } from "@/hooks/useBackend";
import { useAppStore } from "@/store";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------- SAFE HELPERS ---------------- */

const isValidUrl = (url?: string | null): boolean =>
  !!url && (url.startsWith("http://") || url.startsWith("https://"));

/* ---------------- EMPTY STATE ---------------- */

export function ComicsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-card border border-border/50 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-400/20 border border-orange-400/40 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-orange-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-3">No comics yet.</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        This platform is powered by creators like you.
      </p>

      <Link to="/create">
        <Button className="gradient-primary text-white px-8 py-3 rounded-2xl">
          📤 Upload Your Comic
        </Button>
      </Link>
    </div>
  );
}

/* ---------------- HERO ---------------- */

export function HeroBanner({ comic }: { comic: Comic }) {
  const firstChapterId = comic.chapters?.[0]?.id ?? "";
  const chapterCount = comic.chapters?.length ?? 0;

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-bg.dim_1400x600.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-screen-xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <div className="text-2xl font-bold text-white mb-5">UR Comics</div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs mb-4">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Featured Series
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {comic.title || "Untitled"}
          </h1>

          <p className="text-white/70 mb-6 line-clamp-3">
            {comic.description || "No description available."}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {(comic.genres || []).map((g) => (
              <span
                key={g}
                className="text-xs px-3 py-1 rounded-full bg-white/10 text-white"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/read/$comicId/$chapterId"
              params={{
                comicId: comic.id,
                chapterId: firstChapterId,
              }}
            >
              <Button disabled={!firstChapterId}>▶ Read Now</Button>
            </Link>

            <div className="text-white/60 text-sm flex gap-4">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatNumber(comic.views || 0)} views
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {chapterCount} Chapters
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src={comic.coverImage}
            alt={comic.title}
            className="w-44 md:w-60 rounded-2xl shadow-2xl"
          />

          {comic.isFeatured && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-yellow-500 text-black">⭐ Featured</Badge>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOME PAGE ---------------- */

const ITEMS_PER_PAGE = 20;

function trendingScore(c: Comic) {
  return (c.likes || 0) * 0.5 + (c.views || 0) * 0.1;
}

export default function HomePage() {
  const { searchQuery, readingProgress = [], setComics } = useAppStore();
  const [activeGenre, setActiveGenre] = useState<Genre | "All">("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: backendComics = [], isLoading } = useListComics();
  const { data: trendingBackend = [] } = useGetTrending();

  /* NORMALIZE */
  const allComics: Comic[] = useMemo(() => {
    return (backendComics || [])
      .filter((c) => isValidUrl(c?.coverUrl))
      .map((c) => ({
        id: String(c.id),
        title: c.title || "Untitled",
        description: c.description || "",
        author: c.author || "Unknown",
        coverImage: c.coverUrl || "",
        genres: (c.genres || []) as Genre[],
        status: "ongoing",
        likes: Number(c.likesCount || 0),
        views: Number(c.viewsCount || 0),
        rating: 4.5,
        chapters: [],
        createdAt: Number(c.createdAt || Date.now()),
        updatedAt: Number(c.updatedAt || Date.now()),
        isFeatured: !!c.isFeatured,
        isTrending: !!c.isTrending,
        isPinned: !!c.isPinned,
        creatorId: c.creatorId,
        isOwnerComic: !!c.ownerUploaded,
      }));
  }, [backendComics]);

  useEffect(() => {
    if (allComics.length) setComics(allComics);
  }, [allComics, setComics]);

  const filtered = useMemo(() => {
    return allComics.filter((c) => {
      const matchGenre =
        activeGenre === "All" || c.genres.includes(activeGenre);

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q);

      return matchGenre && matchSearch;
    });
  }, [allComics, activeGenre, searchQuery]);

  const paginated = filtered.slice(0, visibleCount);
  const hasMore = paginated.length < filtered.length;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeGenre, searchQuery]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((p) => p + ITEMS_PER_PAGE);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const heroComic = allComics[0];

  const trending = useMemo(() => {
    if (trendingBackend?.length) {
      return trendingBackend
        .map((t) => allComics.find((c) => c.id === String(t.id)))
        .filter(Boolean) as Comic[];
    }

    return [...allComics]
      .sort((a, b) => trendingScore(b) - trendingScore(a))
      .slice(0, 6);
  }, [allComics, trendingBackend]);

  return (
    <div className="min-h-screen pb-20">
      {heroComic && <HeroBanner comic={heroComic} />}

      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <section>
          <div className="flex gap-2 overflow-x-auto">
            {ALL_GENRES.map((g) => (
              <GenreChip
                key={g}
                genre={g}
                isActive={activeGenre === g}
                onClick={() => setActiveGenre(g)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {paginated.map((c) => (
              <ComicCard key={c.id} comic={c} />
            ))}
          </div>
          {hasMore && <div ref={sentinelRef} className="h-10" />}
        </section>

        <section>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame /> Trending
          </h2>

          <div className="flex gap-3 overflow-x-auto">
            {trending.map((c) => (
              <ComicCard key={c.id} comic={c} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
        }
