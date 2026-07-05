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
        width: "100%", 
        aspectRatio: "9/14", 
        borderRadius: "0px", 
        overflow: "hidden",
        position: "relative", 
        background: "#ffffff",
        border: "2px solid #111111",
        boxShadow: "3px 3px 0px #111111",
        boxSizing: "border-box",
      }}>
        {novel.cover_url ? (
          <img 
            src={novel.cover_url} 
            alt={novel.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
            loading="lazy" 
          />
        ) : (
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            background: "#fbbf24", 
            fontSize: "32px",
            boxSizing: "border-box"
          }}>
            {/* Empty block representation */}
          </div>
        )}
        
        {/* Crisp Printed Manga Panel Information Bar */}
        <div style={{
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          right: 0,
          padding: "10px 8px",
          backgroundColor: "#ffffff",
          borderTop: "2px solid #111111",
          boxSizing: "border-box"
        }}>
          <p style={{ 
            color: "#111111", 
            fontFamily: "serif",
            fontSize: "13px", 
            fontWeight: "900", 
            margin: 0, 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
          }}>
            {novel.title}
          </p>
          <p style={{ 
            color: "#555555", 
            fontFamily: "monospace, sans-serif",
            fontSize: "10px", 
            fontWeight: "bold",
            textTransform: "uppercase",
            margin: "2px 0 0" 
          }}>
            {novel.view_count} VIEWS
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

  {/* Solid Ink Chapter/Section Header Badge Block */}
  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ 
      display: "inline-block", 
      backgroundColor: "#111111", 
      padding: "4px 12px", 
      marginBottom: "16px",
      boxSizing: "border-box"
    }}>
      <h2 style={{
        fontSize: "12px", 
        fontWeight: "900", 
        margin: 0,
        fontFamily: "monospace, sans-serif", 
        textTransform: "uppercase", 
        color: "#ffffff",
        letterSpacing: "0.5px"
      }}>
        {title}
      </h2>
    </div>
  );

  return (
    <div 
      style={{ 
        backgroundColor: "#f5f0e8", 
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        minHeight: "100vh", 
        paddingBottom: "80px", 
        boxSizing: "border-box" 
      }}
    >
      {/* Structural Headline Catalog Canvas Header */}
      <div style={{ 
        padding: "32px 14px 20px 14px", 
        backgroundColor: "#ffffff", 
        borderBottom: "4px solid #111111", 
        marginBottom: "32px",
        boxSizing: "border-box"
      }}>
        <h1 style={{ margin: "0 0 4px 0", fontFamily: "serif", fontSize: "36px", fontWeight: "900", color: "#111111" }}>
          <span style={{ color: "#fbbf24", marginRight: "4px" }}>◆</span>Novels
        </h1>
        <p style={{ margin: 0, color: "#555555", fontFamily: "monospace, sans-serif", textTransform: "uppercase", fontSize: "12px", fontWeight: "bold" }}>
          Read stories from Indian creators
        </p>
      </div>

      {loading ? (
        /* Skeleton Framework Grid State */
        <div style={{ padding: "0 14px", boxSizing: "border-box" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", boxSizing: "border-box" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  aspectRatio: "9/14", 
                  borderRadius: "0px", 
                  border: "2px solid #111111",
                  backgroundColor: "rgba(17, 17, 17, 0.08)",
                  boxSizing: "border-box"
                }} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 14px", boxSizing: "border-box" }}>
          {/* Trending Panel Section Track */}
          {trending.length > 0 && (
            <div style={{ marginBottom: "36px", boxSizing: "border-box" }}>
              <SectionHeader title="Trending Novels" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", boxSizing: "border-box" }}>
                {trending.map(novel => <NovelCard key={novel.id} novel={novel} />)}
              </div>
            </div>
          )}

          {/* Latest Panel Section Track */}
          {latest.length > 0 && (
            <div style={{ marginBottom: "36px", boxSizing: "border-box" }}>
              <SectionHeader title="Latest Releases" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", boxSizing: "border-box" }}>
                {latest.map(novel => <NovelCard key={novel.id} novel={novel} />)}
              </div>
            </div>
          )}

          {/* Empty Inventory Layout Template */}
          {trending.length === 0 && latest.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "48px 16px",
              backgroundColor: "#ffffff",
              border: "2px solid #111111",
              boxShadow: "4px 4px 0px #111111",
              marginTop: "40px",
              boxSizing: "border-box"
            }}>
              <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: "#111111" }}>
                No novels found yet. Be the first to publish one!
              </p>
            </div>
          )}
        </div>
      )}
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
