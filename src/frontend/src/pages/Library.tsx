import { ComicCard } from "@/components/ui/ComicCard";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export default function LibraryPage() {
  const { comics, readingProgress } = useAppStore();

  const continueReadingComics = readingProgress
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

      {continueReadingComics.length === 0 ? (
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
          {continueReadingComics.map((item, i) =>
            item ? (
              <ComicCard key={item.comic.id} comic={item.comic} index={i} />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
