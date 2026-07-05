import { ErrorFallback } from "@/components/ErrorFallback";
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
  AlertTriangle,
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
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05, duration: 0.3 }} 
      data-ocid={`comic_detail.chapters.item.${index + 1}`}
      style={{ boxSizing: 'border-box' }}
    >
      <Link
        to="/comics/$comicId/chapters/$chapterId"
        params={{ comicId, chapterId: chapter.id }}
        data-ocid={`comic_detail.chapter_read_link.${index + 1}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          padding: '14px 16px',
          borderRadius: '0px',
          backgroundColor: '#ffffff',
          border: '2px solid #111111',
          boxShadow: '2px 2px 0px #111111',
          textDecoration: 'none',
          color: '#111111',
          boxSizing: 'border-box',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '4px 4px 0px #111111';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '2px 2px 0px #111111';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '0', width: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '0', boxSizing: 'border-box' }}>
            {/* Number Box */}
            <div style={{
              flexShrink: 0,
              width: '36px',
              height: '36px',
              backgroundColor: '#fbbf24',
              border: '2px solid #111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace, sans-serif',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#111111',
              boxSizing: 'border-box'
            }}>
              {chapter.chapter_number}
            </div>
            {/* Title Text */}
            <div style={{ minWidth: '0', boxSizing: 'border-box' }}>
              <p style={{
                margin: '0',
                fontFamily: 'serif',
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#111111',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}>
                {chapter.title ?? `Chapter ${chapter.chapter_number}`}
              </p>
              <p style={{
                margin: '4px 0 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'monospace, sans-serif',
                color: '#555555',
                textTransform: 'uppercase',
                boxSizing: 'border-box'
              }}>
                <Calendar style={{ width: '12px', height: '12px' }} /> {date}
              </p>
            </div>
          </div>

          {/* Action Trigger Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, boxSizing: 'border-box' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontFamily: 'monospace, sans-serif',
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#111111',
              border: '2px solid #111111',
              backgroundColor: '#f5f0e8',
              padding: '4px 10px',
              boxSizing: 'border-box'
            }}>
              READ <ChevronRight style={{ width: '12px', height: '12px' }} />
            </span>
          </div>
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
    if (!user) { toast.error("Please login to like"); return; }
    const { data } = await supabase.rpc("toggle_like", { p_comic_id: comicId });
    if (data) { setLiked(data.liked); setLikeCount(prev => data.liked ? prev + 1 : prev - 1); }
  };

  const handleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login to bookmark"); return; }
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("comic_id", comicId).eq("user_id", user.id);
      setBookmarked(false);
      toast.success("Removed bookmark");
    } else {
      await supabase.from("bookmarks").insert({ comic_id: comicId, user_id: user.id });
      setBookmarked(true);
      toast.success("Saved bookmark!");
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
    return (
      <div style={{ backgroundColor: '#f5f0e8', minHeight: '100vh', padding: '64px 16px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
          <ErrorFallback message="Failed to load comic." onRetry={() => refetchComic()} />
        </div>
      </div>
    );
  }

  return (
    <div 
      data-ocid="comic_detail.page"
      style={{
        backgroundColor: '#f5f0e8',
        backgroundImage: 'radial-gradient(#fbbf24 1.2px, transparent 1.2px)',
        backgroundSize: '12px 12px',
        minHeight: '100vh',
        width: '100%',
        color: '#111111',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Banner Cover Hero Block */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '4px solid #111111',
        padding: '32px 16px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          {/* Back Button */}
          <Link 
            to="/" 
            data-ocid="comic_detail.back_link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'monospace, sans-serif',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#111111',
              marginBottom: '24px',
              width: 'fit-content',
              boxSizing: 'border-box'
            }}
          >
            <ChevronLeft style={{ width: '14px', height: '14px' }} /> Back to Home
          </Link>

          {/* Main Showcase Panel Layout */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box'
          }} className="sm:flex-row">
            {/* Left Column: Image Canvas Frame */}
            {comicLoading ? (
              <div style={{ width: '176px', aspectRatio: '9/14', backgroundColor: 'rgba(17, 17, 17, 0.08)', border: '2px solid #111111', boxSizing: 'border-box' }}>
                <Skeleton className="w-full h-full" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
              </div>
            ) : comic ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 12 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ duration: 0.35 }}
                style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}
              >
                <div style={{
                  position: 'relative',
                  width: '176px',
                  aspectRatio: '9/14',
                  backgroundColor: '#111111',
                  border: '3px solid #111111',
                  boxShadow: '4px 4px 0px #111111',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  {comic.cover_url ? (
                    <img 
                      src={comic.cover_url} 
                      alt={comic.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', boxSizing: 'border-box' }} 
                    />
                  ) : (
                    <BookOpen style={{ width: '40px', height: '40px', color: '#fbbf24' }} />
                  )}
                </div>
              </motion.div>
            ) : null}

            {/* Right Column: Title and Narrative Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: '0', justifyContent: 'space-between', boxSizing: 'border-box' }}>
              {comicLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' }}>
                  <Skeleton className="h-8 w-64" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
                  <Skeleton className="h-4 w-full" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
                  <Skeleton className="h-4 w-5/6" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
                </div>
              ) : comic ? (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.35, delay: 0.05 }}
                  style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}
                >
                  {/* Title and Badges */}
                  <h1 style={{
                    fontFamily: 'serif',
                    fontSize: '28px',
                    fontWeight: '900',
                    color: '#111111',
                    margin: '0 0 12px 0',
                    lineHeight: '1.2',
                    boxSizing: 'border-box'
                  }}>
                    {comic.title}
                    {(comic as any).is_ai_generated && (
                      <span style={{
                        display: 'inline-block',
                        marginLeft: '12px',
                        padding: '2px 8px',
                        backgroundColor: '#111111',
                        border: '1px solid #ffffff',
                        color: '#fbbf24',
                        fontFamily: 'monospace, sans-serif',
                        fontSize: '11px',
                        fontWeight: '900',
                        letterSpacing: '1px',
                        verticalAlign: 'middle',
                        boxSizing: 'border-box'
                      }}>
                        AI
                      </span>
                    )}
                  </h1>

                  {/* Prose Description */}
                  <p style={{
                    margin: '0 0 16px 0',
                    fontFamily: 'serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#333333',
                    maxWidth: '650px',
                    boxSizing: 'border-box'
                  }}>
                    {comic.description}
                  </p>

                  {/* Metadata Indicators */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', boxSizing: 'border-box' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace, sans-serif',
                      fontWeight: 'bold',
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      padding: '4px 10px',
                      boxSizing: 'border-box'
                    }}>
                      <Layers style={{ width: '12px', height: '12px', color: '#fbbf24' }} /> {publishedChapters.length} CHAPTER{publishedChapters.length !== 1 ? "S" : ""}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace, sans-serif',
                      fontWeight: 'bold',
                      backgroundColor: '#f5f0e8',
                      color: '#111111',
                      border: '2px solid #111111',
                      padding: '2px 8px',
                      boxSizing: 'border-box'
                    }}>
                      <User style={{ width: '12px', height: '12px' }} /> CREATOR: {comic.author_name ?? comic.creator_id?.slice(0, 10)}…
                    </span>
                  </div>

                  {/* Operational Interactive Action Row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', boxSizing: 'border-box' }}>
                    
                    {/* Read Action Triggers Primary Focus */}
                    {progress?.last_chapter_id && (
                      <Link 
                        to="/comics/$comicId/chapters/$chapterId" 
                        params={{ comicId, chapterId: progress.last_chapter_id }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          backgroundColor: '#fbbf24',
                          color: '#111111',
                          fontFamily: 'monospace, sans-serif',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          border: '2px solid #111111',
                          boxShadow: '3px 3px 0px #111111',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <BookOpen style={{ width: '16px', height: '16px' }} /> Continue Reading →
                      </Link>
                    )}

                    {firstChapter && !progress?.last_chapter_id && (
                      <Link 
                        to="/comics/$comicId/chapters/$chapterId" 
                        params={{ comicId, chapterId: firstChapter.id }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          backgroundColor: '#cc0000',
                          color: '#ffffff',
                          fontFamily: 'monospace, sans-serif',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          border: '2px solid #111111',
                          boxShadow: '3px 3px 0px #111111',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <BookOpen style={{ width: '16px', height: '16px' }} /> Start Reading
                      </Link>
                    )}

                    {/* Bookmark Toggle Block Button */}
                    <button 
                      type="button" 
                      onClick={handleBookmark} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        padding: "10px 14px", 
                        borderRadius: "0px", 
                        border: "2px solid #111111", 
                        background: bookmarked ? "#fbbf24" : "#ffffff", 
                        color: "#111111", 
                        fontFamily: 'monospace, sans-serif',
                        fontSize: "12px", 
                        fontWeight: 900, 
                        textTransform: 'uppercase',
                        cursor: "pointer",
                        boxShadow: '2px 2px 0px #111111',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>🔖</span>{bookmarked ? "Saved" : "Save"}
                    </button>

                    {/* Like Core Core Interaction Button */}
                    <button 
                      type="button" 
                      onClick={handleLike} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        padding: "10px 14px", 
                        borderRadius: "0px", 
                        border: "2px solid #111111", 
                        background: liked ? "#ffffff" : "#ffffff", 
                        color: "#111111", 
                        fontFamily: 'monospace, sans-serif',
                        fontSize: "12px", 
                        fontWeight: 900, 
                        textTransform: 'uppercase',
                        cursor: "pointer",
                        boxShadow: '2px 2px 0px #111111',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>{liked ? "❤️" : "🤍"}</span>{likeCount}
                    </button>

                    {/* Report Alert Button Block */}
                    <button 
                      type="button" 
                      onClick={() => setShowReportModal(true)} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px", 
                        padding: "10px 14px", 
                        borderRadius: "0px", 
                        border: "2px solid #111111", 
                        background: "#ffffff", 
                        color: "#cc0000", 
                        fontFamily: 'monospace, sans-serif',
                        fontSize: "12px", 
                        fontWeight: 900, 
                        textTransform: 'uppercase',
                        cursor: "pointer",
                        boxShadow: '2px 2px 0px #111111',
                        boxSizing: 'border-box'
                      }}
                    >
                      <AlertTriangle style={{ width: '12px', height: '12px' }} /> Report
                    </button>

                  </div>
                </motion.div>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* Chapters Index Listing Main Canvas Layout Frame */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px', boxSizing: 'border-box' }} data-ocid="comic_detail.chapters_section">
        {/* Newspaper Style Block Section Header Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}>
              <Layers style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
            </div>
            <h2 style={{
              fontFamily: 'monospace, sans-serif',
              fontSize: '22px',
              fontWeight: '900',
              textTransform: 'uppercase',
              margin: '0',
              color: '#111111'
            }}>
              Chapters Grid
            </h2>
            {!chaptersLoading && (
              <span style={{ fontFamily: 'monospace, sans-serif', fontSize: '13px', fontWeight: 'bold', color: '#555555' }}>
                ({publishedChapters.length})
              </span>
            )}
          </div>
          <div style={{ marginTop: '12px', width: '100%', height: '3px', backgroundColor: '#111111', boxSizing: 'border-box' }} />
        </div>

        {/* Loading Framework States Skeletons */}
        {chaptersLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#ffffff', border: '2px solid #111111', boxSizing: 'border-box' }}>
                <Skeleton className="w-8 h-8" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Skeleton className="h-4 w-1/3" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
                  <Skeleton className="h-3 w-1/4" style={{ borderRadius: 0, backgroundColor: 'rgba(17, 17, 17, 0.1)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {chaptersError && <ErrorFallback message="Failed to load chapters." onRetry={() => refetchChapters()} />}

        {/* Blank State Canvas Wrapper */}
        {!chaptersLoading && !chaptersError && publishedChapters.length === 0 && (
          <div 
            data-ocid="comic_detail.empty_state"
            style={{
              textAlign: 'center',
              padding: '48px 16px',
              backgroundColor: '#ffffff',
              border: '2px solid #111111',
              boxShadow: '3px 3px 0px #111111',
              maxWidth: '450px',
              margin: '24px auto',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ width: '48px', height: '48px', backgroundColor: '#f5f0e8', border: '2px solid #111111', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 16px auto' }}>
              <Lock style={{ width: '20px', height: '20px', color: '#cc0000', margin: '0 auto' }} />
            </div>
            <p style={{ fontFamily: 'monospace, sans-serif', fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px 0' }}>No chapters yet</p>
            <p style={{ fontFamily: 'serif', fontSize: '13px', color: '#555555', margin: '0' }}>The creator hasn't published any chapters yet. Check back soon!</p>
          </div>
        )}

        {/* Population Grid Index Row Mapping Container */}
        {!chaptersLoading && !chaptersError && publishedChapters.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
            {publishedChapters.map((ch, i) => <ChapterRow key={ch.id} chapter={ch} comicId={comicId} index={i} />)}
          </div>
        )}
      </section>

      {/* Interactive Core Public Comments Canvas Panel Block Container */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 48px auto', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '2px solid #111111', 
          boxShadow: '4px 4px 0px #111111', 
          padding: '20px 16px', 
          boxSizing: 'border-box' 
        }}>
          <Comments comicId={comicId} creatorId={comic?.creator_id} />
        </div>
      </section>

      {/* System Framework Report Abuse Modal Overlay Panel Box */}
      {showReportModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,17,17,0.75)", backdropFilter: "blur(2px)", padding: "16px", boxSizing: "border-box" }}>
          <div style={{ 
            background: "#ffffff", 
            border: "3px solid #111111", 
            boxShadow: '6px 6px 0px #111111',
            padding: "24px", 
            width: "100%", 
            maxWidth: "420px", 
            boxSizing: "border-box",
            borderRadius: '0px'
          }}>
            <h3 style={{ color: "#111111", fontFamily: 'monospace, sans-serif', textTransform: 'uppercase', fontSize: "18px", fontWeight: 900, margin: '0 0 16px 0', borderBottom: '2px solid #111111', paddingBottom: '8px' }}>
              Report Comic Content
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", boxSizing: 'border-box' }}>
              {REPORT_REASONS.map(reason => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setReportReason(reason)}
                  style={{
                    padding: "10px 12px", 
                    borderRadius: "0px", 
                    textAlign: "left", 
                    cursor: "pointer", 
                    fontSize: "12px", 
                    fontFamily: 'serif',
                    fontWeight: reportReason === reason ? "bold" : "normal", 
                    border: "2px solid #111111",
                    background: reportReason === reason ? "#fbbf24" : "#f5f0e8",
                    color: "#111111",
                    boxShadow: reportReason === reason ? '1px 1px 0px #111111' : 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Provide clear additional contextual documentation details (optional)..."
              rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "0px", background: "#ffffff", border: "2px solid #111111", color: "#111111", fontFamily: 'serif', fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "none", marginBottom: "16px" }}
            />

            <div style={{ display: "flex", gap: "12px", boxSizing: 'border-box' }}>
              <button 
                type="button" 
                onClick={() => setShowReportModal(false)} 
                style={{ flex: 1, padding: "10px", borderRadius: "0px", background: "#ffffff", border: "2px solid #111111", color: "#111111", fontFamily: 'monospace, sans-serif', fontWeight: 'bold', textTransform: 'uppercase', cursor: "pointer", boxSizing: 'border-box' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleReport} 
                disabled={isReporting || !reportReason} 
                style={{ 
                  flex: 1, 
                  padding: "10px", 
                  borderRadius: "0px", 
                  background: "#cc0000", 
                  border: "2px solid #111111", 
                  color: "#ffffff", 
                  fontFamily: 'monospace, sans-serif', 
                  fontWeight: 900, 
                  textTransform: 'uppercase',
                  cursor: "pointer", 
                  opacity: isReporting || !reportReason ? 0.5 : 1,
                  boxSizing: 'border-box'
                }}
              >
                {isReporting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
                    }
         
