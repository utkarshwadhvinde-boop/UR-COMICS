Import { ErrorFallback } from "@/components/ErrorFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapters } from "@/hooks/useChapters";
import { useComic } from "@/hooks/useComic";
import { useReadProgress } from "@/hooks/useReadProgress";
import type { Chapter } from "@/types/index";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Lock,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Comments } from "@/components/Comments";
import { toast } from "sonner";

const REPORT_REASONS = [
  "Piracy — uploading official manga/comic pages",
  "AI content not disclosed",
  "Hate speech or discrimination",
  "Inappropriate content",
  "Harassment or abuse",
  "Other",
];

function ChapterRow({ chapter, comicId, index }: { chapter: Chapter; comicId: string; index: number }) {
  const date = new Date(chapter.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} data-ocid={`comic_detail.chapters.item.${index + 1}`}>
      <Link
        to="/comics/$comicId/chapters/$chapterId"
        params={{ comicId, chapterId: chapter.id }}
        className="flex items-center justify-between p-4 rounded-xl bg-card border border-accent/30 hover:border-accent/60 hover:bg-purple-900/30 hover:shadow-card transition-smooth group"
        data-ocid={`comic_detail.chapter_read_link.${index + 1}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <span className="text-accent font-display text-sm leading-none">{chapter.chapter_number}</span>
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm text-foreground font-medium truncate group-hover:text-accent transition-smooth">
              {chapter.title ?? `Chapter ${chapter.chapter_number}`}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Calendar className="w-3 h-3" />{date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-body font-medium text-accent border border-accent/30 bg-accent/10 rounded-full px-2.5 py-0.5 group-hover:bg-accent/20 transition-smooth">
            Read <ChevronRight className="w-3 h-3" />
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-smooth sm:hidden" />
        </div>
      </Link>
    </motion.div>
  );
}

export function ComicDetailPage() {
  const { comicId } = useParams({ from: "/comics/$comicId" });
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    supabase.rpc("increment_view_count", { comic_id: comicId }).then(({ error }) => { if (error) console.error("View count error:", error); });
  }, [comicId]);

  useEffect(() => {
    supabase.from("comics").select("like_count").eq("id", comicId).single().then(({ data }) => { if (data) setLikeCount(data.like_count ?? 0); });
    supabase.from("likes").select("id").eq("comic_id", comicId).then(({ data }) => { if (data && data.length > 0) setLiked(true); });
    supabase.from("bookmarks").select("id").eq("comic_id", comicId).then(({ data }) => { if (data && data.length > 0) setBookmarked(true); });
  }, [comicId]);

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.rpc("toggle_like", { p_comic_id: comicId });
    if (data) { setLiked(data.liked); setLikeCount(prev => data.liked ? prev + 1 : prev - 1); }
  };

  const handleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("comic_id", comicId).eq("user_id", user.id);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ comic_id: comicId, user_id: user.id });
      setBookmarked(true);
    }
  };

  const handleReport = async () => {
    if (!reportReason) { toast.error("Please select a reason"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login to report"); return; }
    setIsReporting(true);
    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      comic_id: comicId,
      reason: reportReason,
      details: reportDetails.trim() || null,
    });
    setIsReporting(false);
    if (error) { toast.error("Failed to submit report"); return; }
    toast.success("Report submitted! We will review it shortly.");
    setShowReportModal(false);
    setReportReason("");
    setReportDetails("");
  };

  const { data: comic, isLoading: comicLoading, isError: comicError, refetch: refetchComic } = useComic(comicId);
  const { data: chapters, isLoading: chaptersLoading, isError: chaptersError, refetch: refetchChapters } = useChapters(comicId);
  const { data: progress } = useReadProgress(undefined, comicId);

  const publishedChapters = (chapters ?? []).filter((ch) => ch.is_published).sort((a, b) => a.chapter_number - b.chapter_number);
  const firstChapter = publishedChapters[0];

  if (comicError) {
    return <div className="max-w-5xl mx-auto px-4 py-16"><ErrorFallback message="Failed to load comic." onRetry={() => refetchComic()} /></div>;
  }

  return (
    <div className="bg-background min-h-screen" data-ocid="comic_detail.page">
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
        {!comicLoading && comic?.cover_url && (
          <div className="absolute inset-0 opacity-15 blur-2xl scale-110" style={{ backgroundImage: `url(${comic.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-8 font-body group" data-ocid="comic_detail.back_link">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-smooth" />Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
            {comicLoading ? (
              <Skeleton className="w-44 h-64 sm:w-52 sm:h-72 rounded-xl flex-shrink-0 bg-muted" />
            ) : comic ? (
              <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex-shrink-0">
                {comic.cover_url ? (
                  <img src={comic.cover_url} alt={comic.title} className="w-44 sm:w-52 h-auto rounded-xl shadow-manga object-cover" />
                ) : (
                  <div className="w-44 sm:w-52 aspect-[9/14] rounded-xl bg-muted/60 border border-border flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ) : null}

            <div className="flex flex-col justify-end gap-4 min-w-0">
              {comicLoading ? (
                <>
                  <Skeleton className="h-9 w-72 bg-muted" />
                  <Skeleton className="h-4 w-full max-w-sm bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                    <Skeleton className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                </>
              ) : comic ? (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col gap-3">
                  <h1 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
                    {comic.title}
                    {(comic as any).is_ai_generated && (
                      <span style={{ display: "inline-block", marginLeft: "10px", padding: "3px 10px", borderRadius: "6px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 800, letterSpacing: "1px", verticalAlign: "middle" }}>AI</span>
                    )}
                  </h1>
                  <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed">{comic.description}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge className="bg-accent/15 text-accent border border-accent/30 font-body inline-flex items-center gap-1">
                      <Layers className="w-3 h-3" />{publishedChapters.length} Chapter{publishedChapters.length !== 1 ? "s" : ""}
                    </Badge>
                    <Badge className="bg-muted text-muted-foreground border border-border font-body inline-flex items-center gap-1">
                      <User className="w-3 h-3" />{comic.author_name ?? comic.creator_id?.slice(0, 10)}…
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <button type="button" onClick={handleBookmark} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "10px", border: bookmarked ? "1px solid rgba(250,204,21,0.5)" : "1px solid rgba(255,255,255,0.15)", background: bookmarked ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.05)", color: bookmarked ? "#facc15" : "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                      <span style={{ fontSize: "18px" }}>🔖</span>{bookmarked ? "Saved" : "Save"}
                    </button>
                    <button type="button" onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "10px", border: liked ? "1px solid rgba(255,50,50,0.5)" : "1px solid rgba(255,255,255,0.15)", background: liked ? "rgba(255,50,50,0.15)" : "rgba(255,255,255,0.05)", color: liked ? "#ff3232" : "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                      <span style={{ fontSize: "18px" }}>{liked ? "❤️" : "🤍"}</span>{likeCount}
                    </button>
                    <button type="button" onClick={() => setShowReportModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.7)", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                      Report
                    </button>
                    {progress?.last_chapter_id && (
                      <Button asChild size="lg" variant="outline" className="w-fit border-accent/50 text-accent hover:bg-accent/10 font-body font-semibold" data-ocid="comic_detail.continue_button">
                        <Link to="/comics/$comicId/chapters/$chapterId" params={{ comicId, chapterId: progress.last_chapter_id }}>
                          <BookOpen className="w-5 h-5 mr-2" />Continue Reading →
                        </Link>
                      </Button>
                    )}
                    {firstChapter && (
                      <Button asChild size="lg" className="w-fit bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold shadow-manga" data-ocid="comic_detail.read_button">
                        <Link to="/comics/$comicId/chapters/$chapterId" params={{ comicId, chapterId: firstChapter.id }}>
                          <BookOpen className="w-5 h-5 mr-2" />Start Reading
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 16px" }}>
        <Comments comicId={comicId} creatorId={comic?.creator_id} />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-ocid="comic_detail.chapters_section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-accent" />
            <h2 className="font-display text-3xl text-foreground">Chapters</h2>
            {!chaptersLoading && <span className="ml-1 text-sm text-muted-foreground font-body">({publishedChapters.length})</span>}
          </div>
        </div>

        {chaptersLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <Skeleton className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-3 w-1/4 bg-muted" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        )}

        {chaptersError && <ErrorFallback message="Failed to load chapters." onRetry={() => refetchChapters()} />}

        {!chaptersLoading && !chaptersError && publishedChapters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4" data-ocid="comic_detail.empty_state">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center">
              <Lock className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-body font-semibold">No chapters yet</p>
              <p className="text-muted-foreground font-body text-sm mt-1">The creator hasn&apos;t published any chapters yet. Check back soon!</p>
            </div>
          </div>
        )}

        {!chaptersLoading && !chaptersError && publishedChapters.length > 0 && (
          <div className="flex flex-col gap-2">
            {publishedChapters.map((ch, i) => <ChapterRow key={ch.id} chapter={ch} comicId={comicId} index={i} />)}
          </div>
        )}
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", padding: "16px", boxSizing: "border-box" }}>
          <div style={{ background: "#0f0f0f", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "400px", boxSizing: "border-box" }}>
            <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>Report Comic</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {REPORT_REASONS.map(reason => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setReportReason(reason)}
                  style={{
                    padding: "10px 14px", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontSize: "13px", fontWeight: 600, border: "none",
                    background: reportReason === reason ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                    color: reportReason === reason ? "#a78bfa" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Additional details (optional)..."
              rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.2)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "none", marginBottom: "16px" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                Cancel
              </button>
              <button type="button" onClick={handleReport} disabled={isReporting || !reportReason} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: isReporting || !reportReason ? 0.5 : 1 }}>
                {isReporting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }
