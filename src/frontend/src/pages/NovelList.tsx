import { supabase } from "@/lib/supabase";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Novel {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  status: string;
  view_count: number;
  created_at: string;
}

function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link to="/novels/$novelId" params={{ novelId: novel.id }} style={{ textDecoration: "none" }}>
      <div style={{
        width: "100%", aspectRatio: "9/14", borderRadius: "14px", overflow: "hidden",
        position: "relative", background: "#111",
        border: "1px solid rgba(124,58,237,0.35)",
        boxShadow: "0 0 12px rgba(124,58,237,0.2), 0 4px 16px rgba(0,0,0,0.4)",
        boxSizing: "border-box",
      }}>
        {novel.cover_url ? (
          <img src={novel.cover_url} alt={novel.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a0b2e", fontSize: "32px" }}>
            
          </div>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 8px 8px",
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)",
        }}>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {novel.title}
          </p>
          <p style={{ color: "rgba(196,168,255,0.6)", fontSize: "10px", margin: "2px 0 0" }}>
            {novel.view_count} views
          </p>
        </div>
      </div>
    </Link>
  );
}

export function NovelListPage() {
  const [trending, setTrending] = useState<Novel[]>([]);
  const [latest, setLatest] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("novels").select("*").order("view_count", { ascending: false }).limit(6),
      supabase.from("novels").select("*").order("created_at", { ascending: false }).limit(6),
    ]).then(([{ data: trendingData }, { data: latestData }]) => {
      setTrending(trendingData ?? []);
      setLatest(latestData ?? []);
      setLoading(false);
    });
  }, []);

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 style={{
      fontSize: "18px", fontWeight: 900, margin: "0 0 14px",
      background: "linear-gradient(90deg, #a855f7, #7c3aed)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>
      {title}
    </h2>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0010", paddingBottom: "80px", boxSizing: "border-box" }}>
      <div style={{ padding: "24px 14px 0", background: "linear-gradient(180deg, #1a0b2e 0%, #0a0010 100%)", borderBottom: "1px solid rgba(124,58,237,0.15)", marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: 900, color: "#fff" }}>
          <span style={{ color: "#a855f7" }}>◆</span> Novels
        </h1>
        <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
          Read stories from Indian creators
        </p>
      </div>

      {loading ? (
        <div style={{ padding: "0 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: "9/14", borderRadius: "14px", background: "rgba(124,58,237,0.1)" }} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 14px" }}>
          {/* Trending */}
          {trending.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <SectionHeader title="Trending Novels" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {trending.map(novel => <NovelCard key={novel.id} novel={novel} />)}
              </div>
            </div>
          )}

          {/* Latest */}
          {latest.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <SectionHeader title="Latest Novels" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {latest.map(novel => <NovelCard key={novel.id} novel={novel} />)}
              </div>
            </div>
          )}

          {trending.length === 0 && latest.length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "60px" }}>
              No novels yet. Be the first to publish one!
            </p>
          )}
        </div>
      )}
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
      }
