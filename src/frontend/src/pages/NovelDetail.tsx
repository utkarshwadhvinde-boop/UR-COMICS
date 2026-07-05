import { supabase } from "@/lib/supabase";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Novel {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  status: string;
}

interface NovelChapter {
  id: string;
  chapter_number: number;
  title: string;
  word_count: number;
  is_published: boolean;
  created_at: string;
}

export function NovelDetailPage() {
  const { novelId } = useParams({ from: "/novels/$novelId" });
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("novels").select("*").eq("id", novelId).single(),
      supabase.from("novel_chapters").select("*").eq("novel_id", novelId).eq("is_published", true).order("chapter_number", { ascending: true }),
    ]).then(([{ data: novelData }, { data: chaptersData }]) => {
      setNovel(novelData);
      setChapters(chaptersData ?? []);
      setLoading(false);
    });
  }, [novelId]);

  if (loading) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", padding: "32px 16px", boxSizing: "border-box" }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", padding: "24px", backgroundColor: "#ffffff",
          border: "2px solid #111111", boxShadow: "4px 4px 0px #111111", boxSizing: "border-box"
        }}>
          <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: "#111111" }}>
            Loading novel resources...
          </p>
        </div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", padding: "32px 16px", boxSizing: "border-box" }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", padding: "24px", backgroundColor: "#ffffff",
          border: "2px solid #111111", boxShadow: "4px 4px 0px #111111", boxSizing: "border-box"
        }}>
          <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: "#cc0000" }}>
            Error: Novel reference not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        backgroundColor: "#f5f0e8", 
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        minHeight: "100vh", 
        padding: "32px 16px 80px 16px", 
        boxSizing: "border-box" 
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", boxSizing: "border-box" }}>
        
        {/* Profile/Book Cover + Meta Deck Frame */}
        <div style={{ 
          backgroundColor: "#ffffff",
          border: "4px solid #111111",
          boxShadow: "5px 5px 0px #111111",
          padding: "24px",
          display: "flex", 
          flexDirection: "row",
          gap: "20px", 
          marginBottom: "36px",
          boxSizing: "border-box"
        }} className="flex-col sm:flex-row">
          
          {novel.cover_url ? (
            <img 
              src={novel.cover_url} 
              alt={novel.title} 
              style={{ 
                width: "120px", 
                height: "168px", 
                borderRadius: "0px", 
                objectFit: "cover", 
                border: "3px solid #111111",
                boxShadow: "2px 2px 0px #111111",
                flexShrink: 0,
                boxSizing: "border-box"
              }} 
            />
          ) : (
            <div style={{ 
              width: "120px", 
              height: "168px", 
              borderRadius: "0px", 
              backgroundColor: "#fbbf24", 
              border: "3px solid #111111",
              boxShadow: "2px 2px 0px #111111",
              flexShrink: 0, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "36px",
              boxSizing: "border-box"
            }}>
              📖
            </div>
          )}
          
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
            <div style={{ boxSizing: "border-box" }}>
              <h1 style={{ 
                fontFamily: "serif",
                color: "#111111", 
                fontSize: "26px", 
                fontWeight: "900", 
                margin: "0 0 10px 0",
                lineHeight: "1.2"
              }}>
                {novel.title}
              </h1>
              <p style={{ 
                fontFamily: "serif",
                color: "#333333", 
                fontSize: "14px", 
                margin: "0 0 16px 0", 
                lineHeight: "1.5" 
              }}>
                {novel.description}
              </p>
            </div>
            
            <div style={{ boxSizing: "border-box" }}>
              <span style={{ 
                display: "inline-block",
                padding: "4px 10px", 
                borderRadius: "0px", 
                backgroundColor: "#111111", 
                color: "#ffffff", 
                fontFamily: "monospace, sans-serif",
                fontSize: "11px", 
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                border: "1px solid #111111"
              }}>
                {novel.status}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Section Index Heading Grid */}
        <div style={{ 
          display: "inline-block", 
          backgroundColor: "#111111", 
          padding: "4px 12px", 
          marginBottom: "16px",
          boxSizing: "border-box"
        }}>
          <h2 style={{ 
            color: "#ffffff", 
            fontFamily: "monospace, sans-serif",
            textTransform: "uppercase",
            fontSize: "12px", 
            fontWeight: "900", 
            margin: 0,
            letterSpacing: "0.5px"
          }}>
            Chapters ({chapters.length})
          </h2>
        </div>

        {/* Chapters Directory Feed Row Map */}
        {chapters.length === 0 ? (
          <div style={{
            padding: "24px",
            backgroundColor: "#ffffff",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
            boxSizing: "border-box"
          }}>
            <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: "#555555" }}>
              No chapters published yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
            {chapters.map((ch, index) => (
              <Link
                key={ch.id}
                to="/novels/$novelId/chapters/$chapterId"
                params={{ novelId, chapterId: ch.id }}
                style={{ textDecoration: "none" }}
              >
                <div 
                  style={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px 20px", 
                    borderRadius: "0px",
                    backgroundColor: "#ffffff", 
                    border: "2px solid #111111",
                    boxShadow: "3px 3px 0px #111111",
                    boxSizing: "border-box",
                    transition: "all 0.1s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-1px, -1px)";
                    e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
                  }}
                >
                  <div style={{ boxSizing: "border-box" }}>
                    <p style={{ 
                      color: "#111111", 
                      fontFamily: "serif",
                      fontSize: "15px", 
                      fontWeight: "900", 
                      margin: "0 0 4px 0",
                      lineHeight: "1.3"
                    }}>
                      Chapter {ch.chapter_number} — {ch.title}
                    </p>
                    <p style={{ 
                      color: "#555555", 
                      fontFamily: "monospace, sans-serif",
                      fontSize: "11px", 
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      margin: 0 
                    }}>
                      {ch.word_count > 0 ? `${ch.word_count} words` : "Images only"}
                    </p>
                  </div>
                  <span style={{ 
                    color: "#111111", 
                    fontFamily: "monospace, sans-serif",
                    fontSize: "20px",
                    fontWeight: "900",
                    marginLeft: "12px"
                  }}>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
