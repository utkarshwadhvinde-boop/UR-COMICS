import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  isOwnerAuthenticated,
  loadStealth,
  saveOwnerAuth,
  saveStealth,
} from "@/lib/localStorage";
import { formatNumber } from "@/lib/sampleData";
import { useAppStore } from "@/store";
import type { Comic, ComicStatus, Genre } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  Crown,
  Edit,
  Eye,
  EyeOff,
  Flame,
  Heart,
  Lock,
  LogOut,
  Pin,
  Shield,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OWNER_PASSWORD = "UrComics2025!";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 10_000;

const ALL_GENRES: Genre[] = [
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

// ─── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!lockoutEnd) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutEnd - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutEnd(null);
        setSecondsLeft(0);
        clearInterval(interval);
      } else {
        setSecondsLeft(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockoutEnd]);

  const isLocked = lockoutEnd !== null && Date.now() < lockoutEnd;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (password === OWNER_PASSWORD) {
      saveOwnerAuth(true);
      toast.success("Owner access granted", { id: "owner-login" });
      onSuccess();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        const end = Date.now() + LOCKOUT_MS;
        setLockoutEnd(end);
        setSecondsLeft(Math.ceil(LOCKOUT_MS / 1000));
        toast.error(`Too many attempts. Locked for ${LOCKOUT_MS / 1000}s.`);
        setTimeout(() => void navigate({ to: "/" }), LOCKOUT_MS);
      } else {
        toast.error(`Wrong password. ${MAX_ATTEMPTS - next} attempt(s) left.`);
      }
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #0D0A1A 0%, #1A1035 50%, #0D0A1A 100%)",
      }}
      data-ocid="owner.login_page"
    >
      <div
        className="w-full max-w-sm mx-auto p-8 rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(114,102,255,0.25)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 60px rgba(90,59,255,0.15)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #5A3BFF, #A855F7)" }}
          >
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "#E8E0FF", fontFamily: "var(--font-display)" }}
          >
            Owner Panel
          </h1>
          <p style={{ color: "#7B6FAA", fontSize: "0.85rem" }}>
            Restricted access — authorized only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label
              style={{
                color: "#9B8ECF",
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
              }}
            >
              OWNER PASSWORD
            </Label>
            <div className="relative mt-2">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter owner password"
                disabled={isLocked}
                className="pr-10 rounded-xl border-0 text-white placeholder:text-white/20"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#E8E0FF",
                  border: "1px solid rgba(114,102,255,0.3)",
                }}
                data-ocid="owner.password_input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => setShowPw((v) => !v)}
                style={{ color: "#9B8ECF" }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {isLocked && (
            <div
              className="text-center text-sm rounded-xl py-2"
              style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}
            >
              Locked. Redirecting in {secondsLeft}s…
            </div>
          )}

          <Button
            type="submit"
            disabled={isLocked || !password}
            className="w-full rounded-xl h-11 font-semibold border-0 text-white"
            style={{ background: "linear-gradient(135deg, #5A3BFF, #A855F7)" }}
            data-ocid="owner.login_button"
          >
            <Shield className="w-4 h-4 mr-2" />
            Access Owner Panel
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Upload Form ───────────────────────────────────────────────────────────────
interface UploadFormData {
  title: string;
  description: string;
  author: string;
  coverImage: string;
  genres: Genre[];
  status: ComicStatus;
  isFeatured: boolean;
  isTrending: boolean;
  isPremium: boolean;
  isPinned: boolean;
  forceBoost: boolean;
}

const EMPTY_FORM: UploadFormData = {
  title: "",
  description: "",
  author: "",
  coverImage: "",
  genres: [],
  status: "ongoing",
  isFeatured: false,
  isTrending: false,
  isPremium: false,
  isPinned: false,
  forceBoost: false,
};

