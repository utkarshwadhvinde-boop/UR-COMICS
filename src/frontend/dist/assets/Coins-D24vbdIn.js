import { c as createLucideIcon, u as useAppStore, r as reactExports, j as jsxRuntimeExports, C as Coins, f as Button, h as Badge, X } from "./index-7c1w9dpn.js";
import { D as Dialog, a as DialogContent } from "./dialog-P0noTjEy.js";
import { S as Separator } from "./separator-CS6IoANS.js";
import { u as ue } from "./index-lQvZUeed.js";
import { m as motion } from "./proxy-B9bJmzOA.js";
import { A as AnimatePresence } from "./index-DyEMEiAJ.js";
import { P as Play } from "./play-Bk8-0mmF.js";
import "./index-DYCGIPFU.js";
import "./index-DPeV5vFG.js";
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
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
const AD_DURATION = 5;
const COINS_PER_AD = 50;
const DAILY_AD_LIMIT = 10;
const COOLDOWN_SECONDS = 180;
const HISTORY_KEY = "ur_ad_history";
const TRACKER_KEY = "ur_ad_tracker";
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function loadTracker() {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (!raw) return { date: todayStr(), count: 0, lastWatched: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayStr()) {
      return { date: todayStr(), count: 0, lastWatched: parsed.lastWatched };
    }
    return parsed;
  } catch {
    return { date: todayStr(), count: 0, lastWatched: 0 };
  }
}
function saveTracker(t) {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(t));
  } catch {
  }
}
function loadHistory() {
  try {
    return JSON.parse(
      localStorage.getItem(HISTORY_KEY) ?? "[]"
    );
  } catch {
    return [];
  }
}
function saveHistory(h) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  } catch {
  }
}
function formatTimestamp(ts) {
  const now = Date.now();
  const diff = now - ts;
  const d = new Date(ts);
  if (diff < 6e4) return "Just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  const isToday = new Date(ts).toDateString() === (/* @__PURE__ */ new Date()).toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return isToday ? `Today, ${time}` : `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}
function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function CoinCountUp({ value }) {
  const [display, setDisplay] = reactExports.useState(value);
  const prevRef = reactExports.useRef(value);
  reactExports.useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const end = value;
    const diff = end - start;
    const duration = 600;
    const startTime = performance.now();
    const frame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    prevRef.current = value;
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: display.toLocaleString() });
}
function AdModal({
  open,
  onClose,
  onComplete
}) {
  const [countdown, setCountdown] = reactExports.useState(AD_DURATION);
  const [done, setDone] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    setCountdown(AD_DURATION);
    setDone(false);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setDone(true);
          return 0;
        }
        return c - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);
  const handleClaim = reactExports.useCallback(() => {
    onComplete();
    onClose();
  }, [onComplete, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v && done) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "rounded-2xl sm:max-w-sm p-0 overflow-hidden border-0 shadow-2xl",
          "data-ocid": "coins.ad_dialog",
          onInteractOutside: (e) => e.preventDefault(),
          onEscapeKeyDown: (e) => e.preventDefault(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative flex flex-col items-center justify-center px-8 py-10 text-center overflow-hidden",
                style: {
                  background: "linear-gradient(135deg, #1a0a3c 0%, #2d1265 50%, #1a0a3c 100%)",
                  minHeight: 260
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0 opacity-30",
                      style: {
                        background: "radial-gradient(circle at 30% 40%, rgba(90,59,255,0.6) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(233,30,140,0.4) 0%, transparent 50%)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { scale: 0.8, opacity: 0 },
                      animate: { scale: 1, opacity: 1 },
                      transition: { type: "spring", duration: 0.5 },
                      className: "relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-glow",
                      style: { background: "var(--gradient-primary)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-9 h-9 text-white" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest mb-2",
                      style: { color: "rgba(255,255,255,0.5)" },
                      children: "Advertisement"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-bold text-white mb-1", children: "UR Comics Premium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm mb-4",
                      style: { color: "rgba(255,255,255,0.65)" },
                      children: "Unlock unlimited premium chapters with VIP membership."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["Fantasy", "Sci-Fi", "Romance"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs px-2.5 py-1 rounded-full",
                      style: {
                        background: "rgba(90,59,255,0.3)",
                        color: "rgba(255,255,255,0.85)",
                        border: "1px solid rgba(90,59,255,0.4)"
                      },
                      children: g
                    },
                    g
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !done ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.8 },
                      className: "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium",
                      style: {
                        background: "rgba(255,255,255,0.12)",
                        color: "white",
                        backdropFilter: "blur(8px)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.span,
                          {
                            initial: { scale: 1.4, opacity: 0 },
                            animate: { scale: 1, opacity: 1 },
                            className: "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                            style: { background: "rgba(255,255,255,0.2)" },
                            children: countdown
                          },
                          countdown
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
                          "Ad ends in ",
                          countdown,
                          "s"
                        ] })
                      ]
                    },
                    "countdown"
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 },
                      type: "button",
                      onClick: onClose,
                      className: "flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium cursor-pointer",
                      style: {
                        background: "rgba(255,255,255,0.15)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                        border: "none"
                      },
                      "data-ocid": "coins.ad_close_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                        " Skip"
                      ]
                    },
                    "skip"
                  ) }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                className: "text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🎉" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Ad complete!" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
                    "You earned",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", style: { color: "#FFD700" }, children: [
                      "+",
                      COINS_PER_AD,
                      " Coins"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "w-full rounded-xl font-bold h-12 text-base border-0 btn-press shadow-glow",
                      style: {
                        background: "var(--gradient-primary)",
                        color: "white"
                      },
                      onClick: handleClaim,
                      "data-ocid": "coins.ad_claim_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 mr-2" }),
                        " Claim ",
                        COINS_PER_AD,
                        " Coins"
                      ]
                    }
                  )
                ]
              },
              "claim"
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "flex items-center justify-center gap-2.5 text-muted-foreground text-sm py-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-4 h-4 rounded-full border-2 animate-spin",
                      style: {
                        borderColor: "oklch(var(--primary)/0.3)",
                        borderTopColor: "oklch(var(--primary))"
                      }
                    }
                  ),
                  "Watching ad… ",
                  countdown,
                  "s remaining"
                ]
              },
              "watching"
            ) }) })
          ]
        }
      )
    }
  );
}
function SuccessOverlay({
  show,
  newBalance,
  onClose
}) {
  reactExports.useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [show, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: show && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center",
      style: {
        background: "rgba(10, 5, 30, 0.85)",
        backdropFilter: "blur(12px)"
      },
      children: [
        ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"].map(
          (pid, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 1, x: 0, y: 0, scale: 0.5 },
              animate: {
                opacity: 0,
                x: Math.cos(i / 8 * Math.PI * 2) * 140,
                y: Math.sin(i / 8 * Math.PI * 2) * 140,
                scale: 1.2
              },
              transition: { duration: 0.9, delay: 0.1, ease: "easeOut" },
              className: "absolute w-3 h-3 rounded-full",
              style: { background: i % 2 === 0 ? "#FFD700" : "#5A3BFF" }
            },
            pid
          )
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { type: "spring", duration: 0.6 },
            className: "relative flex flex-col items-center gap-4 text-center px-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: { rotate: [0, -10, 10, -10, 10, 0], y: [0, -8, 0] },
                  transition: { duration: 0.8, delay: 0.2 },
                  className: "w-28 h-28 rounded-full flex items-center justify-center shadow-2xl",
                  style: {
                    background: "radial-gradient(circle, #FFE066 0%, #FFD700 50%, #F5A500 100%)",
                    boxShadow: "0 0 50px rgba(255, 215, 0, 0.5), 0 0 100px rgba(255, 215, 0, 0.2)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-14 h-14 text-amber-900" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: { type: "spring", delay: 0.3 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "text-5xl font-display font-black",
                        style: {
                          color: "#FFD700",
                          textShadow: "0 0 30px rgba(255,215,0,0.6)"
                        },
                        children: [
                          "+",
                          COINS_PER_AD
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white mt-1", children: "Coins Earned!" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.p,
                {
                  initial: { opacity: 0, y: 6 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.5 },
                  className: "text-muted-foreground text-sm",
                  children: [
                    "New balance:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                      newBalance.toLocaleString(),
                      " coins"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 0.7 },
                  type: "button",
                  onClick: onClose,
                  className: "mt-2 text-sm text-muted-foreground underline underline-offset-2 cursor-pointer bg-transparent border-none",
                  "data-ocid": "coins.success_close_button",
                  children: "Close"
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
function HistoryItem({
  record,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.04 },
      className: "flex items-center justify-between py-3",
      "data-ocid": `coins.history_item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
              style: {
                background: "rgba(255,215,0,0.12)",
                border: "1px solid rgba(255,215,0,0.2)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4", style: { color: "#FFD700" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: "Rewarded Ad" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(record.timestamp) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "secondary",
            className: "rounded-xl font-semibold shrink-0 ml-2",
            style: {
              background: "rgba(255,215,0,0.1)",
              color: "#FFD700",
              border: "1px solid rgba(255,215,0,0.2)"
            },
            children: [
              "+",
              record.coins
            ]
          }
        )
      ]
    }
  );
}
function CoinsPage() {
  const { currentUser, updateUser } = useAppStore();
  const [adOpen, setAdOpen] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showSuccess, setShowSuccess] = reactExports.useState(false);
  const [successBalance, setSuccessBalance] = reactExports.useState(0);
  const clickingRef = reactExports.useRef(false);
  const [tracker, setTracker] = reactExports.useState(loadTracker);
  const [cooldownLeft, setCooldownLeft] = reactExports.useState(0);
  const [history, setHistory] = reactExports.useState(
    () => loadHistory().slice(0, 10)
  );
  const isLimitReached = tracker.count >= DAILY_AD_LIMIT;
  const isOnCooldown = cooldownLeft > 0;
  const canWatch = !isLimitReached && !isOnCooldown && !isLoading;
  const progressPct = Math.round(tracker.count / DAILY_AD_LIMIT * 100);
  const coinsEarnedToday = tracker.count * COINS_PER_AD;
  const midnightReset = reactExports.useMemo(() => {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }, []);
  reactExports.useEffect(() => {
    const refreshCooldown = () => {
      const t = loadTracker();
      if (t.lastWatched === 0) {
        setCooldownLeft(0);
        return;
      }
      const elapsed = Math.floor((Date.now() - t.lastWatched) / 1e3);
      const remaining = Math.max(0, COOLDOWN_SECONDS - elapsed);
      setCooldownLeft(remaining);
    };
    refreshCooldown();
    const interval = setInterval(refreshCooldown, 1e3);
    return () => clearInterval(interval);
  }, []);
  const handleWatchAd = reactExports.useCallback(() => {
    if (!canWatch || clickingRef.current) return;
    clickingRef.current = true;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAdOpen(true);
      clickingRef.current = false;
    }, 1500);
  }, [canWatch]);
  const handleAdComplete = reactExports.useCallback(() => {
    const coins = (currentUser == null ? void 0 : currentUser.coins) ?? 0;
    const newCoins = coins + COINS_PER_AD;
    updateUser({ coins: newCoins });
    const newTracker = {
      date: todayStr(),
      count: tracker.count + 1,
      lastWatched: Date.now()
    };
    saveTracker(newTracker);
    setTracker(newTracker);
    const record = {
      id: `ad-${Date.now()}`,
      timestamp: Date.now(),
      coins: COINS_PER_AD
    };
    const newHistory = [record, ...history].slice(0, 10);
    setHistory(newHistory);
    saveHistory(newHistory);
    setSuccessBalance(newCoins);
    setShowSuccess(true);
    ue.success(`+${COINS_PER_AD} coins added!`, {
      description: "Great job watching the ad 🎉"
    });
  }, [currentUser == null ? void 0 : currentUser.coins, tracker.count, history, updateUser]);
  const btnLabel = reactExports.useMemo(() => {
    if (isLoading) return "Loading ad…";
    if (isLimitReached) return "Daily limit reached";
    if (isOnCooldown) return `Next ad in: ${formatCountdown(cooldownLeft)}`;
    return `Watch Ad · Earn ${COINS_PER_AD} Coins`;
  }, [isLoading, isLimitReached, isOnCooldown, cooldownLeft]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8 pb-16", "data-ocid": "coins.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "text-center mb-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "relative inline-flex items-center justify-center w-24 h-24 rounded-full mb-5 mx-auto",
                style: {
                  background: "radial-gradient(circle, #FFE066 0%, #FFD700 60%, #F0A800 100%)",
                  boxShadow: "0 0 40px rgba(255, 215, 0, 0.35), 0 0 80px rgba(255, 215, 0, 0.1)"
                },
                animate: { y: [0, -5, 0] },
                transition: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-12 h-12 text-amber-900" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: "absolute inset-0 rounded-full border-2",
                      style: { borderColor: "rgba(255,215,0,0.3)" },
                      animate: { scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] },
                      transition: { duration: 2.2, repeat: Number.POSITIVE_INFINITY }
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl sm:text-4xl font-display font-black text-foreground leading-tight mb-2", children: [
              "Earn Coins,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block",
                  style: {
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  },
                  children: "Unlock Stories"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mx-auto", children: "Watch short ads to earn coins instantly. Use them to unlock premium chapters." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { delay: 0.2 },
                className: "inline-flex items-center gap-2.5 mt-5 px-5 py-2.5 rounded-full",
                style: {
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.25)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4", style: { color: "#FFD700" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoinCountUp, { value: (currentUser == null ? void 0 : currentUser.coins) ?? 0 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "coins" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15, duration: 0.5 },
          className: "relative rounded-3xl overflow-hidden mb-6",
          style: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 opacity-20 pointer-events-none",
                style: {
                  background: "radial-gradient(ellipse at top, rgba(90,59,255,0.5) 0%, transparent 70%), radial-gradient(ellipse at bottom-right, rgba(233,30,140,0.3) 0%, transparent 60%)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-6 sm:p-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-glow",
                    style: { background: "var(--gradient-primary)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-7 h-7 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-display font-bold text-foreground leading-tight", children: [
                    "Watch Ad → Earn ",
                    COINS_PER_AD,
                    " Coins"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Watch a 5-second ad and collect your coins instantly" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mb-6", children: [
                {
                  label: "Earned Today",
                  value: `${coinsEarnedToday}`,
                  suffix: "coins"
                },
                {
                  label: "Ads Watched",
                  value: `${tracker.count}/${DAILY_AD_LIMIT}`,
                  suffix: ""
                },
                { label: "Per Ad", value: `${COINS_PER_AD}`, suffix: "coins" }
              ].map(({ label, value, suffix }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center p-3 rounded-2xl",
                  style: {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-foreground text-lg leading-none", children: [
                      value,
                      suffix && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: suffix })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: label })
                  ]
                },
                label
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    tracker.count,
                    "/",
                    DAILY_AD_LIMIT,
                    " ads watched today"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    progressPct,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full h-2 rounded-full overflow-hidden",
                    style: { background: "rgba(255,255,255,0.06)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        className: "h-full rounded-full",
                        style: { background: "var(--gradient-primary)" },
                        initial: { width: 0 },
                        animate: { width: `${progressPct}%` },
                        transition: { duration: 0.6, ease: "easeOut" }
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: "w-full rounded-2xl h-14 flex items-center justify-center gap-2.5 text-white font-semibold",
                  style: {
                    background: "var(--gradient-primary)",
                    opacity: 0.8
                  },
                  "data-ocid": "coins.watch_ad_loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-5 h-5 rounded-full border-2 animate-spin",
                        style: {
                          borderColor: "rgba(255,255,255,0.3)",
                          borderTopColor: "white"
                        }
                      }
                    ),
                    "Loading ad…"
                  ]
                },
                "loading"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      disabled: !canWatch,
                      onClick: handleWatchAd,
                      className: "w-full rounded-2xl h-14 text-base font-bold border-0 btn-press relative overflow-hidden",
                      style: canWatch ? {
                        background: "var(--gradient-primary)",
                        color: "white"
                      } : {
                        background: "rgba(255,255,255,0.06)",
                        color: "oklch(var(--muted-foreground))",
                        cursor: "not-allowed"
                      },
                      "data-ocid": "coins.watch_ad_button",
                      children: [
                        canWatch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.span,
                          {
                            className: "absolute inset-0 rounded-2xl pointer-events-none",
                            animate: {
                              boxShadow: [
                                "0 0 0px rgba(90,59,255,0)",
                                "0 0 24px rgba(90,59,255,0.5)",
                                "0 0 0px rgba(90,59,255,0)"
                              ]
                            },
                            transition: {
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 mr-2" }),
                        btnLabel
                      ]
                    }
                  )
                },
                "button"
              ) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
                isLimitReached && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.p,
                  {
                    initial: { opacity: 0, y: 4 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                    className: "text-center text-xs text-muted-foreground mt-3",
                    "data-ocid": "coins.limit_reached_state",
                    children: [
                      "🎯 Daily limit reached! Come back at",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: midnightReset }),
                      " ",
                      "for more coins."
                    ]
                  }
                ),
                !isLimitReached && isOnCooldown && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.p,
                  {
                    initial: { opacity: 0, y: 4 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                    className: "text-center text-xs text-muted-foreground mt-3",
                    "data-ocid": "coins.cooldown_state",
                    children: [
                      "⏱ Cooldown active. Next ad available in",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatCountdown(cooldownLeft) })
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.25 },
          className: "grid grid-cols-3 gap-3 mb-6",
          children: [
            { step: "1", icon: "👁️", label: "Watch 5s Ad" },
            { step: "2", icon: "🎁", label: "Claim Reward" },
            { step: "3", icon: "🔓", label: "Unlock Chapters" }
          ].map(({ step, icon, label }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 + i * 0.06 },
              className: "text-center py-4 px-3 rounded-2xl",
              style: {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mt-2 leading-snug", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs mt-1 font-bold",
                    style: {
                      background: "var(--gradient-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: [
                      "Step ",
                      step
                    ]
                  }
                )
              ]
            },
            step
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.35 },
          className: "rounded-2xl p-4 mb-8 flex items-start gap-3",
          style: {
            background: "rgba(90,59,255,0.06)",
            border: "1px solid rgba(90,59,255,0.12)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                style: { background: "rgba(90,59,255,0.15)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "ℹ️" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Daily Coin Rules" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground mt-1.5 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "• Watch up to",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
                    DAILY_AD_LIMIT,
                    " ads"
                  ] }),
                  " ",
                  "per day (earn up to",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
                    DAILY_AD_LIMIT * COINS_PER_AD,
                    " coins"
                  ] }),
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "• A",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "3-minute cooldown" }),
                  " ",
                  "is required between ads"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Daily limit resets every midnight" })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          className: "rounded-2xl p-5",
          style: {
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)"
          },
          "data-ocid": "coins.history_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4", style: { color: "#FFD700" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground", children: "Reward History" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-1 opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: history.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryItem, { record: rec, index: i }, rec.id)) })
          ]
        }
      ) }),
      history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.5 },
          className: "text-center py-8 rounded-2xl",
          style: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)"
          },
          "data-ocid": "coins.history_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl mb-2", children: "🎬" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No reward history yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Watch your first ad above to start earning coins!" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdModal,
      {
        open: adOpen,
        onClose: () => setAdOpen(false),
        onComplete: handleAdComplete
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SuccessOverlay,
      {
        show: showSuccess,
        newBalance: successBalance,
        onClose: () => setShowSuccess(false)
      }
    )
  ] });
}
export {
  CoinsPage as default
};
