import { supabase } from "@/lib/supabase";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Novel {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  creator_id: string;
  status: string;
  created_at: string;
}

export function NovelListPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("novels")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNovels(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "24px 16px", maxWidth: "800px", margin: "0 auto", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, marginBottom: "24px" }}>
        Novels
      </h1>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
      ) : novels.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.4)" }}>No novels yet. Be the first to publish one!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {novels.map((novel) => (
            <Link
              key={novel.id}
              to="/novels/$novelId"
              params={{ novelId: novel.id }}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                display: "flex", gap: "16px", padding: "16px", borderRadius: "12px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)",
                boxSizing: "border-box",
              }}>
                {novel.cover_url ? (
                  <img src={novel.cover_url} alt={novel.title} style={{ width: "60px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: "60px", height: "80px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>📖</div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 6px" }}>{novel.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                    {novel.description ?? "No description"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