function OwnerUploadForm({ onDone }: { onDone: () => void }) {
  const { addComic } = useAppStore();
  const [form, setForm] = useState<UploadFormData>(EMPTY_FORM);

  const toggleGenre = (g: Genre) => {
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(g)
        ? f.genres.filter((x) => x !== g)
        : [...f.genres, g],
    }));
  };

  const set = <K extends keyof UploadFormData>(k: K, v: UploadFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      toast.error("Title and author are required.");
      return;
    }
    const id = `owner-${Date.now()}`;
    const now = Date.now();
    const newComic: Comic = {
      id,
      title: form.title,
      description: form.description,
      author: form.author,
      coverImage: form.coverImage || "/assets/generated/placeholder-page.jpg",
      genres: form.genres.length ? form.genres : ["Action"],
      status: form.status,
      likes: form.forceBoost ? 5000 : 0,
      views: form.forceBoost ? 50000 : 0,
      rating: 5.0,
      chapters: [],
      createdAt: now,
      updatedAt: now,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isPremium: form.isPremium,
      isPinned: form.isPinned,
      creatorId: "owner",
      isOwnerComic: true,
    };
    addComic(newComic);
    toast.success(`"${form.title}" published instantly!`);
    setForm(EMPTY_FORM);
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      data-ocid="owner.upload_form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="owner-label">TITLE *</Label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Comic title"
            className="owner-input mt-1"
            data-ocid="owner.upload_title_input"
          />
        </div>
        <div>
          <Label className="owner-label">AUTHOR *</Label>
          <Input
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            placeholder="Author name"
            className="owner-input mt-1"
            data-ocid="owner.upload_author_input"
          />
        </div>
      </div>

      <div>
        <Label className="owner-label">DESCRIPTION</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Comic description…"
          rows={3}
          className="owner-input mt-1 resize-none"
          data-ocid="owner.upload_description_input"
        />
      </div>

      <div>
        <Label className="owner-label">COVER IMAGE URL</Label>
        <Input
          value={form.coverImage}
          onChange={(e) => set("coverImage", e.target.value)}
          placeholder="https://…"
          className="owner-input mt-1"
          data-ocid="owner.upload_cover_input"
        />
      </div>

      <div>
        <Label className="owner-label">STATUS</Label>
        <select
          value={form.status}
          onChange={(e) => set("status", e.target.value as ComicStatus)}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          data-ocid="owner.upload_status_select"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="hiatus">Hiatus</option>
        </select>
      </div>

      <div>
        <Label className="owner-label">GENRES</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {ALL_GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleGenre(g)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
              style={
                form.genres.includes(g)
                  ? {
                      background: "linear-gradient(135deg, #5A3BFF, #A855F7)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "#7B6FAA",
                      border: "1px solid rgba(114,102,255,0.2)",
                    }
              }
              data-ocid={`owner.genre_toggle.${g.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Owner-exclusive flags */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: "rgba(90,59,255,0.08)",
          border: "1px solid rgba(114,102,255,0.2)",
        }}
      >
        <p
          className="text-xs font-semibold"
          style={{ color: "#9B8ECF", letterSpacing: "0.05em" }}
        >
          OWNER PRIVILEGES
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: "isFeatured", label: "⭐ Featured", field: "isFeatured" },
              { key: "isTrending", label: "🔥 Trending", field: "isTrending" },
              { key: "isPremium", label: "🔒 Premium", field: "isPremium" },
              { key: "isPinned", label: "📌 Pinned at Top", field: "isPinned" },
            ] as const
          ).map(({ key, label, field }) => (
            <div
              key={key}
              className="flex items-center gap-2"
              data-ocid={`owner.upload_${field}_checkbox`}
            >
              <Checkbox
                id={`flag-${key}`}
                checked={form[field]}
                onCheckedChange={(v) => set(field, !!v)}
                className="border-purple-500/40 data-[state=checked]:bg-purple-600"
              />
              <Label
                htmlFor={`flag-${key}`}
                className="text-sm cursor-pointer"
                style={{ color: "#C4B5FD" }}
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer"
          data-ocid="owner.upload_boost_toggle"
        >
          <Switch
            id="force-boost-switch"
            checked={form.forceBoost}
            onCheckedChange={(v) => set("forceBoost", v)}
            className="data-[state=checked]:bg-purple-600"
          />
          <Label
            htmlFor="force-boost-switch"
            className="text-sm cursor-pointer"
            style={{ color: "#C4B5FD" }}
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Force Visibility Boost (seed views/likes)
          </Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1 rounded-xl h-11 font-semibold border-0 text-white"
          style={{ background: "linear-gradient(135deg, #5A3BFF, #A855F7)" }}
          data-ocid="owner.upload_submit_button"
        >
          <Upload className="w-4 h-4 mr-2" />
          Publish Instantly
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setForm(EMPTY_FORM)}
          className="rounded-xl px-4"
          style={{ color: "#7B6FAA" }}
          data-ocid="owner.upload_reset_button"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

// ─── Comic Row ─────────────────────────────────────────────────────────────────
function ComicRow({
  comic,
  index,
  selected,
  onSelect,
}: {
  comic: Comic;
  index: number;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}) {
  const { updateComic, deleteComic } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(comic.title);

  const toggleFlag = (
    field: "isFeatured" | "isTrending" | "isPremium" | "isPinned",
  ) => {
    updateComic(comic.id, { [field]: !comic[field] });
    toast.success("Updated!");
  };

  const handleDelete = () => {
    if (confirm(`Delete "${comic.title}" permanently?`)) {
      deleteComic(comic.id);
      toast.success("Comic deleted");
    }
  };

  const saveEdit = () => {
    if (editTitle.trim()) updateComic(comic.id, { title: editTitle.trim() });
    setEditing(false);
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-all duration-200 group"
      style={{
        borderBottom: "1px solid rgba(114,102,255,0.1)",
        background: selected ? "rgba(90,59,255,0.08)" : "transparent",
      }}
      data-ocid={`owner.comic.item.${index}`}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={(v) => onSelect(comic.id, !!v)}
        className="shrink-0 border-purple-500/40 data-[state=checked]:bg-purple-600"
        data-ocid={`owner.comic.checkbox.${index}`}
      />
      <img
        src={comic.coverImage}
        alt={comic.title}
        className="w-10 h-14 object-cover rounded-lg shrink-0"
        style={{ border: "1px solid rgba(114,102,255,0.2)" }}
      />
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex gap-2 items-center">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-7 text-sm rounded-lg owner-input"
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              data-ocid={`owner.comic.edit_input.${index}`}
              autoFocus
            />
            <Button
              size="sm"
              onClick={saveEdit}
              className="h-7 text-xs rounded-lg border-0"
              style={{ background: "#5A3BFF", color: "#fff" }}
              data-ocid={`owner.comic.save_button.${index}`}
            >
              Save
            </Button>
          </div>
        ) : (
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "#E8E0FF" }}
          >
            {comic.title}
          </p>
        )}
        <p className="text-xs truncate mt-0.5" style={{ color: "#7B6FAA" }}>
          {comic.author}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {comic.isOwnerComic && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(90,59,255,0.3)", color: "#C4B5FD" }}
            >
              👑 Owner
            </span>
          )}
          {comic.isPinned && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              📌 Pinned
            </span>
          )}
          {comic.isFeatured && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              ⭐ Featured
            </span>
          )}
          {comic.isTrending && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
              🔥 Trending
            </span>
          )}
          {comic.isPremium && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-700/40 text-zinc-400">
              🔒 Premium
            </span>
          )}
        </div>
      </div>
      <div
        className="text-xs text-right shrink-0 hidden md:block"
        style={{ color: "#7B6FAA" }}
      >
        <p>{formatNumber(comic.views)} views</p>
        <p>{formatNumber(comic.likes)} likes</p>
      </div>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => {
            setEditing((v) => !v);
            setEditTitle(comic.title);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: "#9B8ECF" }}
          title="Edit title"
          data-ocid={`owner.comic.edit_button.${index}`}
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFlag("isPinned")}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: comic.isPinned ? "#A78BFA" : "#7B6FAA" }}
          title="Pin"
          data-ocid={`owner.comic.pin_button.${index}`}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFlag("isFeatured")}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: comic.isFeatured ? "#F59E0B" : "#7B6FAA" }}
          title="Feature"
          data-ocid={`owner.comic.feature_button.${index}`}
        >
          <Star className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFlag("isTrending")}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: comic.isTrending ? "#F97316" : "#7B6FAA" }}
          title="Trending"
          data-ocid={`owner.comic.trending_button.${index}`}
        >
          <Flame className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFlag("isPremium")}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: comic.isPremium ? "#E8E0FF" : "#7B6FAA" }}
          title="Premium"
          data-ocid={`owner.comic.premium_button.${index}`}
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: "#F87171" }}
          title="Delete"
          data-ocid={`owner.comic.delete_button.${index}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard() {
  const { comics, updateComic, deleteComic, demoMode, setDemoMode } =
    useAppStore();
  const [stealthMode, setStealthMode] = useState(loadStealth);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterOwner, setFilterOwner] = useState(false);

  const handleStealthToggle = (v: boolean) => {
    saveStealth(v);
    setStealthMode(v);
    toast.success(
      v ? "Stealth mode ON — panel hidden from UI" : "Stealth mode OFF",
    );
  };

  const handleDemoToggle = (v: boolean) => {
    setDemoMode(v);
    toast.success(
      v
        ? "Demo Mode ON — sample comics loaded for testing"
        : "Demo Mode OFF — showing real data only",
    );
  };

  const handleLogout = () => {
    saveOwnerAuth(false);
    window.location.href = "/";
  };

  const totalViews = comics.reduce((a, c) => a + c.views, 0);
  const totalLikes = comics.reduce((a, c) => a + c.likes, 0);
  const ownerComics = comics.filter((c) => c.isOwnerComic);
  const displayed = filterOwner ? ownerComics : comics;

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === displayed.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayed.map((c) => c.id)));
    }
  };

  const bulkPublish = () => {
    for (const id of selected) updateComic(id, { status: "ongoing" });
    toast.success(`Published ${selected.size} comic(s)`);
    setSelected(new Set());
  };

  const bulkUnpublish = () => {
    for (const id of selected) updateComic(id, { status: "hiatus" });
    toast.success(`Set ${selected.size} comic(s) to hiatus`);
    setSelected(new Set());
  };

  const bulkDelete = () => {
    if (!confirm(`Delete ${selected.size} comic(s) permanently?`)) return;
    for (const id of selected) deleteComic(id);
    toast.success(`Deleted ${selected.size} comic(s)`);
    setSelected(new Set());
  };

  const stats = [
    {
      icon: BookOpen,
      label: "Total Comics",
      value: comics.length,
      accent: "#7C3AED",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: formatNumber(totalViews),
      accent: "#2563EB",
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: formatNumber(totalLikes),
      accent: "#DC2626",
    },
    {
      icon: Users,
      label: "Creators",
      value: new Set(comics.map((c) => c.creatorId)).size,
      accent: "#059669",
    },
    {
      icon: Crown,
      label: "Owner Comics",
      value: ownerComics.length,
      accent: "#D97706",
    },
    {
      icon: TrendingUp,
      label: "Trending",
      value: comics.filter((c) => c.isTrending).length,
      accent: "#EA580C",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0D0A1A" }}
      data-ocid="owner.panel"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(13,10,26,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(114,102,255,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #5A3BFF, #A855F7)" }}
          >
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1
              className="text-base font-bold"
              style={{ color: "#E8E0FF", fontFamily: "var(--font-display)" }}
            >
              Owner Panel
            </h1>
            <p className="text-xs" style={{ color: "#7B6FAA" }}>
              Full platform control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium" style={{ color: "#F59E0B" }}>
                Demo Mode
              </p>
              <p className="text-[10px]" style={{ color: "#7B6FAA" }}>
                {demoMode ? "Sample data ON" : "Real data only"}
              </p>
            </div>
            <Switch
              checked={demoMode}
              onCheckedChange={handleDemoToggle}
              className="data-[state=checked]:bg-amber-500"
              data-ocid="owner.demo_mode_toggle"
            />
          </div>
          {/* Stealth Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium" style={{ color: "#C4B5FD" }}>
                Stealth Mode
              </p>
              <p className="text-[10px]" style={{ color: "#7B6FAA" }}>
                {stealthMode ? "Panel hidden from UI" : "Panel visible"}
              </p>
            </div>
            <Switch
              checked={stealthMode}
              onCheckedChange={handleStealthToggle}
              className="data-[state=checked]:bg-purple-600"
              data-ocid="owner.stealth_toggle"
            />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-colors"
            style={{
              color: "#7B6FAA",
              border: "1px solid rgba(114,102,255,0.2)",
            }}
            data-ocid="owner.logout_button"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
          data-ocid="owner.stats_section"
        >
          {stats.map(({ icon: Icon, label, value, accent }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(114,102,255,0.15)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${accent}22` }}
              >
                <Icon className="w-4 h-4" style={{ color: accent }} />
              </div>
              <p
                className="text-xl font-bold"
                style={{ color: "#E8E0FF", fontFamily: "var(--font-display)" }}
              >
                {value}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#7B6FAA" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="comics" className="space-y-6">
          <TabsList
            className="rounded-xl p-1 border-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(114,102,255,0.15)",
            }}
          >
            {[
              { value: "comics", label: "Comics", icon: BookOpen },
              { value: "upload", label: "Upload", icon: Upload },
              { value: "analytics", label: "Analytics", icon: BarChart3 },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-lg text-sm data-[state=active]:text-white border-0"
                style={{ color: "#7B6FAA" }}
                data-ocid={`owner.tab.${value}`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Comics Tab */}
          <TabsContent value="comics" className="space-y-4">
            {/* Filter + Bulk Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-2"
                data-ocid="owner.filter_owner_toggle"
              >
                <Switch
                  id="filter-owner-switch"
                  checked={filterOwner}
                  onCheckedChange={setFilterOwner}
                  className="data-[state=checked]:bg-purple-600 scale-90"
                />
                <Label
                  htmlFor="filter-owner-switch"
                  className="text-sm cursor-pointer"
                  style={{ color: "#9B8ECF" }}
                >
                  Owner comics only
                </Label>
              </div>
              {selected.size > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs" style={{ color: "#9B8ECF" }}>
                    {selected.size} selected
                  </span>
                  <button
                    type="button"
                    onClick={bulkPublish}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "rgba(5,150,105,0.2)",
                      color: "#34D399",
                    }}
                    data-ocid="owner.bulk_publish_button"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={bulkUnpublish}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "rgba(245,158,11,0.15)",
                      color: "#FCD34D",
                    }}
                    data-ocid="owner.bulk_unpublish_button"
                  >
                    Hiatus
                  </button>
                  <button
                    type="button"
                    onClick={bulkDelete}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      color: "#F87171",
                    }}
                    data-ocid="owner.bulk_delete_button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(114,102,255,0.15)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {/* Table header */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: "1px solid rgba(114,102,255,0.15)",
                  background: "rgba(90,59,255,0.06)",
                }}
              >
                <button
                  type="button"
                  onClick={selectAll}
                  className="flex items-center gap-2 text-xs font-medium"
                  style={{ color: "#9B8ECF" }}
                  data-ocid="owner.select_all_button"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  {selected.size === displayed.length && displayed.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </button>
                <span className="ml-auto text-xs" style={{ color: "#7B6FAA" }}>
                  {displayed.length} comics
                </span>
              </div>

              {displayed.length === 0 ? (
                <div
                  className="py-12 text-center"
                  data-ocid="owner.comics.empty_state"
                >
                  <Sparkles
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "#5A3BFF" }}
                  />
                  <p className="text-sm" style={{ color: "#7B6FAA" }}>
                    No comics yet. Upload your first!
                  </p>
                </div>
              ) : (
                displayed.map((comic, i) => (
                  <ComicRow
                    key={comic.id}
                    comic={comic}
                    index={i + 1}
                    selected={selected.has(comic.id)}
                    onSelect={toggleSelect}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(114,102,255,0.15)",
              }}
              data-ocid="owner.upload_section"
            >
              <div className="flex items-center gap-2 mb-6">
                <Upload className="w-5 h-5" style={{ color: "#A78BFA" }} />
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#E8E0FF",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Publish New Comic
                </h2>
                <Badge
                  className="text-xs ml-1 border-0"
                  style={{
                    background: "rgba(90,59,255,0.3)",
                    color: "#C4B5FD",
                  }}
                >
                  Owner · Instant
                </Badge>
              </div>
              <OwnerUploadForm onDone={() => {}} />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(114,102,255,0.15)",
              }}
              data-ocid="owner.analytics_section"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5" style={{ color: "#A78BFA" }} />
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#E8E0FF",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Platform Analytics
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm mb-4" style={{ color: "#7B6FAA" }}>
                  Top performing comics by views
                </p>
                {[...comics]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 8)
                  .map((comic, i) => {
                    const pct = Math.round(
                      (comic.views / (comics[0]?.views || 1)) * 100,
                    );
                    return (
                      <div
                        key={comic.id}
                        className="space-y-1"
                        data-ocid={`owner.analytics.item.${i + 1}`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className="truncate max-w-[60%]"
                            style={{ color: "#C4B5FD" }}
                          >
                            {i + 1}. {comic.title}
                          </span>
                          <span style={{ color: "#7B6FAA" }}>
                            {formatNumber(comic.views)} views
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background:
                                "linear-gradient(90deg, #5A3BFF, #A855F7)",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Page Entry ────────────────────────────────────────────────────────────────
export default function OwnerPage() {
  const [authenticated, setAuthenticated] = useState(isOwnerAuthenticated);

  // If owner auth session is active, go straight to dashboard
  if (authenticated) {
    return <Dashboard />;
  }

  return <LoginScreen onSuccess={() => setAuthenticated(true)} />;
}
