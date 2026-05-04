import type { Chapter, Comic, FAQ } from "../types";

const makeChapters = (comicId: string, count: number): Chapter[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${comicId}-ch${i + 1}`,
    comicId,
    title: `Chapter ${i + 1}`,
    chapterNumber: i + 1,
    pages: Array.from(
      { length: 8 },
      () => "/assets/generated/placeholder-page.jpg",
    ),
    imageOrder: [],
    chapterStatus: "published" as const,
    publishedAt: Date.now() - (count - i) * 86400000 * 7,
    creatorId: "owner",
    createdAt: Date.now() - (count - i) * 86400000 * 7,
    updatedAt: Date.now() - (count - i) * 86400000,
    isPremium: i >= 2,
    coinCost: i >= 2 ? 3 : 0,
    views: Math.floor(Math.random() * 50000) + 5000,
  }));

export const SAMPLE_COMICS: Comic[] = [
  {
    id: "lost-realm",
    title: "The Lost Realm",
    description:
      "A young mage discovers a hidden realm where ancient magic still flows freely — but darker forces have been waiting for someone exactly like him. An epic journey of power, sacrifice, and destiny begins.",
    author: "Mira Sunstone",
    coverImage: "/assets/generated/cover-lost-realm.dim_400x600.jpg",
    genres: ["Fantasy", "Adventure"],
    status: "ongoing",
    likes: 24800,
    views: 1500000,
    rating: 4.8,
    chapters: makeChapters("lost-realm", 4),
    createdAt: Date.now() - 90 * 86400000,
    updatedAt: Date.now() - 2 * 86400000,
    isFeatured: true,
    isTrending: true,
    isPremium: false,
    isPinned: true,
    creatorId: "owner",
    isOwnerComic: true,
  },
  {
    id: "echoes-tomorrow",
    title: "Echoes of Tomorrow",
    description:
      "In 2187, a brilliant cybernetic engineer uncovers a conspiracy that could unravel humanity's future. With time running out and enemies at every turn, she must decide how far she'll go to save the world.",
    author: "Kael Drenov",
    coverImage: "/assets/generated/cover-echoes-tomorrow.dim_400x600.jpg",
    genres: ["Sci-Fi", "Action"],
    status: "ongoing",
    likes: 19200,
    views: 1200000,
    rating: 4.7,
    chapters: makeChapters("echoes-tomorrow", 3),
    createdAt: Date.now() - 60 * 86400000,
    updatedAt: Date.now() - 3 * 86400000,
    isFeatured: true,
    isTrending: true,
    isPremium: false,
    isPinned: false,
    creatorId: "owner",
    isOwnerComic: true,
  },
  {
    id: "rise-of-shadows",
    title: "Rise of Shadows",
    description:
      "When the last guardian falls, a lone warrior with a dark past must rise to face an immortal army of shadows threatening to plunge the world into eternal darkness. Every strike could be his last.",
    author: "Zane Blackthorn",
    coverImage: "/assets/generated/cover-rise-of-shadows.dim_400x600.jpg",
    genres: ["Action", "Fantasy"],
    status: "ongoing",
    likes: 31500,
    views: 2100000,
    rating: 4.9,
    chapters: makeChapters("rise-of-shadows", 4),
    createdAt: Date.now() - 120 * 86400000,
    updatedAt: Date.now() - 86400000,
    isFeatured: false,
    isTrending: true,
    isPremium: false,
    isPinned: false,
    creatorId: "owner",
    isOwnerComic: true,
  },
  {
    id: "love-in-neon",
    title: "Love in Neon",
    description:
      "Two strangers keep crossing paths in a rain-soaked neon city. She's a street artist chasing her dreams. He's an heir running from his destiny. Their worlds collide — and neither will ever be the same.",
    author: "Sera Voss",
    coverImage: "/assets/generated/cover-love-in-neon.dim_400x600.jpg",
    genres: ["Romance", "Drama"],
    status: "ongoing",
    likes: 14600,
    views: 980000,
    rating: 4.6,
    chapters: makeChapters("love-in-neon", 3),
    createdAt: Date.now() - 45 * 86400000,
    updatedAt: Date.now() - 4 * 86400000,
    isFeatured: false,
    isTrending: false,
    isPremium: false,
    isPinned: false,
    creatorId: "creator-1",
    isOwnerComic: false,
  },
  {
    id: "midnight-chronicles",
    title: "Midnight Chronicles",
    description:
      "A disgraced detective is pulled back into a world of shadow organizations and impossible crimes. With only his wits and a cryptic note, he must solve the case that nearly destroyed him before — or finish the job.",
    author: "Roman Dusk",
    coverImage: "/assets/generated/cover-midnight-chronicles.dim_400x600.jpg",
    genres: ["Thriller", "Drama"],
    status: "ongoing",
    likes: 11900,
    views: 870000,
    rating: 4.5,
    chapters: makeChapters("midnight-chronicles", 3),
    createdAt: Date.now() - 30 * 86400000,
    updatedAt: Date.now() - 5 * 86400000,
    isFeatured: false,
    isTrending: false,
    isPremium: false,
    isPinned: false,
    creatorId: "creator-2",
    isOwnerComic: false,
  },
];

export const SAMPLE_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "How do I start reading a comic?",
    answer:
      "Simply click on any comic cover to open its detail page, then click 'Read Now' or select a specific chapter to start reading.",
    category: "Reading",
    upvotes: 42,
    isApproved: true,
    createdAt: Date.now() - 30 * 86400000,
  },
  {
    id: "faq-2",
    question: "What are UR Coins and how do I get them?",
    answer:
      "UR Coins are the platform currency used to unlock premium chapters. You can earn them through daily streaks, reading activities, or purchase coin packages in the Coins shop.",
    category: "Coins & Premium",
    upvotes: 38,
    isApproved: true,
    createdAt: Date.now() - 25 * 86400000,
  },
  {
    id: "faq-3",
    question: "How do I upload my own comic?",
    answer:
      "Go to the Upload section in the sidebar or visit /create. Fill in your comic details, upload a cover image, add genres, and start adding chapters. Your comic will be published instantly.",
    category: "Creators",
    upvotes: 29,
    isApproved: true,
    createdAt: Date.now() - 20 * 86400000,
  },
  {
    id: "faq-4",
    question: "Does my reading progress save automatically?",
    answer:
      "Yes! Your reading progress is saved continuously as you scroll. When you come back to a comic, it will automatically resume from where you left off.",
    category: "Reading",
    upvotes: 55,
    isApproved: true,
    createdAt: Date.now() - 15 * 86400000,
  },
  {
    id: "faq-5",
    question: "How does the daily streak work?",
    answer:
      "Log in and read at least one chapter every day to maintain your streak. Streaks earn you bonus UR Coins and unlock special badges displayed on your profile.",
    category: "Getting Started",
    upvotes: 21,
    isApproved: true,
    createdAt: Date.now() - 10 * 86400000,
  },
];

export function getComicById(id: string): Comic | undefined {
  return SAMPLE_COMICS.find((c) => c.id === id);
}

export function getChapterById(
  comicId: string,
  chapterId: string,
): Chapter | undefined {
  const comic = getComicById(comicId);
  return comic?.chapters.find((ch) => ch.id === chapterId);
}

export function getTrending(): Comic[] {
  return SAMPLE_COMICS.filter((c) => c.isTrending).sort(
    (a, b) => b.views - a.views,
  );
}

export function getFeatured(): Comic[] {
  return SAMPLE_COMICS.filter((c) => c.isFeatured || c.isPinned).sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0),
  );
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
