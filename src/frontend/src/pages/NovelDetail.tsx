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

  if (loading) return <p style={{ color: "rgba(255,255,255,0.4)", padding: "24px" }}>Loading...</p>;
  if (!novel) return <p style={{ color: "rgba(255,255,255,0.4)", padding: "24px" }}>Novel not found.</p>;

  return (
    <div style={{ padding: "24px 16px", maxWidth: "800px", margin: "0 auto", boxSizing: "border-box" }}>
      {/* Cover + Info */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        {novel.cover_url ? (
          <img src={novel.cover_url} alt={novel.title} style={{ width: "100px", height: "140px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
        ) : (
          <div style={{ width: "100px", height: "140px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>📖</div>
        )}
        <div>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, margin: "0 0 8px" }}>{novel.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 8px", lineHeight: 1.5 }}>{novel.description}</p>
          <span style={{ padding: "4px 10px", borderRadius: "20px", background: "rgba(124,58,237,0.2)", color: "#8b5cf6", fontSize: "12px", fontWeight: 700 }}>
            {novel.status}
          </span>
        </div>
      </div>

      {/* Chapters */}
      <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>
          Chapters ({chapters.length})
      </h2>
      {chapters.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>No chapters yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              to="/novels/$novelId/chapters/$chapterId"
              params={{ novelId, chapterId: ch.id }}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.15)",
                boxSizing: "border-box",
              }}>
                <div>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 2px" }}>
                    Chapter {ch.chapter_number} — {ch.title}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: 0 }}>
                    {ch.word_count > 0 ? `${ch.word_count} words` : "Images only"}
                  </p>
                </div>
                <span style={{ color: "#8b5cf6", fontSize: "18px" }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
          }
