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
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
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

  if (loading) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
        <div style={{
          padding: "24px 48px", backgroundColor: "#ffffff",
          border: "4px solid #111111", boxShadow: "6px 6px 0px #111111", boxSizing: "border-box"
        }}>
          <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "16px", fontWeight: "900", textTransform: "uppercase", color: "#111111", letterSpacing: "1px" }}>
            Loading Chapter...
          </p>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
        <div style={{
          padding: "24px 48px", backgroundColor: "#ffffff",
          border: "4px solid #111111", boxShadow: "6px 6px 0px #111111", boxSizing: "border-box"
        }}>
          <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "16px", fontWeight: "900", textTransform: "uppercase", color: "#cc0000", letterSpacing: "1px" }}>
            Chapter Not Found.
          </p>
        </div>
      </div>
    );
  }

  // Brutalist Theme Configuration
  const isDark = darkMode;
  const colors = {
    bg: isDark ? "#111111" : "#f5f0e8",
    surface: isDark ? "#1a1a1a" : "#ffffff",
    border: isDark ? "#ffffff" : "#111111",
    text: isDark ? "#ffffff" : "#111111",
    textMuted: isDark ? "#a0a0a0" : "#555555",
    accent: "#fbbf24", // Yellow pops on both themes
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: colors.bg, 
      transition: "background-color 0.2s ease",
      boxSizing: "border-box" 
    }}>
      {/* Sticky Reader Command Header */}
      <div style={{
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        backgroundColor: colors.surface,
        borderBottom: `4px solid ${colors.border}`,
        padding: "12px 16px", 
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        transition: "all 0.2s ease"
      }}>
        <Link 
          to="/novels/$novelId" 
          params={{ novelId }} 
          style={{ 
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 12px",
            backgroundColor: colors.accent,
            border: `2px solid ${colors.border}`,
            color: "#111111", 
            fontFamily: "monospace, sans-serif",
            fontSize: "13px", 
            fontWeight: "900",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: `2px 2px 0px ${colors.border}`,
            boxSizing: "border-box"
          }}
        >
          ← Back
        </Link>
        
        <p style={{ 
          color: colors.text, 
          fontFamily: "monospace, sans-serif",
          fontSize: "13px", 
          fontWeight: "900", 
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          margin: 0,
          display: "none", // Hide on tiny screens
          boxSizing: "border-box"
        }} className="sm:block">
          Chapter {chapter.chapter_number}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", boxSizing: "border-box" }}>
          {/* Typography Control Blocks */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box" }}>
            <button 
              type="button" 
              onClick={() => setFontSize(f => Math.max(14, f - 2))}
              style={{ 
                backgroundColor: colors.surface, 
                border: `2px solid ${colors.border}`, 
                color: colors.text, 
                borderRadius: "0px", 
                width: "32px", 
                height: "32px", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer", 
                fontFamily: "monospace, sans-serif",
                fontSize: "14px", 
                fontWeight: "900",
                boxShadow: `2px 2px 0px ${colors.border}`,
                boxSizing: "border-box"
              }}
            >
              A-
            </button>
            <button 
              type="button" 
              onClick={() => setFontSize(f => Math.min(32, f + 2))}
              style={{ 
                backgroundColor: colors.surface, 
                border: `2px solid ${colors.border}`, 
                color: colors.text, 
                borderRadius: "0px", 
                width: "32px", 
                height: "32px", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer", 
                fontFamily: "monospace, sans-serif",
                fontSize: "14px", 
                fontWeight: "900",
                boxShadow: `2px 2px 0px ${colors.border}`,
                boxSizing: "border-box"
              }}
            >
              A+
            </button>
          </div>
          
          {/* Theme Toggle Trigger */}
          <button 
            type="button" 
            onClick={() => setDarkMode(d => !d)}
            style={{ 
              backgroundColor: isDark ? colors.surface : "#111111", 
              border: `2px solid ${colors.border}`, 
              color: isDark ? colors.text : "#ffffff", 
              borderRadius: "0px", 
              padding: "6px 12px", 
              cursor: "pointer", 
              fontFamily: "monospace, sans-serif",
              fontSize: "13px", 
              fontWeight: "900",
              textTransform: "uppercase",
              boxShadow: `2px 2px 0px ${colors.border}`,
              height: "32px",
              boxSizing: "border-box"
            }}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div style={{ 
        paddingTop: "64px", 
        paddingBottom: "80px", 
        maxWidth: "760px", 
        margin: "0 auto", 
        padding: "100px 20px 80px", 
        boxSizing: "border-box" 
      }}>
        
        {/* Chapter Title & Meta Header Panel */}
        <div style={{ marginBottom: "48px", boxSizing: "border-box" }}>
          <h1 style={{ 
            color: colors.text, 
            fontFamily: "serif",
            fontSize: "36px", 
            fontWeight: "900", 
            lineHeight: "1.2",
            margin: "0 0 16px 0",
            boxSizing: "border-box"
          }}>
            {chapter.title}
          </h1>
          
          {chapter.word_count > 0 && (
            <div style={{ 
              display: "inline-block", 
              backgroundColor: colors.border, 
              padding: "4px 10px",
              boxSizing: "border-box" 
            }}>
              <span style={{ 
                color: isDark ? "#111111" : "#ffffff", 
                fontFamily: "monospace, sans-serif", 
                fontWeight: "900", 
                fontSize: "11px", 
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {chapter.word_count} WORDS
              </span>
            </div>
          )}
        </div>

        {/* Text Content Block */}
        {chapter.content && (
          <div style={{ 
            color: colors.text, 
            fontFamily: "serif",
            fontSize: `${fontSize}px`, 
            lineHeight: 1.8, 
            marginBottom: "48px", 
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            boxSizing: "border-box" 
          }}>
            {chapter.content}
          </div>
        )}

        {/* Sequential Image Comic Strip Panel */}
        {images.length > 0 && (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "0",
            border: `4px solid ${colors.border}`,
            backgroundColor: colors.surface,
            boxShadow: `6px 6px 0px ${colors.border}`,
            boxSizing: "border-box"
          }}>
            {images.map((img) => (
              <img 
                key={img.id} 
                src={img.image_url} 
                alt={`Page ${img.page_number}`}
                style={{ 
                  width: "100%", 
                  display: "block", 
                  objectFit: "contain",
                  boxSizing: "border-box"
                }} 
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Footer Navigation Action */}
        <div style={{ marginTop: "64px", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
          <Link 
            to="/novels/$novelId" 
            params={{ novelId }}
            style={{ 
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 32px", 
              borderRadius: "0px", 
              backgroundColor: colors.accent, 
              color: "#111111", 
              textDecoration: "none", 
              fontFamily: "monospace, sans-serif",
              fontWeight: "900", 
              fontSize: "15px",
              textTransform: "uppercase",
              border: `4px solid ${colors.border}`,
              boxShadow: `4px 4px 0px ${colors.border}`,
              boxSizing: "border-box",
              transition: "transform 0.1s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = `2px 2px 0px ${colors.border}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `4px 4px 0px ${colors.border}`;
            }}
          >
            ← Back to Novel
          </Link>
        </div>
      </div>
      <style>{`
        * { box-sizing: border-box; }
        @media (min-width: 640px) {
          .sm\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
              }
