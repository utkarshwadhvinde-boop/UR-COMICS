import { Skeleton } from "@/components/ui/skeleton";
import { useComics } from "@/hooks/useComics";
import { useTrending } from "@/hooks/useTrending";
import { Link } from "@tanstack/react-router";
import { Flame, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

function TrendingCardSkeleton() {
  return (
    <div className="bg-midnight-card rounded-xl overflow-hidden border border-purple-900/20">
      <Skeleton className="w-full aspect-[9/14] bg-purple-900/20" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-purple-900/20" />
        <Skeleton className="h-3 w-1/2 bg-purple-900/20" />
      </div>
    </div>
  );
}

function TrendingCard({
  comic,
  rank,
}: {
  comic: import("@/types/index").Comic;
  rank: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(rank * 0.06, 0.4) }}
      data-ocid={`trending.item.${rank}`}
    >
      <Link
        to="/comics/$comicId"
        params={{ comicId: comic.id }}
        className="group block bg-midnight-card rounded-xl overflow-hidden border border-purple-900/20 hover:border-accent/40 transition-colors-fast"
        data-ocid={`trending.card_link.${rank}`}
      >
        {/* Cover */}
        <div className="relative w-full aspect-[9/14] overflow-hidden bg-purple-900/20">
          <img
            src={comic.cover_url ?? ""}
            alt={comic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Rank badge */}
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 border border-accent/50 flex items-center justify-center">
            <span className="text-xs font-display font-bold text-accent">
              {rank}
            </span>
          </div>
          {/* Hot score badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-orange-500/40">
            <Flame className="w-2.5 h-2.5 text-orange-400" />
            <span className="text-xs font-body text-orange-300">
              {0}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-body text-sm font-medium text-foreground truncate mb-1 group-hover:text-accent transition-colors-fast">
            {comic.title}
          </h3>
          <p className="text-xs text-muted-foreground font-body">
            0 views
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingPage() {
  const { data: trendingEntries, isLoading: trendingLoading } = useTrending(24);

  const trendingComics = (trendingEntries ?? []).map((comic, idx) => ({
    comic,
    rank: idx + 1,
  }));

  return (
    <div className="px-4 sm:px-6 py-8" data-ocid="trending.page">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Trending Now
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Ranked by reads and views in the last 24 hours
          </p>
        </div>
      </div>

      {/* Grid */}
      {trendingLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          data-ocid="trending.loading_state"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <TrendingCardSkeleton key={i} />
          ))}
        </div>
      ) : trendingComics.length === 0 ? (
        <div
          className="text-center py-24 text-muted-foreground font-body"
          data-ocid="trending.empty_state"
        >
          <Flame className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium text-foreground mb-1">
            Nothing trending yet
          </p>
          <p className="text-sm">
            Be the first to start reading and make something popular!
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm font-body hover:bg-accent/25 transition-colors-fast"
            data-ocid="trending.browse_link"
          >
            Browse All Comics
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {trendingComics.map(({ comic, rank }) => (
            <TrendingCard key={comic.id} comic={comic} rank={rank} />
          ))}
        </div>
      )}
    </div>
  );
}
