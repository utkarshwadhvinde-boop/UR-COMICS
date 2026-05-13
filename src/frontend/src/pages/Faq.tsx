import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: 1,
    category: "Reading",
    question: "How do I continue reading where I left off?",
    answer:
      "UR COMICS automatically saves your reading progress. Use the 'Continue Reading' section in the sidebar to jump back to the exact page and scroll position where you stopped.",
  },
  {
    id: 2,
    category: "Reading",
    question: "Why are some pages loading slowly?",
    answer:
      "High-resolution webtoon pages may take a moment to load. Pages are progressively loaded as you scroll, and the next chapter is pre-fetched automatically for a seamless experience.",
  },
  {
    id: 3,
    category: "Creators",
    question: "How do I upload my comic?",
    answer:
      "Go to Creator Studio via the sidebar, create a new comic, then upload chapters. The system uses a two-phase commit: images are verified before your chapter goes live, preventing partial uploads.",
  },
  {
    id: 4,
    category: "Creators",
    question: "What image formats are supported?",
    answer:
      "JPEG, PNG, and WebP are supported. For best performance, we recommend WebP at 800–1200px wide. Each chapter supports up to 100 pages.",
  },
  {
    id: 5,
    category: "Creators",
    question: "What happens if my upload fails partway through?",
    answer:
      "UR COMICS uses atomic publishing — if any image fails to upload, the entire chapter is automatically rolled back. No broken or empty chapters will ever appear to readers.",
  },
  {
    id: 6,
    category: "Account",
    question: "How do I log in?",
    answer:
      "Click 'Sign In' in the header or sidebar. UR COMICS uses Internet Identity — a secure, password-free authentication method built into the Internet Computer.",
  },
  {
    id: 7,
    category: "Account",
    question: "Can I change my display name and bio?",
    answer:
      "Yes! Once logged in, navigate to your profile page. You can update your display name, bio, and profile picture at any time.",
  },
];

const CATEGORIES = ["All", "Reading", "Creators", "Account"];

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-purple-900/30 rounded-lg overflow-hidden bg-midnight-card"
      data-ocid={`faq.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-purple-900/20 transition-colors-fast"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-ocid={`faq.toggle.${index + 1}`}
      >
        <span className="font-body text-sm text-foreground pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-accent transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-4 text-sm text-muted-foreground font-body leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !search ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12" data-ocid="faq.page">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 mb-4">
          <HelpCircle className="w-6 h-6 text-accent" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Help &amp; FAQ
        </h1>
        <p className="text-muted-foreground font-body text-sm">
          Everything you need to know about UR COMICS.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-midnight-card border border-purple-900/30 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-accent/60 transition-colors-fast"
          data-ocid="faq.search_input"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors-fast border ${
              activeCategory === cat
                ? "bg-accent/20 border-accent/50 text-accent"
                : "bg-transparent border-purple-900/30 text-muted-foreground hover:border-accent/30 hover:text-foreground"
            }`}
            data-ocid={`faq.category_filter.${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((item, idx) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 text-muted-foreground font-body"
          data-ocid="faq.empty_state"
        >
          <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No results found for &ldquo;{search}&rdquo;.</p>
        </div>
      )}
    </div>
  );
}
