import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, K as Search, I as Input, h as Badge, f as Button, M as SAMPLE_FAQS } from "./index-CK63xfI2.js";
import { L as Label } from "./label-neAfH2H1.js";
import { T as Textarea } from "./textarea-DBBPBmR7.js";
import { u as ue } from "./index-DEuOM354.js";
import { m as motion } from "./proxy-CpH_T6lT.js";
import { S as Star } from "./star-Dkq_K0ZL.js";
import { A as AnimatePresence } from "./index-CNsww1Fk.js";
import { T as ThumbsUp } from "./thumbs-up-CdjIJlIH.js";
import "./index-DQcuy1C9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M12 7v6", key: "lw1j43" }],
  ["path", { d: "M9 10h6", key: "9gxzsh" }]
];
const MessageSquarePlus = createLucideIcon("message-square-plus", __iconNode);
const LS_FAQS_KEY = "ur_comics_faqs";
const LS_VOTES_KEY = "ur_comics_faq_votes";
const FAQ_CATEGORIES = [
  "All",
  "Getting Started",
  "Reading",
  "Creators",
  "Coins & Premium",
  "Account"
];
const EXTENDED_SAMPLE_FAQS = [
  ...SAMPLE_FAQS,
  {
    id: "faq-6",
    question: "How do I create an account on UR Comics?",
    answer: "Click 'Sign Up' in the top navigation. Enter a username, email, and password. Your account is created instantly with 100 free UR Coins to get you started.",
    category: "Getting Started",
    upvotes: 63,
    isApproved: true,
    createdAt: Date.now() - 35 * 864e5
  },
  {
    id: "faq-7",
    question: "Is UR Comics free to use?",
    answer: "Yes! UR Comics is free to join and read. Most comics are completely free. Some chapters are marked Premium and require UR Coins to unlock, but a large library is always free.",
    category: "Getting Started",
    upvotes: 88,
    isApproved: true,
    createdAt: Date.now() - 40 * 864e5
  },
  {
    id: "faq-8",
    question: "Can I read comics offline?",
    answer: "Currently, UR Comics requires an internet connection. We are working on an offline mode feature that will allow you to download chapters for later reading.",
    category: "Reading",
    upvotes: 34,
    isApproved: true,
    createdAt: Date.now() - 18 * 864e5
  },
  {
    id: "faq-9",
    question: "How do I unlock a premium chapter?",
    answer: "Open the chapter you want to unlock and click the 'Unlock' button. The required coin amount will be deducted from your balance. Unlocked chapters stay accessible permanently.",
    category: "Coins & Premium",
    upvotes: 47,
    isApproved: true,
    createdAt: Date.now() - 22 * 864e5
  },
  {
    id: "faq-10",
    question: "How do I change my username or profile picture?",
    answer: "Go to your Profile page by clicking your avatar in the sidebar. Click 'Edit Profile' to update your username, bio, or profile picture.",
    category: "Account",
    upvotes: 19,
    isApproved: true,
    createdAt: Date.now() - 8 * 864e5
  },
  {
    id: "faq-11",
    question: "Can creators earn money on UR Comics?",
    answer: "Yes! Creators earn UR Coins whenever readers unlock their premium chapters. Coins can be tracked in the Creator Dashboard. Monetization features and payout options are continually expanding.",
    category: "Creators",
    upvotes: 52,
    isApproved: true,
    createdAt: Date.now() - 28 * 864e5
  },
  {
    id: "faq-12",
    question: "What formats can I upload for comic pages?",
    answer: "You can upload comic pages as JPG, PNG, or WebP images. Each chapter supports up to 50 pages. Cover images should be at least 400×600 pixels for best display quality.",
    category: "Creators",
    upvotes: 26,
    isApproved: true,
    createdAt: Date.now() - 14 * 864e5
  }
];
function loadFAQsFromStorage() {
  try {
    const raw = localStorage.getItem(LS_FAQS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveFAQsToStorage(faqs) {
  const nonSample = faqs.filter(
    (f) => !EXTENDED_SAMPLE_FAQS.some((s) => s.id === f.id)
  );
  localStorage.setItem(LS_FAQS_KEY, JSON.stringify(nonSample));
}
function loadVotes() {
  try {
    const raw = localStorage.getItem(LS_VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveVotes(votes) {
  localStorage.setItem(LS_VOTES_KEY, JSON.stringify(votes));
}
function mergeWithStorage() {
  const stored = loadFAQsFromStorage();
  const ids = new Set(EXTENDED_SAMPLE_FAQS.map((f) => f.id));
  const extra = stored.filter((f) => !ids.has(f.id));
  return [...EXTENDED_SAMPLE_FAQS, ...extra];
}
function FAQPage() {
  const [faqs, setFaqs] = reactExports.useState(() => mergeWithStorage());
  const [votes, setVotes] = reactExports.useState(
    () => loadVotes()
  );
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [expanded, setExpanded] = reactExports.useState(null);
  const [askName, setAskName] = reactExports.useState("");
  const [askEmail, setAskEmail] = reactExports.useState("");
  const [askQuestion, setAskQuestion] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    saveFAQsToStorage(faqs);
  }, [faqs]);
  const filtered = faqs.filter((faq) => {
    const matchesCat = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = !searchTerm || faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch && faq.isApproved;
  });
  const handleVote = (id) => {
    if (votes[id]) {
      ue("You already voted for this answer.");
      return;
    }
    const newVotes = { ...votes, [id]: true };
    setVotes(newVotes);
    saveVotes(newVotes);
    setFaqs(
      (prev) => prev.map((f) => f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f)
    );
    ue.success("Thanks for your feedback!");
  };
  const handleAsk = (e) => {
    e.preventDefault();
    if (!askQuestion.trim()) {
      ue.error("Please enter your question.");
      return;
    }
    const newFaq = {
      id: `user-${Date.now()}`,
      question: askQuestion.trim(),
      answer: "",
      category: "Getting Started",
      upvotes: 0,
      isApproved: false,
      createdAt: Date.now()
    };
    setFaqs((prev) => [...prev, newFaq]);
    setAskName("");
    setAskEmail("");
    setAskQuestion("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-10", "data-ocid": "faq.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "text-center mb-10",
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-display font-bold text-foreground", children: "Help & FAQs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-base", children: "Find answers to the most common questions about UR Comics." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "Search questions...",
          className: "pl-12 rounded-2xl h-12 bg-card border-border",
          "data-ocid": "faq.search_input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide", children: FAQ_CATEGORIES.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setActiveCategory(cat),
        className: `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition-smooth btn-press ${activeCategory === cat ? "gradient-primary text-primary-foreground shadow-glow border-0" : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"}`,
        "data-ocid": `faq.category.tab.${i + 1}`,
        children: cat
      },
      cat
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-14", "data-ocid": "faq.list", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "text-center py-16 bg-card rounded-2xl border border-border",
        "data-ocid": "faq.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-3", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No matches found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Try a different category or search term." })
        ]
      }
    ) : filtered.map((faq, i) => {
      const isOpen = expanded === faq.id;
      const hasVoted = !!votes[faq.id];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.04 },
          className: `bg-card rounded-2xl border overflow-hidden shadow-sm transition-smooth ${isOpen ? "border-primary/30" : "border-border"}`,
          "data-ocid": `faq.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "w-full flex items-start justify-between p-5 text-left hover:bg-muted/30 transition-smooth",
                onClick: () => setExpanded(isOpen ? null : faq.id),
                "aria-expanded": isOpen,
                "data-ocid": `faq.toggle.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0 pr-4", children: [
                    faq.isPinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-amber-500 shrink-0 mt-0.5 fill-amber-500" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground leading-snug", children: faq.question })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "text-xs rounded-full hidden sm:flex",
                        children: faq.category
                      }
                    ),
                    isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-5 h-5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-5 h-5 text-muted-foreground" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { height: 0, opacity: 0 },
                animate: { height: "auto", opacity: 1 },
                exit: { height: 0, opacity: 0 },
                transition: { duration: 0.25, ease: "easeInOut" },
                className: "overflow-hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 border-t border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm leading-relaxed mt-4", children: faq.answer }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleVote(faq.id),
                        className: `flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-smooth btn-press ${hasVoted ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground hover:text-primary hover:border-primary/40"}`,
                        "data-ocid": `faq.vote_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "w-3.5 h-3.5" }),
                          "Helpful (",
                          faq.upvotes,
                          ")"
                        ]
                      }
                    ),
                    faq.isPinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "gradient-primary text-primary-foreground border-0 text-xs rounded-full", children: "⭐ Top Answer" })
                  ] })
                ] })
              },
              "answer"
            ) })
          ]
        },
        faq.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "bg-card rounded-2xl border border-border p-6 shadow-sm",
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4 },
        "data-ocid": "faq.ask.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquarePlus, { className: "w-5 h-5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: "Ask a Question" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Can't find what you're looking for? We'll answer it." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.96 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0 },
              className: "flex flex-col items-center py-8 text-center",
              "data-ocid": "faq.ask.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "🎉" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-lg", children: "Question submitted!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Our team will review and publish it shortly. Thank you!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "mt-4 rounded-xl",
                    variant: "outline",
                    onClick: () => setSubmitted(false),
                    "data-ocid": "faq.ask_another_button",
                    children: "Ask another question"
                  }
                )
              ]
            },
            "success"
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.form,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              onSubmit: handleAsk,
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ask-name", children: "Name (optional)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "ask-name",
                        value: askName,
                        onChange: (e) => setAskName(e.target.value),
                        placeholder: "Your name",
                        className: "mt-1 rounded-xl",
                        "data-ocid": "faq.ask_name_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ask-email", children: "Email (optional)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "ask-email",
                        type: "email",
                        value: askEmail,
                        onChange: (e) => setAskEmail(e.target.value),
                        placeholder: "your@email.com",
                        className: "mt-1 rounded-xl",
                        "data-ocid": "faq.ask_email_input"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "ask-question", children: [
                    "Your Question ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "ask-question",
                      value: askQuestion,
                      onChange: (e) => setAskQuestion(e.target.value),
                      placeholder: "What would you like to know about UR Comics?",
                      rows: 4,
                      className: "mt-1 rounded-xl resize-none",
                      "data-ocid": "faq.ask_question_textarea"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "gradient-primary text-primary-foreground border-0 rounded-xl px-6",
                    "data-ocid": "faq.ask_submit_button",
                    children: "Submit Question"
                  }
                )
              ]
            },
            "form"
          ) })
        ]
      }
    )
  ] });
}
export {
  FAQPage as default
};
