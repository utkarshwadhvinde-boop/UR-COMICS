import { ErrorFallback } from "@/components/ErrorFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapters } from "@/hooks/useChapters";
import { useComic } from "@/hooks/useComic";
import { useReadProgress } from "@/hooks/useReadProgress";
import type { Chapter } from "@/types/index";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Lock,
  User,
} from "lucide-react";
import { motion } from "motion/react";

// ─── Chapter Row ──────────────────────────────────────────────────────────────
function ChapterRow({
  chapter,
  comicId,
  index,
}: {
  chapter: Chapter;
  comicId: string;
  index: number;
}) {
  const date = new Date(chapter.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      data-ocid={`comic_detail.chapters.item.${index + 1}`}
    >
      <Link
        to="/comics/$comicId/chapters/$chapterId"
        params={{ comicId, chapterId: chapter.id }}
        className="flex items-center justify-between p-4 rounded-xl bg-card border border-accent/30 hover:border-accent/60 hover:bg-purple-900/30 hover:shadow-card transition-smooth group"
        data-ocid={`comic_detail.chapter_read_link.${index + 1}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Chapter number bubble */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <span className="text-accent font-display text-sm leading-none">
              {chapter.chapter_number}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm text-foreground font-medium truncate group-hover:text-accent transition-smooth">
              {chapter.title ?? `Chapter ${chapter.chapter_number}`}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Calendar className="w-3 h-3" />
              {date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-body font-medium text-accent border border-accent/30 bg-accent/10 rounded-full px-2.5 py-0.5 group-hover:bg-accent/20 transition-smooth">
            Read <ChevronRight className="w-3 h-3" />
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-smooth sm:hidden" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Comic Detail Page ────────────────────────────────────────────────────────
export function ComicDetailPage() {
  const { comicId } = useParams({ from: "/comics/$comicId" });
  const {
    data: comic,
    isLoading: comicLoading,
    isError: comicError,
    refetch: refetchComic,
  } = useComic(comicId);
  const {
    data: chapters,
    isLoading: chaptersLoading,
    isError: chaptersError,
    refetch: refetchChapters,
  } = useChapters(comicId);
  const { data: progress } = useReadProgress(undefined, comicId);

  const publishedChapters = (chapters ?? [])
    .filter((ch) => ch.is_published)
    .sort((a, b) => a.chapter_number - b.chapter_number);
  const firstChapter = publishedChapters[0];

  if (comicError) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <ErrorFallback
          message="Failed to load comic."
          onRetry={() => refetchComic()}
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen" data-ocid="comic_detail.page">
      {/* ── Cover Hero ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)",
        }}
      >
        {/* Blurred backdrop from cover */}
        {!comicLoading && comic?.cover_url && (
          <div
            className="absolute inset-0 opacity-15 blur-2xl scale-110"
            style={{
              backgroundImage: `url(${comic.cover_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back nav */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-8 font-body group"
            data-ocid="comic_detail.back_link"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-smooth" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
            {/* Cover image */}
            {comicLoading ? (
              <Skeleton className="w-44 h-64 sm:w-52 sm:h-72 rounded-xl flex-shrink-0 bg-muted" />
            ) : comic ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex-shrink-0"
              >
                {comic.cover_url ? (
                  <img
                    src={comic.cover_url}
                    alt={comic.title}
                    className="w-44 sm:w-52 h-auto rounded-xl shadow-manga object-cover"
                  />
                ) : (
                  <div className="w-44 sm:w-52 aspect-[9/14] rounded-xl bg-muted/60 border border-border flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* Info */}
            <div className="flex flex-col justify-end gap-4 min-w-0">
              {comicLoading ? (
                <>
                  <Skeleton className="h-9 w-72 bg-muted" />
                  <Skeleton className="h-4 w-full max-w-sm bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-2/3 bg-muted" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                    <Skeleton className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                </>
              ) : comic ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col gap-3"
                >
                  <h1 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
                    {comic.title}
                  </h1>
                  <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed">
                    {comic.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge className="bg-accent/15 text-accent border border-accent/30 font-body inline-flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {publishedChapters.length} Chapter
                      {publishedChapters.length !== 1 ? "s" : ""}
                    </Badge>
                    <Badge className="bg-muted text-muted-foreground border border-border font-body inline-flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {comic.author_name ?? comic.author_id.slice(0, 10)}…
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {/* Continue Reading button — shown when progress exists */}
                    {progress?.last_chapter_id && (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-fit border-accent/50 text-accent hover:bg-accent/10 font-body font-semibold"
                        data-ocid="comic_detail.continue_button"
                      >
                        <Link
                          to="/comics/$comicId/chapters/$chapterId"
                          params={{
                            comicId,
                            chapterId: progress.last_chapter_id,
                          }}
                        >
                          <BookOpen className="w-5 h-5 mr-2" />
                          Continue Reading →
                        </Link>
                      </Button>
                    )}
                    {firstChapter && (
                      <Button
                        asChild
                        size="lg"
                        className="w-fit bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold shadow-manga"
                        data-ocid="comic_detail.read_button"
                      >
                        <Link
                          to="/comics/$comicId/chapters/$chapterId"
                          params={{ comicId, chapterId: firstChapter.id }}
                        >
                          <BookOpen className="w-5 h-5 mr-2" />
                          Start Reading
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Chapter List ─────────────────────────────────────────────── */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-ocid="comic_detail.chapters_section"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-accent" />
            <h2 className="font-display text-3xl text-foreground">Chapters</h2>
            {!chaptersLoading && (
              <span className="ml-1 text-sm text-muted-foreground font-body">
                ({publishedChapters.length})
              </span>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {chaptersLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <Skeleton className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-3 w-1/4 bg-muted" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {chaptersError && (
          <ErrorFallback
            message="Failed to load chapters."
            onRetry={() => refetchChapters()}
          />
        )}

        {/* Empty state */}
        {!chaptersLoading &&
          !chaptersError &&
          publishedChapters.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="comic_detail.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center">
                <Lock className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-body font-semibold">
                  No chapters yet
                </p>
                <p className="text-muted-foreground font-body text-sm mt-1">
                  The creator hasn&apos;t published any chapters yet. Check back
                  soon!
                </p>
              </div>
            </div>
          )}

        {/* Chapter list */}
        {!chaptersLoading && !chaptersError && publishedChapters.length > 0 && (
          <div className="flex flex-col gap-2">
            {publishedChapters.map((ch, i) => (
              <ChapterRow
                key={ch.id}
                chapter={ch}
                comicId={comicId}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
