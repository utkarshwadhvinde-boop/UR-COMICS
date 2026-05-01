import { GenreChip } from "@/components/ui/GenreChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_FAQS } from "@/lib/sampleData";
import type { FAQ } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Search,
  Star,
  ThumbsUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LS_FAQS_KEY = "ur_comics_faqs";
const LS_VOTES_KEY = "ur_comics_faq_votes";

const FAQ_CATEGORIES = [
  "All",
  "Getting Started",
  "Reading",
  "Creators",
  "Coins & Premium",
  "Account",
] as const;

type FaqCategory = (typeof FAQ_CATEGORIES)[number];

const EXTENDED_SAMPLE_FAQS: FAQ[] = [
  ...SAMPLE_FAQS,
  {
    id: "faq-6",
    question: "How do I create an account on UR Comics?",
    answer:
      "Click 'Sign Up' in the top navigation. Enter a username, email, and password. Your account is created instantly with 100 free UR Coins to get you started.",
    category: "Getting Started",
    upvotes: 63,
    isApproved: true,
    createdAt: Date.now() - 35 * 86400000,
  },
  {
    id: "faq-7",
    question: "Is UR Comics free to use?",
    answer:
      "Yes! UR Comics is free to join and read. Most comics are completely free. Some chapters are marked Premium and require UR Coins to unlock, but a large library is always free.",
    category: "Getting Started",
    upvotes: 88,
    isApproved: true,
    createdAt: Date.now() - 40 * 86400000,
  },
  {
    id: "faq-8",
    question: "Can I read comics offline?",
    answer:
      "Currently, UR Comics requires an internet connection. We are working on an offline mode feature that will allow you to download chapters for later reading.",
    category: "Reading",
    upvotes: 34,
    isApproved: true,
    createdAt: Date.now() - 18 * 86400000,
  },
  {
    id: "faq-9",
    question: "How do I unlock a premium chapter?",
    answer:
      "Open the chapter you want to unlock and click the 'Unlock' button. The required coin amount will be deducted from your balance. Unlocked chapters stay accessible permanently.",
    category: "Coins & Premium",
    upvotes: 47,
    isApproved: true,
    createdAt: Date.now() - 22 * 86400000,
  },
  {
    id: "faq-10",
    question: "How do I change my username or profile picture?",
    answer:
      "Go to your Profile page by clicking your avatar in the sidebar. Click 'Edit Profile' to update your username, bio, or profile picture.",
    category: "Account",
    upvotes: 19,
    isApproved: true,
    createdAt: Date.now() - 8 * 86400000,
  },
  {
    id: "faq-11",
    question: "Can creators earn money on UR Comics?",
    answer:
      "Yes! Creators earn UR Coins whenever readers unlock their premium chapters. Coins can be tracked in the Creator Dashboard. Monetization features and payout options are continually expanding.",
    category: "Creators",
    upvotes: 52,
    isApproved: true,
    createdAt: Date.now() - 28 * 86400000,
  },
  {
    id: "faq-12",
    question: "What formats can I upload for comic pages?",
    answer:
      "You can upload comic pages as JPG, PNG, or WebP images. Each chapter supports up to 50 pages. Cover images should be at least 400×600 pixels for best display quality.",
    category: "Creators",
    upvotes: 26,
    isApproved: true,
    createdAt: Date.now() - 14 * 86400000,
  },
];

function loadFAQsFromStorage(): FAQ[] {
  try {
    const raw = localStorage.getItem(LS_FAQS_KEY);
    return raw ? (JSON.parse(raw) as FAQ[]) : [];
  } catch {
    return [];
  }
}

function saveFAQsToStorage(faqs: FAQ[]): void {
  // Only persist non-sample FAQs (user questions and admin-added)
  const nonSample = faqs.filter(
    (f) => !EXTENDED_SAMPLE_FAQS.some((s) => s.id === f.id),
  );
  localStorage.setItem(LS_FAQS_KEY, JSON.stringify(nonSample));
}

