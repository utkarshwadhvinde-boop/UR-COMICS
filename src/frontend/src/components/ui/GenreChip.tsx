import { cn } from "@/lib/utils";
import type { Genre } from "@/types";

interface GenreChipProps {
  genre: Genre | "All";
  isActive?: boolean;
  onClick?: () => void;
  index?: number;
}

const GENRE_EMOJIS: Record<string, string> = {
  All: "✨",
  Fantasy: "🧙",
  "Sci-Fi": "🚀",
  Action: "⚔️",
  Romance: "💕",
  Thriller: "🔍",
  Horror: "👻",
  "Slice of Life": "🌸",
  Comedy: "😂",
  Drama: "🎭",
  Adventure: "🗺️",
};

export function GenreChip({
  genre,
  isActive = false,
  onClick,
  index = 0,
}: GenreChipProps) {
  const emoji = GENRE_EMOJIS[genre] ?? "📖";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-smooth btn-press select-none whitespace-nowrap",
        isActive
          ? "gradient-primary text-white shadow-glow border-0 scale-105"
          : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground border border-border hover:border-primary/30",
      )}
      data-ocid={`genre.tab.${index + 1}`}
      aria-pressed={isActive}
    >
      <span className="text-base leading-none">{emoji}</span>
      {genre}
    </button>
  );
}

export const ALL_GENRES: (Genre | "All")[] = [
  "All",
  "Fantasy",
  "Sci-Fi",
  "Action",
  "Romance",
  "Thriller",
  "Horror",
  "Slice of Life",
  "Comedy",
  "Drama",
  "Adventure",
];
