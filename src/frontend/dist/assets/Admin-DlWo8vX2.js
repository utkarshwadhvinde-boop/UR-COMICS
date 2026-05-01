import { c as createLucideIcon, i as useNavigate, r as reactExports, j as jsxRuntimeExports, I as Input, a as Button, b as Badge, X } from "./index-BgVxhZ2x.js";
import { L as Label } from "./label-BOuQaJiZ.js";
import { T as Textarea } from "./textarea-CtjtaN0a.js";
import { u as ue } from "./index-5IwcxvLb.js";
import { m as motion } from "./proxy-Dz0zqHZy.js";
import { S as Shield } from "./shield-DrO6fFRQ.js";
import { E as EyeOff } from "./eye-off-DzrsZbXt.js";
import { E as Eye } from "./eye-BI0bfbT1.js";
import { A as AnimatePresence } from "./index-CHqT7XMm.js";
import { C as CircleCheck } from "./circle-check-CQOhgZnJ.js";
import { P as Plus } from "./plus-_OKKqmu9.js";
import { S as Star } from "./star-BZqe7TZP.js";
import { T as Trash2 } from "./trash-2-Cvc_iP1l.js";
import "./index-BHTFg43G.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
const ADMIN_PASSWORD = "FaqAdmin2025!";
const LS_FAQS_KEY = "ur_comics_faqs";
const EXTENDED_SAMPLE_FAQS = [
  {
    id: "faq-1",
    question: "How do I start reading a comic?",
    answer: "Simply click on any comic cover to open its detail page, then click 'Read Now' or select a specific chapter to start reading.",
    category: "Reading",
    upvotes: 42,
    isApproved: true,
    createdAt: Date.now() - 30 * 864e5
  },
  {
    id: "faq-2",
    question: "What are UR Coins and how do I get them?",
    answer: "UR Coins are the platform currency used to unlock premium chapters. You can earn them through daily streaks, reading activities, or purchase coin packages in the Coins shop.",
    category: "Coins & Premium",
    upvotes: 38,
    isApproved: true,
    createdAt: Date.now() - 25 * 864e5
  },
  {
    id: "faq-3",
    question: "How do I upload my own comic?",
    answer: "Go to the Upload section in the sidebar or visit /create. Fill in your comic details, upload a cover image, add genres, and start adding chapters. Your comic will be published instantly.",
    category: "Creators",
    upvotes: 29,
    isApproved: true,
    createdAt: Date.now() - 20 * 864e5
  },
  {
    id: "faq-4",
    question: "Does my reading progress save automatically?",
    answer: "Yes! Your reading progress is saved continuously as you scroll. When you come back to a comic, it will automatically resume from where you left off.",
    category: "Reading",
    upvotes: 55,
    isApproved: true,
    createdAt: Date.now() - 15 * 864e5
  },
  {
    id: "faq-5",
    question: "How does the daily streak work?",
    answer: "Log in and read at least one chapter every day to maintain your streak. Streaks earn you bonus UR Coins and unlock special badges displayed on your profile.",
    category: "Account",
    upvotes: 21,
    isApproved: true,
    createdAt: Date.now() - 10 * 864e5
  },
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
const CATEGORIES = [
  "Getting Started",
  "Reading",
  "Creators",
  "Coins & Premium",
  "Account"
];
function loadStoredFAQs() {
  try {
    const raw = localStorage.getItem(LS_FAQS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveStoredFAQs(faqs) {
  const sampleIds = new Set(EXTENDED_SAMPLE_FAQS.map((f) => f.id));
  const extra = faqs.filter((f) => !sampleIds.has(f.id));
  localStorage.setItem(LS_FAQS_KEY, JSON.stringify(extra));
}
function mergeFAQs() {
  const stored = loadStoredFAQs();
  const ids = new Set(EXTENDED_SAMPLE_FAQS.map((f) => f.id));
  const extra = stored.filter((f) => !ids.has(f.id));
  return [...EXTENDED_SAMPLE_FAQS, ...extra];
}
function AdminPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = reactExports.useState(false);
  const [password, setPassword] = reactExports.useState("");
  const [showPw, setShowPw] = reactExports.useState(false);
  const [faqs, setFaqs] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("approved");
  const [editId, setEditId] = reactExports.useState(null);
  const [editQuestion, setEditQuestion] = reactExports.useState("");
  const [editAnswer, setEditAnswer] = reactExports.useState("");
  const [editCategory, setEditCategory] = reactExports.useState("");
  const [newQuestion, setNewQuestion] = reactExports.useState("");
  const [newAnswer, setNewAnswer] = reactExports.useState("");
  const [newCategory, setNewCategory] = reactExports.useState(CATEGORIES[0]);
  const [deleteTargetId, setDeleteTargetId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (authenticated) {
      setFaqs(mergeFAQs());
    }
  }, [authenticated]);
  const persist = (updated) => {
    setFaqs(updated);
    saveStoredFAQs(updated);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      ue.success("Admin access granted");
    } else {
      ue.error("Incorrect password");
    }
  };
  const startEdit = (faq) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category);
  };
  const saveEdit = () => {
    if (!editId) return;
    persist(
      faqs.map(
        (f) => f.id === editId ? {
          ...f,
          question: editQuestion.trim(),
          answer: editAnswer.trim(),
          category: editCategory
        } : f
      )
    );
    setEditId(null);
    ue.success("FAQ updated successfully");
  };
  const confirmDelete = (id) => setDeleteTargetId(id);
  const executeDelete = () => {
    if (!deleteTargetId) return;
    persist(faqs.filter((f) => f.id !== deleteTargetId));
    setDeleteTargetId(null);
    ue.success("FAQ deleted");
  };
  const toggleApprove = (id) => {
    persist(
      faqs.map((f) => f.id === id ? { ...f, isApproved: !f.isApproved } : f)
    );
    const faq = faqs.find((f) => f.id === id);
    ue.success(
      (faq == null ? void 0 : faq.isApproved) ? "Question unpublished" : "Question approved and published"
    );
  };
  const togglePin = (id) => {
    persist(
      faqs.map((f) => f.id === id ? { ...f, isPinned: !f.isPinned } : f)
    );
    const faq = faqs.find((f) => f.id === id);
    ue.success(
      (faq == null ? void 0 : faq.isPinned) ? "Unpinned from top" : "Pinned as Top Answer ⭐"
    );
  };
  const handleAddFAQ = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      ue.error("Question and answer are required.");
      return;
    }
    const newFaq = {
      id: `admin-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
      upvotes: 0,
      isApproved: true,
      createdAt: Date.now()
    };
    persist([...faqs, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory(CATEGORIES[0]);
    ue.success("FAQ added and published");
    setActiveTab("approved");
  };
  const approved = faqs.filter((f) => f.isApproved);
  const pending = faqs.filter((f) => !f.isApproved);
  if (!authenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-[80vh] flex items-center justify-center px-4",
        "data-ocid": "admin.login_page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.35 },
            className: "w-full max-w-sm",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl border border-border p-8 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-8 h-8 text-primary-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "FAQ Admin Panel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Enter your admin password to continue" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-pw", children: "Admin Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "admin-pw",
                        type: showPw ? "text" : "password",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        placeholder: "Enter password",
                        className: "pr-11 rounded-xl",
                        autoComplete: "current-password",
                        "data-ocid": "admin.password_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
                        onClick: () => setShowPw((v) => !v),
                        "aria-label": showPw ? "Hide password" : "Show password",
                        children: showPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11",
                    "data-ocid": "admin.login_button",
                    children: "Access Panel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    className: "w-full rounded-xl",
                    onClick: () => void navigate({ to: "/" }),
                    "data-ocid": "admin.back_home_button",
                    children: "Back to Home"
                  }
                )
              ] })
            ] })
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-10", "data-ocid": "admin.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8 flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl gradient-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "FAQ Admin Panel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Manage questions, answers and visibility" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: () => setAuthenticated(false),
          className: "text-muted-foreground rounded-xl",
          "data-ocid": "admin.logout_button",
          children: "Log Out"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [
      { label: "Published", value: approved.length, icon: "✅" },
      { label: "Pending", value: pending.length, icon: "⏳" },
      {
        label: "Top Answers",
        value: faqs.filter((f) => f.isPinned).length,
        icon: "⭐"
      }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card rounded-2xl border border-border p-4 text-center shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-1", children: stat.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold font-display text-foreground", children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: stat.label })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6 bg-muted rounded-2xl p-1.5", children: [
      {
        key: "approved",
        label: `Published (${approved.length})`,
        badge: false
      },
      {
        key: "pending",
        label: `Pending (${pending.length})`,
        badge: pending.length > 0
      },
      { key: "add", label: "Add New FAQ", badge: false }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(tab.key),
        className: `flex-1 relative flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-smooth ${activeTab === tab.key ? "gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
        "data-ocid": `admin.tab.${tab.key}`,
        children: [
          tab.label,
          tab.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" })
        ]
      },
      tab.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      activeTab === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          className: "space-y-3",
          children: approved.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12 bg-card rounded-2xl border border-border",
              "data-ocid": "admin.approved.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl mb-2", children: "📋" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No published FAQs yet." })
              ]
            }
          ) : approved.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            FAQAdminCard,
            {
              faq,
              index: i,
              isEditing: editId === faq.id,
              editQuestion,
              editAnswer,
              editCategory,
              categories: CATEGORIES,
              onEditChange: {
                setEditQuestion,
                setEditAnswer,
                setEditCategory
              },
              onStartEdit: () => startEdit(faq),
              onSaveEdit: saveEdit,
              onCancelEdit: () => setEditId(null),
              onDelete: () => confirmDelete(faq.id),
              onToggleApprove: () => toggleApprove(faq.id),
              onTogglePin: () => togglePin(faq.id),
              ocidPrefix: "admin.approved"
            },
            faq.id
          ))
        },
        "approved"
      ),
      activeTab === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          className: "space-y-3",
          children: pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12 bg-card rounded-2xl border border-border",
              "data-ocid": "admin.pending.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl mb-2", children: "🎉" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No pending questions — you're all caught up!" })
              ]
            }
          ) : pending.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -8 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: i * 0.05 },
              className: "bg-card rounded-2xl border border-amber-200/60 dark:border-amber-900/40 p-5 shadow-sm",
              "data-ocid": `admin.pending.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "text-xs text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 border-0 rounded-full",
                        children: "User Question"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: faq.question }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                      "Submitted ",
                      new Date(faq.createdAt).toLocaleDateString()
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        onClick: () => toggleApprove(faq.id),
                        className: "gradient-primary text-primary-foreground border-0 rounded-xl gap-1",
                        "data-ocid": `admin.pending.approve_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                          "Approve"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => confirmDelete(faq.id),
                        className: "rounded-xl gap-1 text-destructive border-destructive/30 hover:bg-destructive/10",
                        "data-ocid": `admin.pending.reject_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                          "Reject"
                        ]
                      }
                    )
                  ] })
                ] }),
                faq.answer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 p-3 bg-muted rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: faq.answer }) })
              ]
            },
            faq.id
          ))
        },
        "pending"
      ),
      activeTab === "add" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl gradient-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-bold text-foreground", children: "Add New FAQ" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddFAQ, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-category", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "new-category",
                    value: newCategory,
                    onChange: (e) => setNewCategory(e.target.value),
                    className: "mt-1 w-full rounded-xl border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                    "data-ocid": "admin.add.category_select",
                    children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "new-question", children: [
                  "Question ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "new-question",
                    value: newQuestion,
                    onChange: (e) => setNewQuestion(e.target.value),
                    placeholder: "Enter the question...",
                    className: "mt-1 rounded-xl",
                    "data-ocid": "admin.add.question_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "new-answer", children: [
                  "Answer ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "new-answer",
                    value: newAnswer,
                    onChange: (e) => setNewAnswer(e.target.value),
                    placeholder: "Write the answer...",
                    rows: 4,
                    className: "mt-1 rounded-xl resize-none",
                    "data-ocid": "admin.add.answer_textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  className: "gradient-primary text-primary-foreground border-0 rounded-xl px-6",
                  "data-ocid": "admin.add.submit_button",
                  children: "Publish FAQ"
                }
              )
            ] })
          ] })
        },
        "add"
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: deleteTargetId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        "data-ocid": "admin.delete.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "bg-card rounded-2xl border border-border p-6 shadow-xl w-full max-w-sm",
            initial: { scale: 0.95 },
            animate: { scale: 1 },
            exit: { scale: 0.95 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-destructive shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Delete FAQ?" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "This action cannot be undone. The FAQ will be permanently removed." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0",
                    onClick: executeDelete,
                    "data-ocid": "admin.delete.confirm_button",
                    children: "Delete"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "flex-1 rounded-xl",
                    onClick: () => setDeleteTargetId(null),
                    "data-ocid": "admin.delete.cancel_button",
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
function FAQAdminCard({
  faq,
  index,
  isEditing,
  editQuestion,
  editAnswer,
  editCategory,
  categories,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onToggleApprove,
  onTogglePin,
  ocidPrefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.04 },
      className: "bg-card rounded-2xl border border-border p-5 shadow-sm",
      "data-ocid": `${ocidPrefix}.item.${index + 1}`,
      children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: editCategory,
              onChange: (e) => onEditChange.setEditCategory(e.target.value),
              className: "mt-1 w-full rounded-xl border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
              children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Question" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: editQuestion,
              onChange: (e) => onEditChange.setEditQuestion(e.target.value),
              className: "mt-1 rounded-xl font-semibold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Answer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: editAnswer,
              onChange: (e) => onEditChange.setEditAnswer(e.target.value),
              rows: 3,
              className: "mt-1 rounded-xl resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: onSaveEdit,
              className: "rounded-xl gradient-primary text-primary-foreground border-0",
              "data-ocid": `${ocidPrefix}.save_button.${index + 1}`,
              children: "Save Changes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              onClick: onCancelEdit,
              className: "rounded-xl",
              "data-ocid": `${ocidPrefix}.cancel_button.${index + 1}`,
              children: "Cancel"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
            faq.isPinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "gradient-primary text-primary-foreground border-0 text-xs rounded-full", children: "⭐ Top Answer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs rounded-full", children: faq.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "👍 ",
              faq.upvotes
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground leading-snug", children: faq.question }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: faq.answer })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onTogglePin,
              className: `rounded-xl text-xs gap-1 ${faq.isPinned ? "text-amber-500" : "text-muted-foreground"}`,
              title: faq.isPinned ? "Unpin" : "Pin as Top Answer",
              "data-ocid": `${ocidPrefix}.pin_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: `w-3.5 h-3.5 ${faq.isPinned ? "fill-amber-500" : ""}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onStartEdit,
              className: "rounded-xl gap-1",
              "data-ocid": `${ocidPrefix}.edit_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onToggleApprove,
              className: "rounded-xl gap-1 text-muted-foreground",
              title: "Unpublish",
              "data-ocid": `${ocidPrefix}.unpublish_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onDelete,
              className: "rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10",
              "data-ocid": `${ocidPrefix}.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] })
    }
  );
}
export {
  AdminPage as default
};