function loadVotes(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_VOTES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveVotes(votes: Record<string, boolean>): void {
  localStorage.setItem(LS_VOTES_KEY, JSON.stringify(votes));
}

function mergeWithStorage(): FAQ[] {
  const stored = loadFAQsFromStorage();
  const ids = new Set(EXTENDED_SAMPLE_FAQS.map((f) => f.id));
  const extra = stored.filter((f) => !ids.has(f.id));
  return [...EXTENDED_SAMPLE_FAQS, ...extra];
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(() => mergeWithStorage());
  const [votes, setVotes] = useState<Record<string, boolean>>(() =>
    loadVotes(),
  );
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Ask-a-question form
  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askQuestion, setAskQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    saveFAQsToStorage(faqs);
  }, [faqs]);

  const filtered = faqs.filter((faq) => {
    const matchesCat =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch && faq.isApproved;
  });

  const handleVote = (id: string) => {
    if (votes[id]) {
      toast("You already voted for this answer.");
      return;
    }
    const newVotes = { ...votes, [id]: true };
    setVotes(newVotes);
    saveVotes(newVotes);
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f)),
    );
    toast.success("Thanks for your feedback!");
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim()) {
      toast.error("Please enter your question.");
      return;
    }
    const newFaq: FAQ = {
      id: `user-${Date.now()}`,
      question: askQuestion.trim(),
      answer: "",
      category: "Getting Started",
      upvotes: 0,
      isApproved: false,
      createdAt: Date.now(),
    };
    setFaqs((prev) => [...prev, newFaq]);
    setAskName("");
    setAskEmail("");
    setAskQuestion("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" data-ocid="faq.page">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-display font-bold text-foreground">
          Help &amp; FAQs
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Find answers to the most common questions about UR Comics.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions..."
          className="pl-12 rounded-2xl h-12 bg-card border-border"
          data-ocid="faq.search_input"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {FAQ_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition-smooth btn-press ${
              activeCategory === cat
                ? "gradient-primary text-primary-foreground shadow-glow border-0"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
            }`}
            data-ocid={`faq.category.tab.${i + 1}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 mb-14" data-ocid="faq.list">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-card rounded-2xl border border-border"
            data-ocid="faq.empty_state"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-foreground">No matches found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try a different category or search term.
            </p>
          </motion.div>
        ) : (
          filtered.map((faq, i) => {
            const isOpen = expanded === faq.id;
            const hasVoted = !!votes[faq.id];
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-card rounded-2xl border overflow-hidden shadow-sm transition-smooth ${
                  isOpen ? "border-primary/30" : "border-border"
                }`}
                data-ocid={`faq.item.${i + 1}`}
              >
                {/* Question header */}
                <button
                  type="button"
                  className="w-full flex items-start justify-between p-5 text-left hover:bg-muted/30 transition-smooth"
                  onClick={() => setExpanded(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  data-ocid={`faq.toggle.${i + 1}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                    {faq.isPinned && (
                      <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 fill-amber-500" />
                    )}
                    <span className="font-semibold text-foreground leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className="text-xs rounded-full hidden sm:flex"
                    >
                      {faq.category}
                    </Badge>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Answer panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border">
                        <p className="text-foreground text-sm leading-relaxed mt-4">
                          {faq.answer}
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => handleVote(faq.id)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-smooth btn-press ${
                              hasVoted
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                            }`}
                            data-ocid={`faq.vote_button.${i + 1}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Helpful ({faq.upvotes})
                          </button>
                          {faq.isPinned && (
                            <Badge className="gradient-primary text-primary-foreground border-0 text-xs rounded-full">
                              ⭐ Top Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Ask a Question */}
      <motion.div
        className="bg-card rounded-2xl border border-border p-6 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        data-ocid="faq.ask.section"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <MessageSquarePlus className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Ask a Question
            </h2>
            <p className="text-muted-foreground text-sm">
              Can't find what you're looking for? We'll answer it.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8 text-center"
              data-ocid="faq.ask.success_state"
            >
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-semibold text-foreground text-lg">
                Question submitted!
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Our team will review and publish it shortly. Thank you!
              </p>
              <Button
                className="mt-4 rounded-xl"
                variant="outline"
                onClick={() => setSubmitted(false)}
                data-ocid="faq.ask_another_button"
              >
                Ask another question
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleAsk}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ask-name">Name (optional)</Label>
                  <Input
                    id="ask-name"
                    value={askName}
                    onChange={(e) => setAskName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1 rounded-xl"
                    data-ocid="faq.ask_name_input"
                  />
                </div>
                <div>
                  <Label htmlFor="ask-email">Email (optional)</Label>
                  <Input
                    id="ask-email"
                    type="email"
                    value={askEmail}
                    onChange={(e) => setAskEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1 rounded-xl"
                    data-ocid="faq.ask_email_input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ask-question">
                  Your Question <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="ask-question"
                  value={askQuestion}
                  onChange={(e) => setAskQuestion(e.target.value)}
                  placeholder="What would you like to know about UR Comics?"
                  rows={4}
                  className="mt-1 rounded-xl resize-none"
                  data-ocid="faq.ask_question_textarea"
                />
              </div>
              <Button
                type="submit"
                className="gradient-primary text-primary-foreground border-0 rounded-xl px-6"
                data-ocid="faq.ask_submit_button"
              >
                Submit Question
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
