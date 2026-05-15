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
import { useAuth } from "../../hooks/useAuth";
import { useChapters } from "../../hooks/useChapters";
import { useComic } from "../../hooks/useComic";
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
  const { data: chapters = [], isLoading: chaptersLoading } =
    useChapters(comicId);
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: listGenres,
  });

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
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    setError("");
    try {
      let cover_url = comic?.cover_url;
      if (coverFile) cover_url = await uploadCoverImage(comicId, coverFile);
      await updateComic(comicId, {
        title: title.trim(),
        description: description.trim() || undefined,
        cover_url,
      });
      await setComicGenres(comicId, selectedGenres);
      queryClient.invalidateQueries({ queryKey: ["comic", comicId] });
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)",
        }}
      >
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!comic || comic.author_id !== user?.id) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)",
        }}
      >
        <div className="text-center text-white/60">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Comic not found or you don&apos;t have permission.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Edit Comic</h1>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* Cover */}
          <div>
            <label className="cursor-pointer block">
              <div className="w-32 h-44 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-purple-500/50 flex items-center justify-center bg-white/5 transition-colors">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-white/40 p-2">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs">Change cover</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <label
                htmlFor="title-input"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Title
              </label>
              <input
                id="title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="desc-input"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Description
              </label>
              <textarea
                id="desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div>
          <p className="block text-sm font-medium text-white/70 mb-3">Genres</p>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedGenres.includes(g.id)
                    ? "bg-purple-500 text-white border border-purple-400"
                    : "bg-white/5 text-white/60 border border-white/10 hover:border-purple-500/40"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Chapters</h2>
            <Link
              to="/creator/comics/$comicId/chapters/new"
              params={{ comicId }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Chapter
            </Link>
          </div>

          {chaptersLoading ? (
            <div className="space-y-2">
              {["a", "b", "c"].map((k) => (
                <div
                  key={`skeleton-edit-${k}`}
                  className="h-14 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No chapters yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...chapters]
                .sort(
                  (a: Chapter, b: Chapter) =>
                    a.chapter_number - b.chapter_number,
                )
                .map((chapter: Chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">
                        Chapter {chapter.chapter_number}
                        {chapter.title ? ` — ${chapter.title}` : ""}
                      </span>
                      {!chapter.is_published && (
                        <span className="ml-2 text-xs text-yellow-400">
                          Draft
                        </span>
                      )}
                    </div>
                    <Link
                      to="/creator/comics/$comicId/chapters/$chapterId"
                      params={{ comicId, chapterId: chapter.id }}
                      className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(chapter.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-2">
              Delete Chapter?
            </h3>
            <p className="text-white/60 text-sm mb-6">
              This will permanently delete this chapter and all its pages.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteChapter(deleteTarget)}
                className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30"
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
