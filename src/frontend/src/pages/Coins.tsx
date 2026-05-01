import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store";
import { Coins, Play, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────
const AD_DURATION = 5; // seconds
const COINS_PER_AD = 50;
const DAILY_AD_LIMIT = 10;
const COOLDOWN_SECONDS = 180; // 3 minutes between ads
const HISTORY_KEY = "ur_ad_history";
const TRACKER_KEY = "ur_ad_tracker";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdTracker {
  date: string; // "YYYY-MM-DD"
  count: number;
  lastWatched: number; // unix ms
}

interface AdHistoryRecord {
  id: string;
  timestamp: number;
  coins: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadTracker(): AdTracker {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (!raw) return { date: todayStr(), count: 0, lastWatched: 0 };
    const parsed = JSON.parse(raw) as AdTracker;
    // Reset if it's a new day
    if (parsed.date !== todayStr()) {
      return { date: todayStr(), count: 0, lastWatched: parsed.lastWatched };
    }
    return parsed;
  } catch {
    return { date: todayStr(), count: 0, lastWatched: 0 };
  }
}

function saveTracker(t: AdTracker) {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(t));
  } catch {
    // ignore
  }
}

function loadHistory(): AdHistoryRecord[] {
  try {
    return JSON.parse(
      localStorage.getItem(HISTORY_KEY) ?? "[]",
    ) as AdHistoryRecord[];
  } catch {
    return [];
  }
}

function saveHistory(h: AdHistoryRecord[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  } catch {
    // ignore
  }
}

