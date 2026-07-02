import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ADMIN_EMAIL = "utkarshwadhvinde@gmail.com";

interface PendingComic {
  id: string;
  title: string;
  cover_url: string | null;
  description: string | null;
  created_at: string;
  creator_id: string;
  profiles?: { display_name: string | null; email: string | null };
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [comics, setComics] = useState<PendingComic[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const fetchPending = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("comics")
      .select("*, profiles(display_name, email)")
      .eq("ai_status", "pending")
      .order("created_at", { ascending: true });
    setComics(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchPending();
  }, [isAdmin]);

  const handleApprove = async (comicId: string) => {
    await supabase.from("comics").update({ ai_status: "approved", status: "published" }).eq("id", comicId);
    toast.success("Comic approved!");
    fetchPending();
  };

  const handleReject = async (comicId: string) => {
    await supabase.from("comics").update({ ai_status: "rejected", status: "rejected" }).eq("id", comicId);
    toast.success("Comic rejected!");
    fetchPending();
  };

  if (!user) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
        Please sign in.
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
        Access denied.
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 16px", maxWidth: "800px", margin: "0 auto", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "24px" }}>
        AI comics pending approval
      </p>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
      ) : comics.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>No pending comics. All clear!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {comics.map((comic) => (
            <div key={comic.id} style={{
              padding: "16px", borderRadius: "12px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)",
              boxSizing: "border-box",
            }}>
              <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                {comic.cover_url ? (
                  <img src={comic.cover_url} alt={comic.title} style={{ width: "60px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: "60px", height: "80px", borderRadius: "8px", background: "rgba(124,58,237,0.2)", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>{comic.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 4px" }}>
                    By: {comic.profiles?.display_name ?? "Unknown"}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>
                    {new Date(comic.created_at).toLocaleDateString()}
                  </p>
                  {comic.description && (
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "6px 0 0", lineHeight: 1.5 }}>
                      {comic.description}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleApprove(comic.id)}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(comic.id)}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
                          }
