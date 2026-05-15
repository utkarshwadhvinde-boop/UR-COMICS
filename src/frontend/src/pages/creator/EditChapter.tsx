import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, Eye, Save, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChapter } from "../../hooks/useChapter";
import {
  deleteChapter,
  publishChapter,
  updateChapter,
} from "../../services/chaptersService";
import {
  commitChapterUpload,
  rollbackChapterUpload,
  uploadChapterPage,
} from "../../services/uploadService";

export function EditChapterPage() {
  const { comicId, chapterId } = useParams({
    from: "/creator/comics/$comicId/chapters/$chapterId",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: chapter, isLoading } = useChapter(comicId, chapterId);

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [newPages, setNewPages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (chapter) {
      setChapterTitle(chapter.title ?? "");
      setChapterNumber(String(chapter.chapter_number));
    }
  }, [chapter]);

  const existingPages = chapter?.pages ?? [];

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 100);
    setNewPages(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePage = (idx: number) => {
    setNewPages((p) => p.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSaveMeta = async () => {
    if (!chapterNumber) return;
    setIsSaving(true);
    setError("");
    try {
      await updateChapter(chapterId, {
        title: chapterTitle || undefined,
        chapter_number: Number.parseFloat(chapterNumber),
      });
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAndPublish = async () => {
    if (newPages.length === 0) return;
    setIsUploading(true);
    setError("");
    setUploadProgress(0);
    const uploadedPaths: string[] = [];
    const imageUrls: string[] = [];
    try {
      for (let i = 0; i < newPages.length; i++) {
        const url = await uploadChapterPage(comicId, chapterId, i, newPages[i]);
        imageUrls.push(url);
        uploadedPaths.push(
          `${comicId}/${chapterId}/${String(i).padStart(4, "0")}.${newPages[i].name.split(".").pop()}`,
        );
        setUploadProgress(Math.round(((i + 1) / newPages.length) * 90));
      }
      await commitChapterUpload(chapterId, imageUrls);
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      setNewPages([]);
      setNewPreviews([]);
      navigate({ to: `/creator/comics/${comicId}/edit` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      if (uploadedPaths.length > 0) {
        await rollbackChapterUpload(comicId, chapterId, uploadedPaths).catch(
          () => {},
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChapter(chapterId);
      queryClient.invalidateQueries({ queryKey: ["chapters", comicId] });
      navigate({ to: `/creator/comics/${comicId}/edit` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  // publishChapter is available for future use
  void publishChapter;

  if (isLoading) {
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

  if (!chapter) {
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
          <p>Chapter not found.</p>
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
          <h1 className="text-2xl font-black text-white">Edit Chapter</h1>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Chapter"}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Chapter Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="chapter-number-input"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Chapter Number
              </label>
              <input
                id="chapter-number-input"
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="chapter-title-input"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Title (optional)
              </label>
              <input
                id="chapter-title-input"
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                placeholder="Chapter title..."
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveMeta}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Info
          </button>
        </div>

        {/* Existing pages */}
        {existingPages.length > 0 && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                Current Pages ({existingPages.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide" : "Preview"}
              </button>
            </div>
            {showPreview && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-80 overflow-y-auto">
                {existingPages.map(
                  (page: { id: string; image_url: string }, idx: number) => (
                    <div
                      key={page.id}
                      className="relative aspect-[9/14] rounded-lg overflow-hidden"
                    >
                      <img
                        src={page.image_url}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1">
                        {idx + 1}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload new pages */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">
            {existingPages.length > 0 ? "Replace Pages" : "Upload Pages"}
          </h2>
          <label className="cursor-pointer block">
            <div className="border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-6 text-center bg-white/5 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="text-white/70 text-sm">
                Click to select pages (max 100)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePagesChange}
              className="hidden"
            />
          </label>

          {newPreviews.length > 0 && (
            <div>
              <p className="text-white/60 text-sm mb-3">
                {newPreviews.length} new pages selected
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                {newPreviews.map((src, idx) => (
                  <div
                    key={`preview-${idx}-${src.slice(-8)}`}
                    className="relative aspect-[9/14] rounded-lg overflow-hidden group"
                  >
                    <img
                      src={src}
                      alt={`New page ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removePage(idx)}
                        className="p-1 rounded-full bg-red-500/80"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white/60 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleUploadAndPublish}
                disabled={isUploading}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                }}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload &amp; Publish
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