function formatTimestamp(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const d = new Date(ts);
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  const isToday = new Date(ts).toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return isToday
    ? `Today, ${time}`
    : `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CoinCountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const end = value;
    const diff = end - start;
    const duration = 600;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    prevRef.current = value;
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

function AdModal({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;
    setCountdown(AD_DURATION);
    setDone(false);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setDone(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);

  const handleClaim = useCallback(() => {
    onComplete();
    onClose();
  }, [onComplete, onClose]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && done) onClose();
      }}
    >
      <DialogContent
        className="rounded-2xl sm:max-w-sm p-0 overflow-hidden border-0 shadow-2xl"
        data-ocid="coins.ad_dialog"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Ad creative area */}
        <div
          className="relative flex flex-col items-center justify-center px-8 py-10 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1a0a3c 0%, #2d1265 50%, #1a0a3c 100%)",
            minHeight: 260,
          }}
        >
          {/* Animated gradient orb background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 30% 40%, rgba(90,59,255,0.6) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(233,30,140,0.4) 0%, transparent 50%)",
            }}
          />

          {/* Brand graphic */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-glow"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Video className="w-9 h-9 text-white" />
          </motion.div>

          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Advertisement
          </p>
          <h3 className="text-xl font-display font-bold text-white mb-1">
            UR Comics Premium
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Unlock unlimited premium chapters with VIP membership.
          </p>

          <div className="flex gap-2">
            {["Fantasy", "Sci-Fi", "Romance"].map((g) => (
              <span
                key={g}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(90,59,255,0.3)",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(90,59,255,0.4)",
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Countdown pill */}
          <div className="absolute top-3 right-3">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    {countdown}
                  </motion.span>
                  <span className="text-xs">Ad ends in {countdown}s</span>
                </motion.div>
              ) : (
                <motion.button
                  key="skip"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                    border: "none",
                  }}
                  data-ocid="coins.ad_close_button"
                >
                  <X className="w-3.5 h-3.5" /> Skip
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Claim section */}
        <div className="p-5 bg-card">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="claim"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-2xl">🎉</span>
                  <p className="font-semibold text-foreground">Ad complete!</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You earned{" "}
                  <span className="font-bold" style={{ color: "#FFD700" }}>
                    +{COINS_PER_AD} Coins
                  </span>
                </p>
                <Button
                  className="w-full rounded-xl font-bold h-12 text-base border-0 btn-press shadow-glow"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                  onClick={handleClaim}
                  data-ocid="coins.ad_claim_button"
                >
                  <Coins className="w-4 h-4 mr-2" /> Claim {COINS_PER_AD} Coins
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="watching"
                className="flex items-center justify-center gap-2.5 text-muted-foreground text-sm py-3"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "oklch(var(--primary)/0.3)",
                    borderTopColor: "oklch(var(--primary))",
                  }}
                />
                Watching ad… {countdown}s remaining
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SuccessOverlay({
  show,
  newBalance,
  onClose,
}: {
  show: boolean;
  newBalance: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(10, 5, 30, 0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Particle ring */}
          {(["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"] as const).map(
            (pid, i) => (
              <motion.div
                key={pid}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: 0,
                  x: Math.cos((i / 8) * Math.PI * 2) * 140,
                  y: Math.sin((i / 8) * Math.PI * 2) * 140,
                  scale: 1.2,
                }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="absolute w-3 h-3 rounded-full"
                style={{ background: i % 2 === 0 ? "#FFD700" : "#5A3BFF" }}
              />
            ),
          )}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative flex flex-col items-center gap-4 text-center px-8"
          >
            {/* Coin icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], y: [0, -8, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background:
                  "radial-gradient(circle, #FFE066 0%, #FFD700 50%, #F5A500 100%)",
                boxShadow:
                  "0 0 50px rgba(255, 215, 0, 0.5), 0 0 100px rgba(255, 215, 0, 0.2)",
              }}
            >
              <Coins className="w-14 h-14 text-amber-900" />
            </motion.div>

            {/* +50 Coins text */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <p
                className="text-5xl font-display font-black"
                style={{
                  color: "#FFD700",
                  textShadow: "0 0 30px rgba(255,215,0,0.6)",
                }}
              >
                +{COINS_PER_AD}
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                Coins Earned!
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-sm"
            >
              New balance:{" "}
              <span className="font-bold text-foreground">
                {newBalance.toLocaleString()} coins
              </span>
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              type="button"
              onClick={onClose}
              className="mt-2 text-sm text-muted-foreground underline underline-offset-2 cursor-pointer bg-transparent border-none"
              data-ocid="coins.success_close_button"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HistoryItem({
  record,
  index,
}: { record: AdHistoryRecord; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center justify-between py-3"
      data-ocid={`coins.history_item.${index + 1}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(255,215,0,0.12)",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          <Play className="w-4 h-4" style={{ color: "#FFD700" }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            Rewarded Ad
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTimestamp(record.timestamp)}
          </p>
        </div>
      </div>
      <Badge
        variant="secondary"
        className="rounded-xl font-semibold shrink-0 ml-2"
        style={{
          background: "rgba(255,215,0,0.1)",
          color: "#FFD700",
          border: "1px solid rgba(255,215,0,0.2)",
        }}
      >
        +{record.coins}
      </Badge>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoinsPage() {
  const { currentUser, updateUser } = useAppStore();

  // ── Ad state ──
  const [adOpen, setAdOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // buffering before modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [successBalance, setSuccessBalance] = useState(0);
  const clickingRef = useRef(false); // debounce

  // ── Tracker state ──
  const [tracker, setTracker] = useState<AdTracker>(loadTracker);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // ── History ──
  const [history, setHistory] = useState<AdHistoryRecord[]>(() =>
    loadHistory().slice(0, 10),
  );

  // ── Derived ──
  const isLimitReached = tracker.count >= DAILY_AD_LIMIT;
  const isOnCooldown = cooldownLeft > 0;
  const canWatch = !isLimitReached && !isOnCooldown && !isLoading;
  const progressPct = Math.round((tracker.count / DAILY_AD_LIMIT) * 100);
  const coinsEarnedToday = tracker.count * COINS_PER_AD;

  // Midnight reset time (display)
  const midnightReset = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }, []);

  // ── Cooldown ticker ──
  useEffect(() => {
    const refreshCooldown = () => {
      const t = loadTracker();
      if (t.lastWatched === 0) {
        setCooldownLeft(0);
        return;
      }
      const elapsed = Math.floor((Date.now() - t.lastWatched) / 1000);
      const remaining = Math.max(0, COOLDOWN_SECONDS - elapsed);
      setCooldownLeft(remaining);
    };

    refreshCooldown();
    const interval = setInterval(refreshCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Watch ad handler ──
  const handleWatchAd = useCallback(() => {
    if (!canWatch || clickingRef.current) return;
    clickingRef.current = true;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAdOpen(true);
      clickingRef.current = false;
    }, 1500);
  }, [canWatch]);

  // ── Ad complete ──
  const handleAdComplete = useCallback(() => {
    const coins = currentUser?.coins ?? 0;
    const newCoins = coins + COINS_PER_AD;

    updateUser({ coins: newCoins });

    // Update tracker
    const newTracker: AdTracker = {
      date: todayStr(),
      count: tracker.count + 1,
      lastWatched: Date.now(),
    };
    saveTracker(newTracker);
    setTracker(newTracker);

    // Update history
    const record: AdHistoryRecord = {
      id: `ad-${Date.now()}`,
      timestamp: Date.now(),
      coins: COINS_PER_AD,
    };
    const newHistory = [record, ...history].slice(0, 10);
    setHistory(newHistory);
    saveHistory(newHistory);

    // Show success overlay
    setSuccessBalance(newCoins);
    setShowSuccess(true);
    toast.success(`+${COINS_PER_AD} coins added!`, {
      description: "Great job watching the ad 🎉",
    });
  }, [currentUser?.coins, tracker.count, history, updateUser]);

  // ── Button label / state ──
  const btnLabel = useMemo(() => {
    if (isLoading) return "Loading ad…";
    if (isLimitReached) return "Daily limit reached";
    if (isOnCooldown) return `Next ad in: ${formatCountdown(cooldownLeft)}`;
    return `Watch Ad · Earn ${COINS_PER_AD} Coins`;
  }, [isLoading, isLimitReached, isOnCooldown, cooldownLeft]);

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16" data-ocid="coins.page">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Animated coin icon */}
          <motion.div
            className="relative inline-flex items-center justify-center w-24 h-24 rounded-full mb-5 mx-auto"
            style={{
              background:
                "radial-gradient(circle, #FFE066 0%, #FFD700 60%, #F0A800 100%)",
              boxShadow:
                "0 0 40px rgba(255, 215, 0, 0.35), 0 0 80px rgba(255, 215, 0, 0.1)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Coins className="w-12 h-12 text-amber-900" />
            {/* Orbit ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: "rgba(255,215,0,0.3)" }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground leading-tight mb-2">
            Earn Coins,{" "}
            <span
              className="inline-block"
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Unlock Stories
            </span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Watch short ads to earn coins instantly. Use them to unlock premium
            chapters.
          </p>

          {/* Balance pill */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 mt-5 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(255,215,0,0.08)",
              border: "1px solid rgba(255,215,0,0.25)",
            }}
          >
            <Coins className="w-4 h-4" style={{ color: "#FFD700" }} />
            <span className="font-bold text-lg text-foreground">
              <CoinCountUp value={currentUser?.coins ?? 0} />
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              coins
            </span>
          </motion.div>
        </motion.div>

        {/* ── Main CTA Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Gradient accent behind */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(90,59,255,0.5) 0%, transparent 70%), radial-gradient(ellipse at bottom-right, rgba(233,30,140,0.3) 0%, transparent 60%)",
            }}
          />

          <div className="relative p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-glow"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Video className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground leading-tight">
                  Watch Ad → Earn {COINS_PER_AD} Coins
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Watch a 5-second ad and collect your coins instantly
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: "Earned Today",
                  value: `${coinsEarnedToday}`,
                  suffix: "coins",
                },
                {
                  label: "Ads Watched",
                  value: `${tracker.count}/${DAILY_AD_LIMIT}`,
                  suffix: "",
                },
                { label: "Per Ad", value: `${COINS_PER_AD}`, suffix: "coins" },
              ].map(({ label, value, suffix }) => (
                <div
                  key={label}
                  className="text-center p-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="font-bold text-foreground text-lg leading-none">
                    {value}
                    {suffix && (
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        {suffix}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-muted-foreground">
                  {tracker.count}/{DAILY_AD_LIMIT} ads watched today
                </p>
                <p className="text-xs text-muted-foreground">{progressPct}%</p>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Watch button */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full rounded-2xl h-14 flex items-center justify-center gap-2.5 text-white font-semibold"
                    style={{
                      background: "var(--gradient-primary)",
                      opacity: 0.8,
                    }}
                    data-ocid="coins.watch_ad_loading_state"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: "rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                      }}
                    />
                    Loading ad…
                  </motion.div>
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      type="button"
                      disabled={!canWatch}
                      onClick={handleWatchAd}
                      className="w-full rounded-2xl h-14 text-base font-bold border-0 btn-press relative overflow-hidden"
                      style={
                        canWatch
                          ? {
                              background: "var(--gradient-primary)",
                              color: "white",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              color: "oklch(var(--muted-foreground))",
                              cursor: "not-allowed",
                            }
                      }
                      data-ocid="coins.watch_ad_button"
                    >
                      {/* Pulsing glow ring when available */}
                      {canWatch && (
                        <motion.span
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          animate={{
                            boxShadow: [
                              "0 0 0px rgba(90,59,255,0)",
                              "0 0 24px rgba(90,59,255,0.5)",
                              "0 0 0px rgba(90,59,255,0)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />
                      )}
                      <Play className="w-5 h-5 mr-2" />
                      {btnLabel}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* State messages */}
            <AnimatePresence>
              {isLimitReached && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-xs text-muted-foreground mt-3"
                  data-ocid="coins.limit_reached_state"
                >
                  🎯 Daily limit reached! Come back at{" "}
                  <span className="text-foreground font-medium">
                    {midnightReset}
                  </span>{" "}
                  for more coins.
                </motion.p>
              )}
              {!isLimitReached && isOnCooldown && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-xs text-muted-foreground mt-3"
                  data-ocid="coins.cooldown_state"
                >
                  ⏱ Cooldown active. Next ad available in{" "}
                  <span className="font-medium text-foreground">
                    {formatCountdown(cooldownLeft)}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { step: "1", icon: "👁️", label: "Watch 5s Ad" },
            { step: "2", icon: "🎁", label: "Claim Reward" },
            { step: "3", icon: "🔓", label: "Unlock Chapters" },
          ].map(({ step, icon, label }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="text-center py-4 px-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-2xl">{icon}</span>
              <p className="text-xs font-medium text-foreground mt-2 leading-snug">
                {label}
              </p>
              <p
                className="text-xs mt-1 font-bold"
                style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Step {step}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Daily limit info ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 mb-8 flex items-start gap-3"
          style={{
            background: "rgba(90,59,255,0.06)",
            border: "1px solid rgba(90,59,255,0.12)",
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(90,59,255,0.15)" }}
          >
            <span className="text-sm">ℹ️</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Daily Coin Rules
            </p>
            <ul className="text-xs text-muted-foreground mt-1.5 space-y-1">
              <li>
                • Watch up to{" "}
                <span className="text-foreground font-medium">
                  {DAILY_AD_LIMIT} ads
                </span>{" "}
                per day (earn up to{" "}
                <span className="text-foreground font-medium">
                  {DAILY_AD_LIMIT * COINS_PER_AD} coins
                </span>
                )
              </li>
              <li>
                • A{" "}
                <span className="text-foreground font-medium">
                  3-minute cooldown
                </span>{" "}
                is required between ads
              </li>
              <li>• Daily limit resets every midnight</li>
            </ul>
          </div>
        </motion.div>

        {/* ── Reward History ── */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              data-ocid="coins.history_section"
            >
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4" style={{ color: "#FFD700" }} />
                <h2 className="font-display font-bold text-base text-foreground">
                  Reward History
                </h2>
              </div>
              <Separator className="mb-1 opacity-40" />
              <div className="divide-y divide-border/40">
                {history.map((rec, i) => (
                  <HistoryItem key={rec.id} record={rec} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty history placeholder */}
        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
            data-ocid="coins.history_empty_state"
          >
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-sm font-medium text-foreground">
              No reward history yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Watch your first ad above to start earning coins!
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Ad Modal ── */}
      <AdModal
        open={adOpen}
        onClose={() => setAdOpen(false)}
        onComplete={handleAdComplete}
      />

      {/* ── Success Overlay ── */}
      <SuccessOverlay
        show={showSuccess}
        newBalance={successBalance}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
