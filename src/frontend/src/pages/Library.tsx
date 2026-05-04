import { ComicCard } from "@/components/ui/ComicCard";
import { Button } from "@/components/ui/button";
import { useListComicsQuery, useListProgress } from "@/hooks/useBackend";
import { useAppStore } from "@/store";
import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export default function LibraryPage() {
  const { currentUser, readingProgress: localProgress } = useAppStore();
  const userId = currentUser?.id ?? null;

  const { data: backendComics = [] } = useListComicsQuery();
  const { data: backendProgress = [] } = useListProgress(userId);

  const comics = backendComics.map((c) => ({
    id: String(c.id),
    title: c.title,
    coverImage: c.coverUrl,
    author: c.author,
    chapters: [] as { id: string; chapterNumber: number; title: string }[],
  }));

  // Use backend progress if available, fall back to local store
  const mergedProgress =
    backendProgress.length > 0
      ? backendProgress.map((p) => ({
          comicId: String(p.comicId),
          chapterId: String(p.chapterId),
          scrollPosition: Number(p.scrollPosition),
          lastReadAt: Number(p.lastReadAt),
          chapterNumber: 0,
        }))
      : localProgress;

  const continueReadingItems = mergedProgress
    .sort((a, b) => b.lastReadAt - a.lastReadAt)
    .map((p) => {
      const comic = comics.find((c) => c.id === p.comicId);
      if (!comic) return null;
      const chapter = comic.chapters.find((ch) => ch.id === p.chapterId);
      return { comic, progress: p, chapter };
    })
    .filter(Boolean);

  return (
    <div
      className="max-w-screen-xl mx-auto px-4 py-10"
      data-ocid="library.page"
    >
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Continue Reading
          </h1>
          <p className="text-muted-foreground text-sm">
            Pick up where you left off
          </p>
        </div>
      </div>

      {continueReadingItems.length === 0 ? (
        <div
          className="text-center py-20 bg-card rounded-2xl border border-border"
          data-ocid="library.empty_state"
        >
          <p className="text-5xl mb-4">📚</p>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nothing to continue yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Start reading comics and they'll appear here.
          </p>
          <Link to="/">
            <Button className="gradient-primary text-primary-foreground border-0 rounded-xl">
              Explore Comics
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {continueReadingItems.map((item, i) =>
            item ? (
              <Link
                key={item.comic.id}
                to="/read/$comicId/$chapterId"
                params={{
                  comicId: item.comic.id,
                  chapterId: item.progress.chapterId,
                }}
                className="group block"
                data-ocid={`library.item.${i + 1}`}
              >
                <div className="relative">
                  <img
                    src={item.comic.coverImage}
                    alt={item.comic.title}
                    className="w-full aspect-[3/4] object-cover rounded-2xl group-hover:scale-105 transition-smooth"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs font-semibold text-white line-clamp-2">
                      {item.comic.title}
                    </p>
                    <p className="text-[10px] text-white/70 mt-0.5">
                      {item.comic.author}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/80 text-white font-medium backdrop-blur-sm">
                      Resume
                    </span>
                  </div>
                </div>
              </Link>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
