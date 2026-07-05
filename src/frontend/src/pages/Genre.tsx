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
      <div 
        style={{
          width: "100%",
          aspectRatio: "9/14",
          borderRadius: "0px",
          overflow: "hidden",
          position: "relative",
          background: "#ffffff",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          transition: "transform 0.1s ease, box-shadow 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "5px 5px 0px #111111";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
        }}
      >
        {/* Comic Cover Canvas Frame */}
        <div style={{ flexGrow: 1, width: "100%", position: "relative", overflow: "hidden", background: "#f5f0e8", boxSizing: "border-box" }}>
          {comic.cover_url ? (
            <img 
              src={comic.cover_url} 
              alt={comic.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              loading="lazy" 
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 24, height: 24, color: "#111111" }} />
            </div>
          )}
        </div>

        {/* Title Content Text Frame Plaquette */}
        <div style={{
          padding: "10px 8px",
          background: "#ffffff",
          borderTop: "2px solid #111111",
          boxSizing: "border-box"
        }}>
          <p style={{ 
            color: "#111111", 
            fontSize: "13px", 
            fontFamily: "serif",
            fontWeight: "900", 
            margin: 0, 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            boxSizing: "border-box"
          }}>
            {comic.title}
          </p>
          <p style={{ 
            color: "#555555", 
            fontSize: "10px", 
            fontFamily: "monospace, sans-serif",
            textTransform: "uppercase",
            margin: "2px 0 0", 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            boxSizing: "border-box"
          }}>
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
    <div 
      style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f5f0e8", 
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        paddingBottom: "80px",
        color: "#111111",
        boxSizing: "border-box"
      }}
    >
      {/* Header Canvas Block */}
      <div style={{
        padding: "24px 16px",
        background: "#ffffff",
        borderBottom: "4px solid #111111",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", boxSizing: "border-box" }}>
          {/* Back Action Trigger Link */}
          <Link 
            to="/" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "4px", 
              color: "#111111", 
              textTransform: "uppercase",
              fontFamily: "monospace, sans-serif",
              fontWeight: "bold",
              textDecoration: "none", 
              fontSize: "12px", 
              marginBottom: "16px",
              boxSizing: "border-box"
            }}
          >
            <ChevronLeft style={{ width: 14, height: 14 }} /> Back to Home
          </Link>
          
          {/* Genre Banner Title */}
          <h1 style={{ 
            margin: 0, 
            fontSize: "32px", 
            fontFamily: "serif",
            fontWeight: "900", 
            color: "#111111",
            boxSizing: "border-box"
          }}>
            <span style={{ color: "#fbbf24", marginRight: "4px" }}>◆</span> {genre?.name ?? "Genre Hub"}
          </h1>
          
          {/* Count Badge Information Bar */}
          <div style={{ marginTop: "8px", boxSizing: "border-box" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "11px",
              fontFamily: "monospace, sans-serif",
              fontWeight: "bold",
              backgroundColor: "#111111",
              color: "#ffffff",
              padding: "4px 10px",
              boxSizing: "border-box"
            }}>
              {comics.length} COMICS AVAILABLE
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area Framework */}
      <div style={{ padding: "24px 16px 0", maxWidth: "1000px", margin: "0 auto", boxSizing: "border-box" }}>
        {isLoading ? (
          <div 
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", boxSizing: "border-box" }}
            className="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  aspectRatio: "9/14", 
                  backgroundColor: "#ffffff",
                  border: "2px solid #111111",
                  boxShadow: "3px 3px 0px #111111",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box" 
                }}
              >
                <div style={{ width: "100%", height: "75%", backgroundColor: "rgba(17, 17, 17, 0.08)" }} />
                <div style={{ width: "80%", height: "12px", backgroundColor: "rgba(17, 17, 17, 0.08)", marginTop: "8px" }} />
                <div style={{ width: "50%", height: "8px", backgroundColor: "rgba(17, 17, 17, 0.05)", marginTop: "4px" }} />
              </div>
            ))}
          </div>
        ) : comics.length === 0 ? (
          /* Blank Zero State Canvas Display Panel */
          <div style={{
            textAlign: "center",
            padding: "48px 16px",
            backgroundColor: "#ffffff",
            border: "2px solid #111111",
            boxShadow: "4px 4px 0px #111111",
            maxWidth: "450px",
            margin: "40px auto",
            boxSizing: "border-box"
          }}>
            <p style={{ fontFamily: "monospace, sans-serif", fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", margin: "0 0 6px 0", color: "#111111" }}>
              Empty Category
            </p>
            <p style={{ fontFamily: "serif", fontSize: "14px", color: "#555555", margin: 0 }}>
              No comics discovered in this specific genre track yet. Check back soon!
            </p>
          </div>
        ) : (
          <div 
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", boxSizing: "border-box" }}
            className="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
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
