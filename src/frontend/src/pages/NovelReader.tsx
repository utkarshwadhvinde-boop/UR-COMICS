import { supabase } from "@/lib/supabase";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface NovelChapter {
  id: string;
  novel_id: string;
  chapter_number: number;
  title: string;
  content: string | null;
  word_count: number;
}

interface ChapterImage {
  id: string;
  image_url: string;
  page_number: number;
}

export function NovelReaderPage() {
  const { novelId, chapterId } = useParams({ from: "/novels/$novelId/chapters/$chapterId" });
  const [chapter, setChapter] = useState<NovelChapter | null>(null);
  const [images, setImages] = useState<ChapterImage[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("novel_chapters").select("*").eq("id", chapterId).single(),
      supabase.from("novel_chapter_images").select("*").eq("chapter_id", chapterId).order("page_number", { ascending: true }),
    ]).then(([{ data: chapterData }, { data: imagesData }]) => {
      setChapter(chapterData);
      setImages(imagesData ?? []);
      setLoading(false);
    });
  }, [chapterId]);

  if (loading) return <p style={{ color: "rgba(255,255,255,0.4)", padding: "24px" }}>Loading...</p>;
  if (!chapter) return <p style={{ color: "rgba(255,255,255,0.4)", padding: "24px" }}>Chapter not found.</p>;

  const bg = darkMode ? "#0f0f0f" : "#f5f5f0";
  const textColor = darkMode ? "rgba(255,255,255,0.85)" : "#1a1a1a";
  const headerBg = darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";

  return (
    <div style={{ minHeight: "100vh", background: bg, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: headerBg, backdropFilter: "blur(10px)",
        padding: "12px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid rgba(124,58,237,0.2)",
        boxSizing: "border-box",
      }}>
        <Link to="/novels/$novelId" params={{ novelId }} style={{ color: "#8b5cf6", fontSize: "14px", textDecoration: "none", fontWeight: 700 }}>
          Back
        </Link>
        <p style={{ color: textColor, fontSize: "13px", fontWeight: 700, margin: 0 }}>
          Chapter {chapter.chapter_number}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Font size */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button type="button" onClick={() => setFontSize(f => Math.max(12, f - 2))}
              style={{ background: "rgba(124,58,237,0.2)", border: "none", color: "#8b5cf6", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px", fontWeight: 700 }}>
              A-
            </button>
            <button type="button" onClick={() => setFontSize(f => Math.min(24, f + 2))}
              style={{ background: "rgba(124,58,237,0.2)", border: "none", color: "#8b5cf6", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px", fontWeight: 700 }}>
              A+
            </button>
          </div>
          {/* Dark/Light mode */}
          <button type="button" onClick={() => setDarkMode(d => !d)}
            style={{ background: "rgba(124,58,237,0.2)", border: "none", color: "#8b5cf6", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: "64px", paddingBottom: "48px", maxWidth: "680px", margin: "0 auto", padding: "80px 20px 48px", boxSizing: "border-box" }}>
        <h2 style={{ color: textColor, fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>
          {chapter.title}
        </h2>
        {chapter.word_count > 0 && (
          <p style={{ color: "rgba(124,58,237,0.7)", fontSize: "12px", marginBottom: "24px" }}>
            {chapter.word_count} words
          </p>
        )}

        {/* Text content */}
        {chapter.content && (
          <div style={{ color: textColor, fontSize: `${fontSize}px`, lineHeight: 1.8, marginBottom: "32px", whiteSpace: "pre-wrap" }}>
            {chapter.content}
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {images.map((img) => (
              <img key={img.id} src={img.image_url} alt={`Page ${img.page_number}`}
                style={{ width: "100%", display: "block", objectFit: "contain" }} />
            ))}
          </div>
        )}

        {/* Back to novel */}
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <Link to="/novels/$novelId" params={{ novelId }}
            style={{ padding: "12px 28px", borderRadius: "12px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
            Back to Novel
          </Link>
        </div>
      </div>
    </div>
  );
                       }
