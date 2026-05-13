import type { Comic, ComicView, ReadProgress } from "@/backend";
import { ErrorFallback } from "@/components/ErrorFallback";
import { SkeletonCardRow } from "@/components/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useComics } from "@/hooks/useComics";
import { useResumeReading, useTrending } from "@/hooks/useTrending";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Eye,
  Flame,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Comic Card ────────────────────────────────────────────────────────────────
function ComicCard({
  comic,
  index,
  hotScore,
}: { comic: ComicView; index: number; hotScore?: number }) {
  const coverUrl = comic.cover_blob.getDirectURL();
  const updatedDate = new Date(
    Number(comic.updated_at / 1_000_000n),
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="group"
      data-ocid={`comics.item.${index + 1}`}
    >
      <Link
        to="/comics/$comicId"
        params={{ comicId: comic.id }}
        className="block"
      >
        <div className="rounded-xl overflow-hidden bg-card border border-border shadow-card group-hover:shadow-elevated group-hover:border-accent/30 transition-smooth">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={coverUrl}
              alt={comic.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-smooth"
              loading="lazy"
            />
            {/* gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            {/* Hot score badge */}
            {hotScore !== undefined && hotScore > 0 && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-0.5 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-body font-semibold text-accent border border-accent/30">
                  🔥 {Math.round(hotScore)}
                </span>
              </div>
            )}
            {/* "Read" pill on hover */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-smooth">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-body font-semibold text-accent-foreground">
                <BookOpen className="w-3 h-3" /> Read Now
              </span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-1">
            <h3 className="font-display text-sm text-foreground line-clamp-2 leading-snug">
              {comic.title}
            </h3>
            <p className="text-xs text-muted-foreground font-body line-clamp-1">
              by {comic.author_id.toText().slice(0, 12)}…
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground font-body">
                {updatedDate}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({
  title,
  icon: Icon,
  actionLabel,
  actionTo,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2.5">
        <Icon className="w-5 h-5 text-accent" />
        <h2 className="font-display text-3xl text-foreground">{title}</h2>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-smooth font-body"
        >
          {actionLabel}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

// ─── Trending Row Item ────────────────────────────────────────────────────────
function TrendingItem({
  comic,
  index,
  hotScore,
}: { comic: ComicView; index: number; hotScore?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`trending.item.${index + 1}`}
    >
      <Link
        to="/comics/$comicId"
        params={{ comicId: comic.id }}
        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-accent/40 hover:shadow-card transition-smooth group"
      >
        <span className="text-2xl font-display text-accent/50 w-7 text-center flex-shrink-0">
          {index + 1}
        </span>
        <img
          src={comic.cover_blob.getDirectURL()}
          alt={comic.title}
          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 shadow-card"
        />
        <div className="min-w-0 flex-1">
          <p className="font-body text-sm text-foreground font-medium truncate group-hover:text-accent transition-smooth">
            {comic.title}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Eye className="w-3 h-3" />
            {hotScore !== undefined && hotScore > 0 ? (
              <span className="text-accent font-semibold">
                🔥 {Math.round(hotScore)}
              </span>
            ) : (
              "Trending now"
            )}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-smooth flex-shrink-0" />
      </Link>
    </motion.div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  const { data: comics, isLoading, isError, isFetching, refetch } = useComics();
  const { data: trending } = useTrending(6);
  const { data: resumeItems, isLoading: resumeLoading } = useResumeReading();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");

  const allComics = comics ?? [];
  const filtered = search.trim()
    ? allComics.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      )
    : allComics;

  // Use useTrending results; fall back to allComics.slice if empty
  const trendingComics =
    trending && trending.length > 0
      ? trending
          .slice(0, 6)
          .map((entry) => allComics.find((c) => c.id === entry.comic_id))
          .filter((c): c is ComicView => c !== undefined)
      : allComics.slice(0, 6);

  const trendingWithScores = (trending ?? []).reduce<Record<string, number>>(
    (acc, t) => {
      acc[t.comic_id] = t.hot_score;
      return acc;
    },
    {},
  );

  return (
    <div className="bg-background min-h-screen">
      {/* ── Resume Reading (auth-only) ─────────────────────────────── */}
      {isAuthenticated && (
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
          data-ocid="home.resume_section"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl text-foreground">
              Resume Reading
            </h2>
          </div>
          {resumeLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-28 bg-muted/40 animate-pulse rounded-lg"
                  style={{ aspectRatio: "9/16" }}
                />
              ))}
            </div>
          ) : resumeItems && resumeItems.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {resumeItems.map(
                ([comicObj, progress]: [Comic, ReadProgress], i: number) => (
                  <motion.div
                    key={comicObj.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex-shrink-0 w-28"
                    data-ocid={`home.resume.item.${i + 1}`}
                  >
                    <Link
                      to="/comics/$comicId/chapters/$chapterId"
                      params={{
                        comicId: comicObj.id,
                        chapterId: progress.chapter_id,
                      }}
                      search={{ scrollY: String(progress.scroll_pixel_y) }}
                      className="block group"
                    >
                      <div className="bg-midnight-card border border-purple-900/40 rounded-lg overflow-hidden">
                        <div
                          className="relative"
                          style={{ aspectRatio: "9/16" }}
                        >
                          <img
                            src={comicObj.cover_blob.getDirectURL()}
                            alt={comicObj.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-smooth"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                            <span className="text-[10px] text-accent font-body font-semibold">
                              Continue →
                            </span>
                          </div>
                        </div>
                        <div className="px-2 py-1.5">
                          <p className="text-[11px] font-body text-foreground line-clamp-2 leading-tight">
                            {comicObj.title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ),
              )}
            </div>
          ) : null}
        </section>
      )}

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: isAuthenticated ? "80vh" : "100vh" }}
        data-ocid="home.hero_section"
      >
        {/* Cinematic gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />

        {/* Hero content */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
          style={{ minHeight: isAuthenticated ? "80vh" : "100vh" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <Badge className="bg-accent/20 text-accent border border-accent/40 font-body text-xs mb-5 inline-flex items-center gap-1.5">
              <Flame className="w-3 h-3" />
              New releases every week
            </Badge>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground leading-none mb-6">
              Your next
              <br />
              <span className="text-accent">obsession</span>
              <br />
              starts here.
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              Thousands of webtoons and manga from independent creators —
              updated daily. Dive in.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 items-start"
            >
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 shadow-manga"
                data-ocid="home.cta_primary_button"
              >
                <a href="#new-arrivals">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Reading
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-body border-border hover:border-accent/50 hover:text-accent"
                data-ocid="home.cta_secondary_button"
              >
                <Link to="/creator">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Creator Studio
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          >
            <span className="text-xs text-muted-foreground font-body tracking-widest uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="w-0.5 h-8 bg-gradient-to-b from-accent/60 to-transparent rounded-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ── New Arrivals + Search ───────────────────────────────────── */}
      <section
        id="new-arrivals"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        data-ocid="home.featured_section"
      >
        {/* Header row with search + refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="font-display text-3xl text-foreground">
              New Arrivals
            </h2>
            {isFetching && !isLoading && (
              <RefreshCw className="w-4 h-4 text-accent animate-spin ml-1" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search comics…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 w-52 bg-card border-border font-body text-sm focus:border-accent/60 transition-smooth"
                data-ocid="home.search_input"
              />
            </div>
            {/* Refresh */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 w-9 hover:text-accent transition-smooth"
              aria-label="Refresh comics"
              data-ocid="home.refresh_button"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* States */}
        {isLoading && <SkeletonCardRow count={6} />}

        {isError && (
          <ErrorFallback
            message="Failed to load comics."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && !search && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-5"
            data-ocid="home.empty_state"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/60 border border-border flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-body font-semibold text-lg">
                No comics yet
              </p>
              <p className="text-muted-foreground font-body text-sm mt-1 max-w-xs">
                Be the first to publish! Open Creator Studio and start your
                series today.
              </p>
            </div>
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-body"
              data-ocid="home.creator_cta_button"
            >
              <Link to="/creator">
                <Sparkles className="w-4 h-4 mr-2" />
                Open Creator Studio
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && search && (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3"
            data-ocid="home.no_results_state"
          >
            <Search className="w-8 h-8 text-muted-foreground" />
            <p className="text-muted-foreground font-body text-sm">
              No comics match{" "}
              <span className="text-foreground">&ldquo;{search}&rdquo;</span>
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs text-accent font-body hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((comic, i) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                index={i}
                hotScore={trendingWithScores[comic.id]}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Trending ─────────────────────────────────────────────────── */}
      {!isLoading && !isError && trendingComics.length > 0 && (
        <section
          className="bg-muted/20 border-y border-border py-16"
          data-ocid="home.trending_section"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Trending" icon={TrendingUp} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trendingComics.map((comic, i) => (
                <TrendingItem
                  key={comic.id}
                  comic={comic}
                  index={i}
                  hotScore={trendingWithScores[comic.id]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
