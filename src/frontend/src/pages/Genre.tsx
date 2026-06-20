import { useComicsByGenre, useGenres } from "@/hooks/useGenres";
import { Link, useParams } from "@tanstack/react-router";
import { BookOpen, ChevronLeft } from "lucide-react";
import type { Comic } from "@/types/index";

function ComicCard({ comic }: { comic: Comic }) {
  return (
    <Link
      to="/comics/$comicId"
      params={{ comicId: comic.id }}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div style={{
        width: "100%",
        aspectRatio: "9/14",
        borderRadius: "14px",
        overflow: "hidden",
        position: "relative",
        background: "#111",
        border: "1px solid rgba(124,58,237,0.35)",
        boxShadow: "0 0 12px rgba(124,58,237,0.2), 0 4px 16px rgba(0,0,0,0.4)",
      }}>
        {comic.cover_url
          ? <img src={comic.cover_url} alt={comic.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a0b2e" }}>
              <BookOpen style={{ width: 24, height: 24, color: "#a855f7" }} />
            </div>
        }
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 8px 8px",
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)",
        }}>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {comic.title}
          </p>
          <p style={{ color: "rgba(196,168,255,0.6)", fontSize: "10px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {(comic as Comic & { author_name?: string }).author_name ?? "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function GenrePage() {
  const { genreId } = useParams({ from: "/genre/$genreId" });
  const { data: genres = [] } = useGenres();
  const { data: comics = [], isLoading } = useComicsByGenre(genreId);

  const genre = genres.find(g => g.id === genreId);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0010", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{
        padding: "16px 14px",
        background: "linear-gradient(180deg, #1a0b2e 0%, #0a0010 100%)",
        borderBottom: "1px solid rgba(124,58,237,0.15)",
      }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>
          <ChevronLeft style={{ width: 16, height: 16 }} />
          Back
        </Link>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 900, color: "#fff" }}>
          <span style={{ color: "#a855f7" }}>◆</span> {genre?.name ?? "Genre"}
        </h1>
        <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
          {comics.length} comics
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: "16px 14px 0" }}>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: "9/14", borderRadius: "14px", background: "rgba(124,58,237,0.1)" }} />
            ))}
          </div>
        ) : comics.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "60px" }}>No comics in this genre yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {comics.map(comic => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
            }
