import { ComicCard } from "@/components/ui/ComicCard";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { Link } from "@tanstack/react-router";
import { BookOpen, Flame, Sparkles } from "lucide-react";

export default function TrendingPage() {
  const { comics } = useAppStore();
  const trending = [...comics].sort((a, b) => b.views - a.views);

  return (
    <div
      className="max-w-screen-xl mx-auto px-4 py-10"
      data-ocid="trending.page"
    >
      <div className="flex items-center gap-3 mb-8">
        <Flame className="w-7 h-7 text-orange-500" />
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Trending Now
          </h1>
          <p className="text-muted-foreground text-sm">
            Most popular comics this week
          </p>
        </div>
      </div>

      {trending.length === 0 ? (
        /* Empty state — no comics on the platform yet */
        <div
          className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-card border border-border/50 text-center"
          data-ocid="trending.empty_state"
        >
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
            Once comics are uploaded, the most popular ones will appear here
            ranked by views and engagement.
          </p>

          <Link to="/create">
            <Button
              className="gradient-primary text-white border-0 px-8 py-3 h-auto rounded-2xl font-semibold text-base shadow-glow hover:opacity-90 transition-smooth btn-press"
              data-ocid="trending.upload_cta_button"
            >
              📤 Upload Your Comic
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trending.map((comic, i) => (
            <ComicCard key={comic.id} comic={comic} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
