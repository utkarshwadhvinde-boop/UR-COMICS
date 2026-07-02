import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { isValidImageFile, sanitizeDescription, sanitizeTitle } from "../../lib/utils";
import { createChapter } from "../../services/chaptersService";
import {
  createComic,
  listGenres,
  setComicGenres,
  updateComic,
} from "../../services/comicsService";
import {
  commitChapterUpload,
  rollbackChapterUpload,
  uploadChapterPage,
  uploadCoverImage,
} from "../../services/uploadService";
import { toast } from "sonner";

const STEPS = ["Comic Info", "Upload Pages", "Publish"];

export default function CreateComic() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const [pages, setPages] = useState<File[]>([]);
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: listGenres,
  });

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}
      >
        <div className="text-center text-white/60">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Please sign in to create comics.</p>
        </div>
      </div>
    );
  }

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

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 100);
    const validFiles = files.filter((f) => isValidImageFile(f));
    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped — use JPG/PNG/WebP under 10MB.");
    }
    setPages(validFiles);
    setPagePreviews(validFiles.map((f) => URL.createObjectURL(f)));
  };

  const removePage = (idx: number) => {
    setPages((p) => p.filter((_, i) => i !== idx));
    setPagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  };

  const handleNextStep0 = () => {
    const cleanTitle = sanitizeTitle(title);
    if (!cleanTitle) {
      setError("Please enter a valid title (max 150 characters).");
      return;
    }
    const cleanDesc = sanitizeDescription(description);
    if (cleanDesc === null) {
      setError("Description is too long (max 1000 characters).");
      return;
    }
    setError("");
    setStep(1);
  };

  const handlePublish = async () => {
    if (!user) return;
    const cleanTitle = sanitizeTitle(title);
    if (!cleanTitle) {
      setError("Please enter a valid title.");
      return;
    }
    const cleanDesc = sanitizeDescription(description);
    if (cleanDesc === null) {
      setError("Description is too long.");
      return;
    }
    if (pages.length === 0) {
      setError("Please upload at least one page.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setUploadProgress(0);
    let comicId = "";
    let chapterId = "";
    const uploadedPaths: string[] = [];
    try {
      const comic = await createComic({
  title: cleanTitle,
  description: cleanDesc || undefined,
  cover_url: undefined,
  creator_id: user.id,
  is_ai_generated: isAiGenerated,
  ai_status: isAiGenerated ? "pending" : "none",
});
      comicId = comic.id;

      if (coverFile) {
        const cover_url = await uploadCoverImage(comicId, coverFile);
        await updateComic(comicId, { cover_url });
      }

      if (selectedGenres.length > 0)
        await setComicGenres(comicId, selectedGenres);

      const chapter = await createChapter({
        comic_id: comicId,
        chapter_number: 1,
        title: "Chapter 1",
        creator_id: user.id,
      });
      chapterId = chapter.id;
      const imageUrls: string[] = [];
      for (let i = 0; i < pages.length; i++) {
        const url = await uploadChapterPage(comicId, chapterId, i, pages[i]);
        imageUrls.push(url);
        uploadedPaths.push(
          `${comicId}/${chapterId}/${String(i).padStart(4, "0")}.${pages[i].name.split(".").pop()}`,
        );
        setUploadProgress(Math.round(((i + 1) / pages.length) * 90));
      }

      await commitChapterUpload(chapterId, imageUrls);
      setUploadProgress(100);
      navigate({ to: `/comics/${comicId}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
      setIsSubmitting(false);
      if (comicId && chapterId) {
        await rollbackChapterUpload(comicId, chapterId, uploadedPaths).catch(() => {});
      }
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step ? "bg-purple-500 text-white" : "bg-white/10 text-white/40"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? "text-white" : "text-white/40"}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-white/20" />}
            </div>
          ))}
        </div>

        {/* Step 0: Comic Info */}
        {step === 0 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Comic Information</h1>

            <div>
              <label htmlFor="cover-upload" className="block text-sm font-medium text-white/70 mb-2">
                Cover Image (9:16 ratio)
              </label>
              <label className="cursor-pointer group">
                <div className="w-40 h-56 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-purple-500/50 flex items-center justify-center bg-white/5 transition-colors">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-white/40 p-4">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs">Upload cover</p>
                    </div>
                  )}
                </div>
                <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            </div>

            <div>
              <label htmlFor="comic-title" className="block text-sm font-medium text-white/70 mb-2">
                Title *
              </label>
              <input
                id="comic-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                placeholder="Your comic title"
                maxLength={150}
              />
            </div>

            <div>
              <label htmlFor="comic-description" className="block text-sm font-medium text-white/70 mb-2">
                Description
              </label>
              <textarea
                id="comic-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="What is this comic about?"
                maxLength={1000}
              />
            </div>

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

            {/* AI toggle */}
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)", boxSizing: "border-box" }}>
  <div>
    <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>
      AI Generated Content
    </p>
    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
      Turn on if this comic uses AI generated artwork
    </p>
  </div>
  <button
    type="button"
    onClick={() => setIsAiGenerated(v => !v)}
    style={{
      width: "48px", height: "26px", borderRadius: "13px", border: "none", cursor: "pointer", flexShrink: 0,
      background: isAiGenerated ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "rgba(255,255,255,0.1)",
      position: "relative", transition: "background 0.2s",
    }}
  >
    <span style={{
      position: "absolute", top: "3px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
      transition: "left 0.2s", left: isAiGenerated ? "25px" : "3px",
    }} />
  </button>
</div>

{isAiGenerated && (
  <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", boxSizing: "border-box" }}>
    <p style={{ color: "#a78bfa", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
      Your comic will be reviewed before publishing. AI comics do not appear in trending and are not eligible for monetization.
    </p>
  </div>
)}

            <button
              type="button"
              onClick={handleNextStep0}
              disabled={!title.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
            >
              Next: Upload Pages
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Upload Pages */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-white">Upload Pages</h1>
              <button type="button" onClick={() => setStep(0)} className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-8 text-center bg-white/5 transition-colors">
                <Upload className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                <p className="text-white font-medium mb-1">Drop pages here or click to upload</p>
                <p className="text-white/40 text-sm">Max 100 images • JPG, PNG, WebP</p>
              </div>
              <input type="file" accept="image/*" multiple onChange={handlePagesChange} className="hidden" />
            </label>

            {pagePreviews.length > 0 && (
              <div>
                <p className="text-white/60 text-sm mb-3">
                  {pagePreviews.length} page{pagePreviews.length !== 1 ? "s" : ""} selected
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-80 overflow-y-auto">
                  {pagePreviews.map((src, idx) => (
                    <div key={`page-${idx}-${src.slice(-8)}`} className="relative aspect-[9/14] rounded-lg overflow-hidden group">
                      <img src={src} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removePage(idx)} className="p-1 rounded-full bg-red-500/80 hover:bg-red-500">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => { if (pages.length > 0) { setError(""); setStep(2); } else setError("Please upload at least one page"); }}
              disabled={pages.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
            >
              Next: Review &amp; Publish
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Review & Publish */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-white">Review &amp; Publish</h1>
              <button type="button" onClick={() => setStep(1)} className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex gap-4">
              {coverPreview && (
                <img src={coverPreview} alt={title} className="w-20 h-28 object-cover rounded-lg flex-shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-white">{title}</h3>
                {description && <p className="text-white/60 text-sm mt-1 line-clamp-2">{description}</p>}
                <p className="text-purple-400 text-sm mt-2">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {isSubmitting && (
              <div>
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Uploading pages...</span>
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

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Publish Comic
                </>
              )}
            </button>
          </div>
        )}

        {error && step !== 2 && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
                      }
