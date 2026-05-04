import { j as jsxRuntimeExports, a as cn } from "./index-DQm835mL.js";
const GENRE_EMOJIS = {
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
  Adventure: "🗺️"
};
function GenreChip({
  genre,
  isActive = false,
  onClick,
  index = 0
}) {
  const emoji = GENRE_EMOJIS[genre] ?? "📖";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-smooth btn-press select-none whitespace-nowrap",
        isActive ? "gradient-primary text-white shadow-glow border-0 scale-105" : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground border border-border hover:border-primary/30"
      ),
      "data-ocid": `genre.tab.${index + 1}`,
      "aria-pressed": isActive,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: emoji }),
        genre
      ]
    }
  );
}
const ALL_GENRES = [
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
  "Adventure"
];
export {
  ALL_GENRES as A,
  GenreChip as G
};
