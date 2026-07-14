import { AdBanner } from "@/components/AdBanner";
import { AuthModal } from "@/components/AuthModal";
import { Comments } from "@/components/Comments";
import { useAuth } from "@/hooks/useAuth";
import { useChapters } from "@/hooks/useChapters";
import { getChapterWithPages } from "@/services/chaptersService";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const paperTexture = {
  background: "#f5f0e8",
  backgroundImage: `
    radial-gradient(circle, #00000008 1px, transparent 1px)
  `,
  backgroundSize: "24px 24px",
};

const globalStyles = `
  * { box-sizing: border-box; }
  @keyframes pageFlip {
    0% { opacity: 0; transform: translateY(20px) rotateX(5deg); }
    100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
  }
  @keyframes stampIn {
    0% { opacity: 0; transform: scale(1.5) rotate(-10deg); }
    60% { transform: scale(0.95) rotate(2deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes speedLines {
    0% { opacity: 0; }
    50% { opacity: 0.3; }
    100% { opacity: 0; }
  }
  .page-image {
    animation: pageFlip 0.4s ease forwards;
  }
`;

export function ReaderPage() {
  const { comicId, chapterId } = useParams({
    from: "/comics/$comicId/chapters/$chapterId",
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginWall, setShowLoginWall] = useState(false);
  const [chapter, setChapter] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const lastScrollY = useRef(0);
  const { data: chapters = [] } = useChapters(comicId);

  useEffect(() => {
    setLoading(true);
    getChapterWithPages(chapterId).then((ch) => {
      if (ch) {
        setChapter(ch);
        setImageUrls((ch.pages ?? []).map((p: any) => p.image_url));
      }
      setLoading(false);
    });
    supabase.rpc("increment_view_count", { comic_id: comicId }).catch(() => {});
  }, [chapterId, comicId]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHeaderVisible(currentY < lastScrollY.current || currentY < 80);
      setShowScrollBtn(currentY > 300);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedChapters = [...chapters].sort(
    (a, b) => a.chapter_number - b.chapter_number,
  );
  const currentIndex = sortedChapters.findIndex((c) => c.id === chapterId);
  const prevChapter = sortedChapters[currentIndex - 1];
  const nextChapter = sortedChapters[currentIndex + 1];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", ...paperTexture, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px", height: "60px", border: "4px solid #111",
            borderTop: "4px solid #cc0000", borderRadius: "50%",
            animation: "spin 1s linear infinite", margin: "0 auto 16px",
          }} />
          <p style={{ color: "#111", fontFamily: "monospace", fontWeight: 900, fontSize: "13px", letterSpacing: "2px" }}>
            LOADING...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } ${globalStyles}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", ...paperTexture }}>
      <style>{globalStyles}</style>

      {/* Fixed Header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#111",
        borderBottom: "3px solid #cc0000",
        padding: "10px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease",
        boxSizing: "border-box",
      }}>
        {/* Yellow screentone overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          pointerEvents: "none",
        }} />

        <Link
          to="/comics/$comicId"
          params={{ comicId }}
          style={{ color: "#fff", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontFamily: "monospace", fontSize: "13px", fontWeight: 700 }}
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
          Back
        </Link>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#cc0000", fontSize: "10px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "2px", margin: 0, textTransform: "uppercase" }}>
            Chapter {chapter?.chapter_number}
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontFamily: "serif", margin: 0, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {chapter?.title}{chapter?.subtitle ? ` — ${chapter.subtitle}` : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {prevChapter && (
            <button
              type="button"
              onClick={() => navigate({ to: "/comics/$comicId/chapters/$chapterId", params: { comicId, chapterId: prevChapter.id } })}
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}
            >
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </button>
          )}
          {nextChapter && (
            <button
              type="button"
              onClick={() => navigate({ to: "/comics/$comicId/chapters/$chapterId", params: { comicId, chapterId: nextChapter.id } })}
              style={{ background: "#cc0000", border: "2px solid #fff", color: "#fff", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}
            >
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
      </div>

      {/* Pages */}
      <main style={{ paddingTop: "56px", paddingBottom: "80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {imageUrls.map((url, i) => (
          <div
            key={url}
            id={`page-${i}`}
            style={{ width: "100%", maxWidth: "800px", position: "relative" }}
          >
            <img
              src={url}
              alt={`Page ${i + 1}`}
              className="page-image"
              style={{
                width: "100%",
                display: "block",
                objectFit: "contain",
                filter: !user && i > 0 ? "blur(8px)" : "none",
                animationDelay: `${i * 0.05}s`,
              }}
              loading={i < 3 ? "eager" : "lazy"}
            />

            {/* Login wall after page 1 */}
            {!user && i === 1 && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "rgba(245,240,232,0.9)",
                zIndex: 10, padding: "24px",
              }}>
                {/* Stamp animation */}
                <div style={{
                  padding: "12px 24px",
                  border: "4px solid #cc0000",
                  color: "#cc0000",
                  fontFamily: "monospace",
                  fontWeight: 900,
                  fontSize: "20px",
                  letterSpacing: "2px",
                  marginBottom: "16px",
                  animation: "stampIn 0.5s ease forwards",
                  transform: "rotate(-3deg)",
                }}>
                  MEMBERS ONLY
                </div>
                <p style={{ color: "#111", fontSize: "14px", fontFamily: "serif", marginBottom: "20px", textAlign: "center" }}>
                  Create a free account to continue reading
                </p>
                <button
                  type="button"
                  onClick={() => setShowLoginWall(true)}
                  style={{
                    padding: "12px 28px",
                    background: "#111",
                    border: "3px solid #cc0000",
                    color: "#fff",
                    fontFamily: "monospace",
                    fontWeight: 900,
                    fontSize: "14px",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}

            {/* Ad in middle */}
            {i === Math.floor(imageUrls.length / 2) - 1 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "16px 0", background: "#f5f0e8", borderTop: "2px solid #111", borderBottom: "2px solid #111" }}>
                <AdBanner adKey="fb37617b5e2f1213963184b0b6221dee" width={300} height={250} />
              </div>
            )}


        {/* Chapter navigation */}
        <div style={{ width: "100%", maxWidth: "800px", padding: "24px 16px", borderTop: "3px solid #111", display: "flex", gap: "12px", background: "#f5f0e8" }}>
          {prevChapter && (
            <button
              type="button"
              onClick={() => navigate({ to: "/comics/$comicId/chapters/$chapterId", params: { comicId, chapterId: prevChapter.id } })}
              style={{ flex: 1, padding: "12px", background: "#fff", border: "2px solid #111", color: "#111", fontFamily: "monospace", fontWeight: 700, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111" }}
            >
              Prev Chapter
            </button>
          )}
          {nextChapter && (
            <button
              type="button"
              onClick={() => navigate({ to: "/comics/$comicId/chapters/$chapterId", params: { comicId, chapterId: nextChapter.id } })}
              style={{ flex: 1, padding: "12px", background: "#cc0000", border: "2px solid #111", color: "#fff", fontFamily: "monospace", fontWeight: 900, fontSize: "13px", cursor: "pointer", boxShadow: "3px 3px 0px #111" }}
            >
              Next Chapter
            </button>
          )}
        </div>

        {/* Comments */}
        <div style={{ width: "100%", maxWidth: "800px", padding: "0 16px 40px" }}>
          <Comments comicId={comicId} chapterId={chapterId} />
        </div>

      {/* Scroll down button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
            style={{
              position: "fixed", bottom: "24px", right: "20px", zIndex: 40,
              width: "44px", height: "44px",
              background: "#111",
              border: "3px solid #cc0000",
              color: "#fff",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "3px 3px 0px #cc0000",
            }}
          >
            <ChevronDown style={{ width: 20, height: 20 }} />
          </motion.button>
        )}
      </AnimatePresence>

      {showLoginWall && (
        <AuthModal open={showLoginWall} onClose={() => setShowLoginWall(false)} />
      )}
    </div>
  );
}
