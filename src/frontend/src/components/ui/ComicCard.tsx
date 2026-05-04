import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber } from "@/lib/sampleData";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Comic } from "@/types";
import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Eye, Heart, Lock, Star } from "lucide-react";
import { useState } from "react";

interface ComicCardProps {
  comic: Comic;
  index?: number;
  variant?: "default" | "compact" | "featured";
  /** Pass engagement score to show it as badge (trending section) */
  engagementScore?: number;
}

export function ComicCard({
  comic,
  index = 0,
  variant = "default",
  engagementScore,
}: ComicCardProps) {
  const { currentUser, bookmarkComic, likeComic } = useAppStore();
  const isBookmarked = currentUser?.bookmarks.includes(comic.id) ?? false;
  const isLiked = currentUser?.likedComics.includes(comic.id) ?? false;
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const chapterCount = comic.chapters.length;
  const ocidBase = `comic.item.${index + 1}`;
  const firstChapterId = comic.chapters[0]?.id ?? "";

  // Hide the entire card if the cover URL is missing/invalid or failed to load
  const hasCover =
    typeof comic.coverImage === "string" &&
    comic.coverImage.length > 0 &&
    (comic.coverImage.startsWith("http://") ||
      comic.coverImage.startsWith("https://"));

  if (!hasCover || imageError) return null;

  function handleCardClick(e: React.MouseEvent) {
    if (
      comic.isPremium &&
      !currentUser?.unlockedChapters.includes(firstChapterId)
    ) {
      e.preventDefault();
      setShowPremiumModal(true);
    }
  }

  if (variant === "compact") {
    return (
      <div
        className="flex gap-3 items-start p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-smooth cursor-pointer group"
        data-ocid={ocidBase}
      >
        <Link
          to="/read/$comicId/$chapterId"
          params={{ comicId: comic.id, chapterId: firstChapterId }}
          onClick={handleCardClick}
        >
          <img
            src={comic.coverImage}
            alt={comic.title}
            className="w-14 h-20 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-smooth"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to="/read/$comicId/$chapterId"
            params={{ comicId: comic.id, chapterId: firstChapterId }}
            onClick={handleCardClick}
          >
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-smooth">
              {comic.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{comic.author}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {comic.isFeatured && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-400/20">
                ⭐ Featured
              </span>
            )}
            {comic.isPremium && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                🔒 Premium
              </span>
            )}
            {!comic.isFeatured && !comic.isPremium && comic.genres[0] && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {comic.genres[0]}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {formatNumber(comic.views)}
            </span>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              {formatNumber(comic.likes)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-1 capitalize">
            {comic.status} · {chapterCount} ch
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col rounded-2xl bg-card overflow-hidden transition-smooth border border-border/50 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]",
          variant === "featured" && "shadow-md",
        )}
        data-ocid={ocidBase}
      >
        {/* Cover image area */}
        <Link
          to="/read/$comicId/$chapterId"
          params={{ comicId: comic.id, chapterId: firstChapterId }}
          className="relative block overflow-hidden aspect-[2/3]"
          onClick={handleCardClick}
          data-ocid={`${ocidBase}.link`}
        >
          <img
            src={comic.coverImage}
            alt={comic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

          {/* Premium lock overlay on hover */}
          {comic.isPremium && (
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
              <div className="bg-background/90 rounded-2xl px-4 py-3 flex flex-col items-center gap-1 shadow-lg">
                <Lock className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">
                  Premium
                </span>
              </div>
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {comic.isTrending && (
              <Badge className="text-[10px] px-1.5 py-0.5 gradient-primary text-white border-0 shadow-sm">
                🔥 Hot
              </Badge>
            )}
            {comic.isFeatured && (
              <Badge className="text-[10px] px-1.5 py-0.5 bg-amber-500/90 text-white border-0 shadow-sm">
                ⭐ Featured
              </Badge>
            )}
            {comic.isPremium && (
              <Badge className="text-[10px] px-1.5 py-0.5 bg-black/70 text-amber-400 border-0 shadow-sm">
                🔒 Premium
              </Badge>
            )}
          </div>

          {/* Engagement score badge (trending section) */}
          {engagementScore !== undefined && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
                {formatNumber(Math.round(engagementScore))}
              </div>
            </div>
          )}

          {/* Bookmark button */}
          <button
            type="button"
            className={cn(
              "absolute bottom-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-smooth",
              "bg-background/80 opacity-0 group-hover:opacity-100 hover:bg-primary/20 z-10",
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              bookmarkComic(comic.id);
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            data-ocid={`${ocidBase}.bookmark_button`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-primary" />
            ) : (
              <Bookmark className="w-4 h-4 text-foreground" />
            )}
          </button>

          {/* Chapter count */}
          {engagementScore === undefined && (
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] font-medium text-foreground z-10">
              {chapterCount} ch
            </div>
          )}
        </Link>

        {/* Info section */}
        <div className="p-3 flex flex-col gap-1.5">
          <Link
            to="/read/$comicId/$chapterId"
            params={{ comicId: comic.id, chapterId: firstChapterId }}
            onClick={handleCardClick}
          >
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-smooth">
              {comic.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground truncate">
            {comic.author}
          </p>

          {/* Genre tag */}
          {comic.genres[0] && (
            <span className="self-start text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {comic.genres[0]}
            </span>
          )}

          {/* Stats row */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-foreground">
                {comic.rating}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                {formatNumber(comic.views)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  likeComic(comic.id);
                }}
                className={cn(
                  "flex items-center gap-0.5 text-xs transition-smooth btn-press",
                  isLiked
                    ? "text-rose-500"
                    : "text-muted-foreground hover:text-rose-400",
                )}
                aria-label="Like"
                data-ocid={`${ocidBase}.like_button`}
              >
                <Heart className={cn("w-3 h-3", isLiked && "fill-rose-500")} />
                {formatNumber(comic.likes)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium unlock modal */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent
          className="max-w-sm rounded-2xl"
          data-ocid="premium.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              Premium Content
            </DialogTitle>
            <DialogDescription>
              This comic requires UR Coins to unlock.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={comic.coverImage}
                alt={comic.title}
                className="w-12 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {comic.title}
                </p>
                <p className="text-xs text-muted-foreground">{comic.author}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-500 text-xs font-bold">
                    🪙 {comic.chapters[0]?.coinCost ?? 3} coins
                  </span>
                  <span className="text-xs text-muted-foreground">
                    per chapter
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You have{" "}
              <span className="text-amber-500 font-semibold">
                🪙 {currentUser?.coins ?? 0} coins
              </span>{" "}
              available.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowPremiumModal(false)}
              data-ocid="premium.cancel_button"
            >
              Cancel
            </Button>
            <Link to="/coins" className="flex-1">
              <Button
                className="w-full gradient-primary text-white border-0 rounded-xl shadow-glow"
                data-ocid="premium.get_coins_button"
              >
                Get Coins
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
