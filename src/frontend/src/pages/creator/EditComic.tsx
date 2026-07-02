import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useChapters } from "../../hooks/useChapters";
import { useComic } from "../../hooks/useComic";
import { isValidImageFile, sanitizeDescription, sanitizeTitle } from "../../lib/utils";
import { deleteChapter } from "../../services/chaptersService";
import {
  listGenres,
  setComicGenres,
  updateComic,
} from "../../services/comicsService";
import { uploadCoverImage } from "../../services/uploadService";
import type { Chapter } from "../../types/index";

export function EditComicPage() {
  const { comicId } = useParams({ from: "/creator/comics/$comicId" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: comic, isLoading: comicLoading } = useComic(comicId);
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(comicId);
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: listGenres,
  });

  const [activeTab, setActiveTab] = useState<"series" | "episodes">("series");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (comic) {
      setTitle(comic.title);
      setDescription(comic.description ?? "");
      setSelectedGenres((comic.genres ?? []).map((g: { id: string }) => g.id));
      setCoverPreview(comic.cover_url ?? "");
    }
  }, [comic]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      toast.error("Invalid file. Use JPG/PNG/WebP under 10MB.");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    const cleanTitle = sanitizeTitle(title);
    if (!cleanTitle) {
      toast.error("Please enter a valid title (max 150 characters).");
      return;
    }
    const cleanDesc = sanitizeDescription(description);
    if (cleanDesc === null) {
      toast.error("Description is too long (max 1000 characters).");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      let cover_url = comic?.cover_url;
      if (coverFile) cover_url = await uploadCoverImage(comicId, coverFile);
      await updateComic(comicId, {
        title: cleanTitle,
        description: cleanDesc || undefined,
        cover_url,
      });
      await setComicGenres(comicId, selectedGenres);
      queryClient.invalidateQueries({ queryKey: ["comic", comicId] });
      toast.success("Comic saved!");
      navigate({ to: "/creator" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChapter = async (id: string) => {
    try {
      await deleteChapter(id);
      queryClient.invalidateQueries({ queryKey: ["chapters", comicId] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chapter");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (comicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!comic || comic.creator_id !== user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
        <div className="text-center text-white/60">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Comic not found or you don&apos;t have permission.</p>
        </div>
      </div>
    );
  }

  const sortedChapters = [...chapters].sort((a: Chapter, b: Chapter) => a.chapter_number - b.chapter_number);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Comic header */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)", boxSizing: "border-box" }}>
          {coverPreview ? (
            <img src={coverPreview} alt={title} style={{ width: "60px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: "60px", height: "80px", borderRadius: "8px", background: "rgba(124,58,237,0.2)", flexShrink: 0 }} />
          )}
          <div>
            <p style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 4px" }}>{comic.title}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
              {sortedChapters.length} episode{sortedChapters.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("series")}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px",
              background: activeTab === "series" ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "rgba(255,255,255,0.05)",
              color: activeTab === "series" ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          >
            Manage Series
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("episodes")}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px",
              background: activeTab === "episodes" ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "rgba(255,255,255,0.05)",
              color: activeTab === "episodes" ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          >
            Manage Episodes
          </button>
        </div>

        {/* Manage Series Tab */}
        {activeTab === "series" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ cursor: "pointer", flexShrink: 0 }}>
                <div style={{ width: "100px", height: "140px", borderRadius: "10px", overflow: "hidden", border: "2px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)" }}>
                  {coverPreview ? (
                    <img src={coverPreview} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                      <ImageIcon style={{ width: 20, height: 20, margin: "0 auto 4px" }} />
                      <p style={{ fontSize: "10px" }}>Cover</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} />
              </label>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "8px" }}>Genres</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {genres.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGenre(g.id)}
                    style={{
                      padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "none",
                      background: selectedGenres.includes(g.id) ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "rgba(255,255,255,0.06)",
                      color: selectedGenres.includes(g.id) ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: "#f87171", fontSize: "13px" }}>{error}</p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{ padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", color: "#fff", fontSize: "14px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {isSaving ? (
                <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              ) : (
                <Save style={{ width: 16, height: 16 }} />
              )}
              Save Changes
            </button>
          </div>
        )}

        {/* Manage Episodes Tab */}
        {activeTab === "episodes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <Link
                to="/creator/comics/$comicId/chapters/new"
                params={{ comicId }}
                style={{ padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Plus style={{ width: 16, height: 16 }} />
                Add Episode
              </Link>
            </div>

            {chaptersLoading ? (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading...</p>
            ) : sortedChapters.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.3)" }}>
                <BookOpen style={{ width: 32, height: 32, margin: "0 auto 8px", opacity: 0.4 }} />
                <p style={{ fontSize: "14px" }}>No episodes yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 80px 60px 40px", gap: "8px", padding: "8px 12px", color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 700 }}>
                  <span>IMG</span>
                  <span>TITLE</span>
                  <span>STATUS</span>
                  <span>DATE</span>
                  <span>EDIT</span>
                </div>

                {sortedChapters.map((chapter: Chapter) => (
                  <div key={chapter.id} style={{ display: "grid", gridTemplateColumns: "50px 1fr 80px 60px 40px", gap: "8px", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.15)", alignItems: "center", boxSizing: "border-box" }}>
                    {/* Thumbnail */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "rgba(124,58,237,0.2)", overflow: "hidden", flexShrink: 0 }}>
                      {comic.cover_url && (
                        <img src={comic.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Ep. {chapter.chapter_number} {chapter.title ? `— ${chapter.title}` : ""}
                      </p>
                      {(chapter as any).subtitle && (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {(chapter as any).subtitle}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <span style={{
                      fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
                      background: chapter.is_published ? "rgba(34,197,94,0.15)" : "rgba(250,204,21,0.15)",
                      color: chapter.is_published ? "#22c55e" : "#facc15",
                    }}>
                      {chapter.is_published ? "Published" : "Draft"}
                    </span>

                    {/* Date */}
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
                      {new Date(chapter.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>

                    {/* Edit */}
                    <div style={{ display: "flex", gap: "4px" }}>
                      <Link
                        to="/creator/comics/$comicId/chapters/$chapterId"
                        params={{ comicId, chapterId: chapter.id }}
                        style={{ padding: "6px", borderRadius: "6px", background: "rgba(124,58,237,0.2)", color: "#a78bfa", display: "flex" }}
                      >
                        <ChevronRight style={{ width: 14, height: 14 }} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(chapter.id)}
                        style={{ padding: "6px", borderRadius: "6px", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "none", cursor: "pointer", display: "flex" }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", maxWidth: "320px", width: "100%", margin: "0 16px", boxSizing: "border-box" }}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>Delete Episode?</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "20px" }}>
              This will permanently delete this episode and all its pages.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteChapter(deleteTarget)}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
        }
