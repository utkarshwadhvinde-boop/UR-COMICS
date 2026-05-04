import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FAQ } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Shield,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "FaqAdmin2025!";
const LS_FAQS_KEY = "ur_comics_faqs";

const CATEGORIES = [
  "Getting Started",
  "Reading",
  "Creators",
  "Coins & Premium",
  "Account",
];

function loadStoredFAQs(): FAQ[] {
  try {
    const raw = localStorage.getItem(LS_FAQS_KEY);
    return raw ? (JSON.parse(raw) as FAQ[]) : [];
  } catch {
    return [];
  }
}

function saveStoredFAQs(faqs: FAQ[]): void {
  localStorage.setItem(LS_FAQS_KEY, JSON.stringify(faqs));
}

type AdminTab = "approved" | "pending" | "add";

export default function AdminPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>("approved");

  // Inline edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Add new FAQ form state
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);

  // Delete confirm
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      setFaqs(loadStoredFAQs());
    }
  }, [authenticated]);

  const persist = (updated: FAQ[]) => {
    setFaqs(updated);
    saveStoredFAQs(updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast.success("Admin access granted");
    } else {
      toast.error("Incorrect password");
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category);
  };

  const saveEdit = () => {
    if (!editId) return;
    persist(
      faqs.map((f) =>
        f.id === editId
          ? {
              ...f,
              question: editQuestion.trim(),
              answer: editAnswer.trim(),
              category: editCategory,
            }
          : f,
      ),
    );
    setEditId(null);
    toast.success("FAQ updated successfully");
  };

  const confirmDelete = (id: string) => setDeleteTargetId(id);

  const executeDelete = () => {
    if (!deleteTargetId) return;
    persist(faqs.filter((f) => f.id !== deleteTargetId));
    setDeleteTargetId(null);
    toast.success("FAQ deleted");
  };

  const toggleApprove = (id: string) => {
    persist(
      faqs.map((f) => (f.id === id ? { ...f, isApproved: !f.isApproved } : f)),
    );
    const faq = faqs.find((f) => f.id === id);
    toast.success(
      faq?.isApproved
        ? "Question unpublished"
        : "Question approved and published",
    );
  };

  const togglePin = (id: string) => {
    persist(
      faqs.map((f) => (f.id === id ? { ...f, isPinned: !f.isPinned } : f)),
    );
    const faq = faqs.find((f) => f.id === id);
    toast.success(
      faq?.isPinned ? "Unpinned from top" : "Pinned as Top Answer ⭐",
    );
  };

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    const newFaq: FAQ = {
      id: `admin-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
      upvotes: 0,
      isApproved: true,
      createdAt: Date.now(),
    };
    persist([...faqs, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory(CATEGORIES[0]);
    toast.success("FAQ added and published");
    setActiveTab("approved");
  };

  const approved = faqs.filter((f) => f.isApproved);
  const pending = faqs.filter((f) => !f.isApproved);

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div
        className="min-h-[80vh] flex items-center justify-center px-4"
        data-ocid="admin.login_page"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                FAQ Admin Panel
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter your admin password to continue
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-pw">Admin Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="admin-pw"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pr-11 rounded-xl"
                    autoComplete="current-password"
                    data-ocid="admin.password_input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                    onClick={() => setShowPw((v) => !v)}
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
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11"
                data-ocid="admin.login_button"
              >
                Access Panel
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-xl"
                onClick={() => void navigate({ to: "/" })}
                data-ocid="admin.back_home_button"
              >
                Back to Home
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Admin Panel ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-10" data-ocid="admin.panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              FAQ Admin Panel
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage questions, answers and visibility
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => setAuthenticated(false)}
          className="text-muted-foreground rounded-xl"
          data-ocid="admin.logout_button"
        >
          Log Out
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Published", value: approved.length, icon: "✅" },
          { label: "Pending", value: pending.length, icon: "⏳" },
          {
            label: "Top Answers",
            value: faqs.filter((f) => f.isPinned).length,
            icon: "⭐",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold font-display text-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 bg-muted rounded-2xl p-1.5">
        {[
          {
            key: "approved" as AdminTab,
            label: `Published (${approved.length})`,
            badge: false,
          },
          {
            key: "pending" as AdminTab,
            label: `Pending (${pending.length})`,
            badge: pending.length > 0,
          },
          { key: "add" as AdminTab, label: "Add New FAQ", badge: false },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 relative flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-smooth ${
              activeTab === tab.key
                ? "gradient-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`admin.tab.${tab.key}`}
          >
            {tab.label}
            {tab.badge && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
            )}
          </button>
        ))}
      </div>

      {/* ── Published FAQs ── */}
      <AnimatePresence mode="wait">
        {activeTab === "approved" && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {approved.length === 0 ? (
              <div
                className="text-center py-12 bg-card rounded-2xl border border-border"
                data-ocid="admin.approved.empty_state"
              >
                <p className="text-3xl mb-2">📋</p>
                <p className="text-muted-foreground">No published FAQs yet.</p>
              </div>
            ) : (
              approved.map((faq, i) => (
                <FAQAdminCard
                  key={faq.id}
                  faq={faq}
                  index={i}
                  isEditing={editId === faq.id}
                  editQuestion={editQuestion}
                  editAnswer={editAnswer}
                  editCategory={editCategory}
                  categories={CATEGORIES}
                  onEditChange={{
                    setEditQuestion,
                    setEditAnswer,
                    setEditCategory,
                  }}
                  onStartEdit={() => startEdit(faq)}
                  onSaveEdit={saveEdit}
                  onCancelEdit={() => setEditId(null)}
                  onDelete={() => confirmDelete(faq.id)}
                  onToggleApprove={() => toggleApprove(faq.id)}
                  onTogglePin={() => togglePin(faq.id)}
                  ocidPrefix="admin.approved"
                />
              ))
            )}
          </motion.div>
        )}

        {/* ── Pending Questions ── */}
        {activeTab === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {pending.length === 0 ? (
              <div
                className="text-center py-12 bg-card rounded-2xl border border-border"
                data-ocid="admin.pending.empty_state"
              >
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-muted-foreground">
                  No pending questions — you're all caught up!
                </p>
              </div>
            ) : (
              pending.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl border border-amber-200/60 dark:border-amber-900/40 p-5 shadow-sm"
                  data-ocid={`admin.pending.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="text-xs text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 border-0 rounded-full"
                        >
                          User Question
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground">
                        {faq.question}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted {new Date(faq.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => toggleApprove(faq.id)}
                        className="gradient-primary text-primary-foreground border-0 rounded-xl gap-1"
                        data-ocid={`admin.pending.approve_button.${i + 1}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmDelete(faq.id)}
                        className="rounded-xl gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                        data-ocid={`admin.pending.reject_button.${i + 1}`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  {faq.answer && (
                    <div className="mt-3 p-3 bg-muted rounded-xl">
                      <p className="text-sm text-foreground">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* ── Add New FAQ ── */}
        {activeTab === "add" && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-display font-bold text-foreground">
                  Add New FAQ
                </h2>
              </div>
              <form onSubmit={handleAddFAQ} className="space-y-4">
                <div>
                  <Label htmlFor="new-category">Category</Label>
                  <select
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    data-ocid="admin.add.category_select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="new-question">
                    Question <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter the question..."
                    className="mt-1 rounded-xl"
                    data-ocid="admin.add.question_input"
                  />
                </div>
                <div>
                  <Label htmlFor="new-answer">
                    Answer <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="new-answer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write the answer..."
                    rows={4}
                    className="mt-1 rounded-xl resize-none"
                    data-ocid="admin.add.answer_textarea"
                  />
                </div>
                <Button
                  type="submit"
                  className="gradient-primary text-primary-foreground border-0 rounded-xl px-6"
                  data-ocid="admin.add.submit_button"
                >
                  Publish FAQ
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteTargetId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="admin.delete.dialog"
          >
            <motion.div
              className="bg-card rounded-2xl border border-border p-6 shadow-xl w-full max-w-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
                <h3 className="font-semibold text-foreground">Delete FAQ?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. The FAQ will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0"
                  onClick={executeDelete}
                  data-ocid="admin.delete.confirm_button"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setDeleteTargetId(null)}
                  data-ocid="admin.delete.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAQAdminCard component ───────────────────────────────────────────────────
interface EditChangeHandlers {
  setEditQuestion: (v: string) => void;
  setEditAnswer: (v: string) => void;
  setEditCategory: (v: string) => void;
}

interface FAQAdminCardProps {
  faq: FAQ & { isPinned?: boolean };
  index: number;
  isEditing: boolean;
  editQuestion: string;
  editAnswer: string;
  editCategory: string;
  categories: string[];
  onEditChange: EditChangeHandlers;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onToggleApprove: () => void;
  onTogglePin: () => void;
  ocidPrefix: string;
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
  ocidPrefix,
}: FAQAdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-card rounded-2xl border border-border p-5 shadow-sm"
      data-ocid={`${ocidPrefix}.item.${index + 1}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Category</Label>
            <select
              value={editCategory}
              onChange={(e) => onEditChange.setEditCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Question</Label>
            <Input
              value={editQuestion}
              onChange={(e) => onEditChange.setEditQuestion(e.target.value)}
              className="mt-1 rounded-xl font-semibold"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Answer</Label>
            <Textarea
              value={editAnswer}
              onChange={(e) => onEditChange.setEditAnswer(e.target.value)}
              rows={3}
              className="mt-1 rounded-xl resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSaveEdit}
              className="rounded-xl gradient-primary text-primary-foreground border-0"
              data-ocid={`${ocidPrefix}.save_button.${index + 1}`}
            >
              Save Changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancelEdit}
              className="rounded-xl"
              data-ocid={`${ocidPrefix}.cancel_button.${index + 1}`}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {faq.isPinned && (
                <Badge className="gradient-primary text-primary-foreground border-0 text-xs rounded-full">
                  ⭐ Top Answer
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs rounded-full">
                {faq.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                👍 {faq.upvotes}
              </span>
            </div>
            <p className="font-semibold text-foreground leading-snug">
              {faq.question}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {faq.answer}
            </p>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onTogglePin}
              className={`rounded-xl text-xs gap-1 ${
                faq.isPinned ? "text-amber-500" : "text-muted-foreground"
              }`}
              title={faq.isPinned ? "Unpin" : "Pin as Top Answer"}
              data-ocid={`${ocidPrefix}.pin_button.${index + 1}`}
            >
              <Star
                className={`w-3.5 h-3.5 ${faq.isPinned ? "fill-amber-500" : ""}`}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onStartEdit}
              className="rounded-xl gap-1"
              data-ocid={`${ocidPrefix}.edit_button.${index + 1}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleApprove}
              className="rounded-xl gap-1 text-muted-foreground"
              title="Unpublish"
              data-ocid={`${ocidPrefix}.unpublish_button.${index + 1}`}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              data-ocid={`${ocidPrefix}.delete_button.${index + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
