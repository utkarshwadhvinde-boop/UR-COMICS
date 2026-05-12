import { ChapterStatus } from "@/backend";
import { ChapterPreviewModal } from "@/components/ui/ChapterPreviewModal";
import { ALL_GENRES, GenreChip } from "@/components/ui/GenreChip";
import { ImageStitchingModal } from "@/components/ui/ImageStitchingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  isStoppedCanisterError,
  useCreateChapter,
  useCreateComic,
  useListChapters,
  usePublishChapter,
  useUpdateChapter,
  useUpdateComic,
} from "@/hooks/useComicBackend";
import {
  uploadFileToStorage,
  validateAndCoerceImageFile,
} from "@/lib/storageUpload";
import { useAppStore } from "@/store";
import type { Comic, ComicStatus, Genre } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Eye,
  ImagePlus,
  Layers,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type PendingImage = {
  preview: string;
  file: File | null;
  permanentUrl: string | null;
};

type ChapterDraft = {
  title: string;
  images: PendingImage[];
  imageOrder: number[];
  orderLocked: boolean;
  backendId: bigint | null;
  chapterNumber: number;
  status: "draft" | "published";
};

type UploadProgress = { done: number; total: number };

// ─── Status Toggle ──────────────────────────────────────────────────────────

function StatusToggle({
  value,
  onChange,
}: {
  value: ComicStatus;
  onChange: (v: ComicStatus) => void;
}) {
  const options: { value: ComicStatus; label: string; color: string }[] = [
    { value: "ongoing", label: "Ongoing", color: "bg-primary text-primary-foreground" },
    { value: "completed", label: "Completed", color: "bg-accent text-accent-foreground" },
    { value: "hiatus", label: "Hiatus", color: "bg-muted text-muted-foreground" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            value === opt.value
              ? `${opt.color} border-transparent shadow-md`
              : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Upload Progress ─────────────────────────────────────────────────────────

function UploadProgressBar({ progress }: { progress: UploadProgress }) {
  if (progress.total === 0) return null;
  const pct = Math.min(100, Math.round((progress.done / progress.total) * 100));
  
  return (
    <div className="rounded-xl bg-muted/40 border border-border px-4 py-3 w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-foreground">
          Processing {progress.done} / {progress.total}
        </span>
        <span className="text-xs font-bold text-primary">{pct}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Draggable Thumbnail Strip ───────────────────────────────────────────────

function PageThumbnailRow({
  images,
  imageOrder,
  locked,
  onDrop,
}: {
  images: PendingImage[];
  imageOrder: number[];
  locked: boolean;
  onDrop: (fromPos: number, toPos: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mt-3 no-scrollbar">
      {imageOrder.map((imgIdx, pos) => {
        const img = images[imgIdx];
        if (!img) return null;
        return (
          <div
            key={`${pos}-${imgIdx}`}
            draggable={!locked}
            onDragStart={() => !locked && setDragging(pos)}
            onDragOver={(e) => { e.preventDefault(); !locked && setOver(pos); }}
            onDrop={(e) => {
              e.preventDefault();
              if (!locked && dragging !== null && dragging !== pos) onDrop(dragging, pos);
              setDragging(null);
              setOver(null);
            }}
            className={`relative shrink-0 w-16 h-24 rounded-xl overflow-hidden border-2 transition-all ${
              locked ? "border-border" : dragging === pos ? "opacity-30 scale-95" : over === pos ? "border-primary scale-105" : "border-border"
            }`}
          >
            <img src={img.preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center justify-center">
              {pos + 1}
            </div>
            {img.permanentUrl && (
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PublishConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isLoading,
  isActorReady,
  progress,
  error,
  onDismissError,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isActorReady: boolean;
  progress: UploadProgress;
  error: string | null;
  onDismissError: () => void;
}) {
  if (!open) return null;

  const isServiceDown = error?.includes("IC0508") || error?.toLowerCase().includes("stopped");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md px-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-[2rem] p-8 max-w-sm w-full shadow-2xl shadow-primary/10">
        <div className="text-4xl text-center mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-center mb-2">Publish Chapter</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Your content will be live for all readers instantly.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive animate-in slide-in-from-top-2">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div className="text-xs font-medium leading-relaxed">
                {isServiceDown ? "The publishing service is under maintenance. Please try again in a few minutes." : error}
              </div>
            </div>
            <button onClick={onDismissError} className="mt-3 text-[10px] font-bold uppercase tracking-wider opacity-70 hover:opacity-100">
              Dismiss Error
            </button>
          </div>
        )}

        {(isLoading || !isActorReady) && (
          <div className="space-y-4 mb-6">
            <UploadProgressBar progress={progress} />
            <p className="text-center text-[10px] text-muted-foreground animate-pulse font-medium uppercase tracking-widest">
              {isLoading ? "Syncing with Blockchain..." : "Connecting to Backend..."}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            className="flex-1 gradient-primary text-white rounded-xl h-12 shadow-lg shadow-primary/20" 
            onClick={onConfirm} 
            disabled={isLoading || !isActorReady || !!isServiceDown}
          >
            {isLoading ? "Wait..." : error ? "Retry" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChapterEditor({
  chapters,
  isPublishing,
  onAdd,
  onRemove,
  onChange,
  onStitchImages,
  onThumbnailDrop,
  onImageUpload,
  onPreview,
}: {
  chapters: ChapterDraft[];
  isPublishing: boolean;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: "title" | "chapterNumber", val: string) => void;
  onStitchImages: (chapterIndex: number) => void;
  onThumbnailDrop: (chapterIdx: number, fromPos: number, toPos: number) => void;
  onImageUpload: (chapterIdx: number, files: File[]) => void;
  onPreview: (chapterIdx: number) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Chapters</h3>
        <Button size="sm" variant="ghost" onClick={onAdd} disabled={isPublishing} className="rounded-full text-primary hover:bg-primary/5 font-bold">
          <Plus className="w-4 h-4 mr-1" /> Add Chapter
        </Button>
      </div>

      <div className="space-y-3">
        {chapters.map((ch, i) => (
          <div key={i} className="group rounded-3xl border border-border bg-card/50 overflow-hidden transition-all hover:border-primary/20">
            <div 
              className="flex items-center gap-3 px-5 py-4 cursor-pointer"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {ch.chapterNumber}
              </div>
              <input
                value={ch.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onChange(i, "title", e.target.value)}
                placeholder="Chapter Title"
                className="flex-1 bg-transparent border-none text-sm font-semibold focus:ring-0 placeholder:text-muted-foreground/50"
              />
              <Badge variant={ch.status === "published" ? "default" : "outline"} className="rounded-full text-[10px]">
                {ch.status}
              </Badge>
              {chapters.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); onRemove(i); }} className="p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {expanded === i && (
              <div className="px-5 pb-5 pt-2 border-t border-border/40 animate-in slide-in-from-top-1">
                {!ch.orderLocked ? (
                  <label className="flex flex-col items-center justify-center w-full py-8 rounded-2xl border-2 border-dashed border-border bg-muted/20 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all">
                    <ImagePlus className="w-6 h-6 text-primary/60 mb-2" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {ch.images.length > 0 ? `${ch.images.length} Pages Loaded` : "Upload Pages"}
                    </span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && onImageUpload(i, Array.from(e.target.files))} />
                  </label>
                ) : (
                  <div className="py-3 px-4 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-primary font-medium">
                    Order locked for publishing stability.
                  </div>
                )}

                <PageThumbnailRow images={ch.images} imageOrder={ch.imageOrder} locked={ch.orderLocked} onDrop={(f, t) => onThumbnailDrop(i, f, t)} />

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="secondary" className="rounded-xl text-xs flex-1" onClick={() => onPreview(i)} disabled={ch.images.length === 0}>
                    <Eye className="w-3.5 h-3.5 mr-2" /> Preview
                  </Button>
                  {!ch.orderLocked && (
                    <Button size="sm" variant="outline" className="rounded-xl text-xs flex-1" onClick={() => onStitchImages(i)}>
                      <Layers className="w-3.5 h-3.5 mr-2" /> Stitch
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const ASYNC_TIMEOUT = 60000; // 60 seconds

async function withTimeout<T>(promise: Promise<T>, message = "Operation timed out"): Promise<T> {
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ASYNC_TIMEOUT));
  return Promise.race([promise, timeout]);
}

export default function CreatePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { edit?: string };
  const { currentUser, comics, addComic } = useAppStore();
  const editId = search?.edit;

  // State Management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [status, setStatus] = useState<ComicStatus>("ongoing");
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);

  // Workflow State
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ done: 0, total: 0 });
  
  // Modals
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [publishSuccessOpen, setPublishSuccessOpen] = useState(false);
  const [stitchModalOpen, setStitchModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const isPublishingRef = useRef(false);
  const [backendComicId, setBackendComicId] = useState<bigint | null>(null);

  const mutations = {
    createComic: useCreateComic(),
    updateComic: useUpdateComic(),
    createChapter: useCreateChapter(),
    updateChapter: useUpdateChapter(),
    publishChapter: usePublishChapter()
  };

  const isActorReady = mutations.createComic.isActorReady;

  // Helper: Reset all loading states (Crucial for fixing Infinite Loading)
  const resetAppStates = useCallback(() => {
    setIsPublishing(false);
    setIsSaving(false);
    isPublishingRef.current = false;
    setUploadProgress({ done: 0, total: 0 });
  }, []);

  const uploadChapterImages = async (
    ch: ChapterDraft,
    comicId: bigint,
    chapterId: bigint,
    onProgress: (done: number) => void
  ): Promise<PendingImage[]> => {
    const updated: PendingImage[] = [...ch.images];
    const timestamp = Date.now();

    for (let i = 0; i < ch.images.length; i++) {
      const img = ch.images[i];
      if (img.permanentUrl) {
        onProgress(i + 1);
        continue;
      }

      if (!img.file) throw new Error(`Missing file for page ${i + 1} in ${ch.title}`);

      const ext = img.file.name.split(".").pop() || "jpg";
      const fileName = `${comicId}/${chapterId}/${timestamp}-${i}.${ext}`;
      const renamedFile = new File([img.file], fileName, { type: img.file.type });

      try {
        const url = await withTimeout(uploadFileToStorage(renamedFile), "Image upload timed out");
        updated[i] = { ...img, permanentUrl: url, preview: url };
        onProgress(i + 1);
      } catch (err) {
        throw new Error(`Upload failed for page ${i + 1}: ${err instanceof Error ? err.message : "Network error"}`);
      }
    }
    return updated;
  };

  const doSaveDraft = async (silent = false) => {
    if (!title.trim() || isSaving || isPublishing) return;
    setIsSaving(true);
    try {
      const comicInput = {
        title: title.trim(),
        description: description.trim(),
        author: currentUser?.username || "Anonymous",
        coverUrl: coverUrl || "/placeholder.jpg",
        genres: selectedGenres,
        isPremium: false,
        isFeatured: false,
        isTrending: false,
        isPinned: false,
        ownerUploaded: false,
        creatorId: currentUser?.id || "anonymous"
      };

      let currentId = backendComicId;
      if (!currentId) {
        currentId = await withTimeout(mutations.createComic.mutateAsync(comicInput), "Creating comic failed");
        setBackendComicId(currentId);
      } else {
        await withTimeout(mutations.updateComic.mutateAsync({ id: currentId, input: comicInput }), "Updating comic failed");
      }

      if (!silent) toast.success("Draft saved successfully.");
      return currentId;
    } catch (err) {
      if (!silent) toast.error("Save failed: Check your connection.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishConfirm = async () => {
    if (isPublishingRef.current || !isActorReady) return;
    
    isPublishingRef.current = true;
    setIsPublishing(true);
    setPublishError(null);
    console.log("[Engine] Starting atomic publish...");

    try {
      // 1. Validation Pre-flight
      if (chapters.some(c => c.images.length === 0)) throw new Error("Some chapters have no pages.");
      
      // 2. Ensure Comic Record
      const comicId = await doSaveDraft(true);
      if (!comicId) throw new Error("Failed to initialize comic record.");

      // 3. Create Chapter Records (ID allocation)
      const chaptersWithIds = [];
      for (const ch of chapters) {
        let chapId = ch.backendId;
        if (!chapId) {
          chapId = await withTimeout(mutations.createChapter.mutateAsync({
            title: ch.title,
            chapterNumber: BigInt(ch.chapterNumber),
            images: [],
            imageKeys: [],
            imageOrder: ch.imageOrder.map(BigInt),
            comicId,
            creatorId: currentUser?.id || "anonymous",
            chapterStatus: ChapterStatus.draft
          }), `Failed to create record for Chapter ${ch.chapterNumber}`);
        }
        chaptersWithIds.push({ ...ch, backendId: chapId });
      }

      // 4. Atomic Image Uploads
      const chaptersWithUploads = [];
      let totalDone = 0;
      const totalImages = chaptersWithIds.reduce((s, c) => s + c.images.length, 0);
      setUploadProgress({ done: 0, total: totalImages });

      for (const ch of chaptersWithIds) {
        const uploadedImages = await uploadChapterImages(ch, comicId, ch.backendId!, (doneInChapter) => {
          setUploadProgress({ done: totalDone + doneInChapter, total: totalImages });
        });
        totalDone += ch.images.length;
        chaptersWithUploads.push({ ...ch, images: uploadedImages });
      }

      // 5. Finalize and Publish
      for (const ch of chaptersWithUploads) {
        const orderedUrls = ch.imageOrder.map(idx => ch.images[idx].permanentUrl || "");
        await withTimeout(mutations.updateChapter.mutateAsync({
          id: ch.backendId!,
          input: {
            title: ch.title,
            chapterNumber: BigInt(ch.chapterNumber),
            images: orderedUrls,
            imageKeys: orderedUrls,
            imageOrder: ch.imageOrder.map(BigInt),
            comicId,
            creatorId: currentUser?.id || "anonymous",
            chapterStatus: ChapterStatus.draft
          }
        }), "Failed to finalize image links");

        await withTimeout(mutations.publishChapter.mutateAsync(ch.backendId!), `Publishing ${ch.title} failed`);
      }

      setPublishConfirmOpen(false);
      setPublishSuccessOpen(true);
      toast.success("Success! Your comic is now live.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setPublishError(msg);
      toast.error("Publishing halted.");
    } finally {
      resetAppStates();
    }
  };

  // UI Helper functions
  const handleImageUpload = (chapterIdx: number, files: File[]) => {
    const valid = files.filter(f => f.size < 15 * 1024 * 1024);
    if (valid.length !== files.length) toast.warning("Some files were skipped (Max 15MB).");
    
    setChapters(prev => prev.map((ch, i) => {
      if (i !== chapterIdx) return ch;
      const newImages = valid.map(f => ({ preview: URL.createObjectURL(f), file: f, permanentUrl: null }));
      const startIdx = ch.images.length;
      return {
        ...ch,
        images: [...ch.images, ...newImages],
        imageOrder: [...ch.imageOrder, ...newImages.map((_, j) => startIdx + j)]
      };
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Creator Portal</h1>
          <p className="text-muted-foreground font-medium">Drafting: <span className="text-foreground">{title || "Untitled Comic"}</span></p>
        </div>
        <Badge variant="outline" className="h-8 rounded-full px-4 border-primary/20 text-primary">v2.0 Stable</Badge>
      </header>

      <div className="grid gap-8">
        <section className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
          <div className="grid md:grid-cols-[240px_1fr] gap-10">
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Cover Art</Label>
              <div 
                className="aspect-[3/4] rounded-3xl bg-muted/30 border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-all"
                onClick={() => document.getElementById('cover-in')?.click()}
              >
                {coverPreview ? <img src={coverPreview} className="w-full h-full object-cover" /> : <ImagePlus className="w-8 h-8 text-muted-foreground" />}
                <input id="cover-in" type="file" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setCoverPreview(URL.createObjectURL(f)); setCoverUrl(""); /* Upload logic here */ }
                }} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Comic Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g., The Midnight Alchemist" className="h-14 rounded-2xl text-lg font-bold border-none bg-muted/30 focus:bg-background transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Synopsis</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell your readers what it's about..." className="min-h-[120px] rounded-2xl border-none bg-muted/30 focus:bg-background transition-all resize-none" />
              </div>
              <StatusToggle value={status} onChange={setStatus} />
            </div>
          </div>
        </section>

        <section className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
          <ChapterEditor 
            chapters={chapters} 
            isPublishing={isPublishing}
            onAdd={() => setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, images: [], imageOrder: [], orderLocked: false, backendId: null, chapterNumber: chapters.length + 1, status: "draft" }])}
            onRemove={(idx) => setChapters(chapters.filter((_, i) => i !== idx))}
            onChange={(i, f, v) => setChapters(chapters.map((c, idx) => idx === i ? { ...c, [f]: f === "chapterNumber" ? parseInt(v) : v } : c))}
            onImageUpload={handleImageUpload}
            onPreview={(idx) => { /* Preview Logic */ }}
            onStitchImages={() => setStitchModalOpen(true)}
            onThumbnailDrop={(cIdx, f, t) => {
              const newChapters = [...chapters];
              const order = [...newChapters[cIdx].imageOrder];
              const [moved] = order.splice(f, 1);
              order.splice(t, 0, moved);
              newChapters[cIdx].imageOrder = order;
              setChapters(newChapters);
            }}
          />
        </section>

        <footer className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button variant="outline" className="flex-1 h-16 rounded-[1.25rem] font-bold text-base" onClick={() => doSaveDraft()}>
            <Save className="w-5 h-5 mr-2" /> Save Draft
          </Button>
          <Button className="flex-[2] h-16 rounded-[1.25rem] font-bold text-base gradient-primary shadow-xl shadow-primary/20" onClick={() => setPublishConfirmOpen(true)}>
            <Upload className="w-5 h-5 mr-2" /> {isPublishing ? "Publishing..." : "Launch Comic"}
          </Button>
        </footer>
      </div>

      <PublishConfirmDialog 
        open={publishConfirmOpen}
        onConfirm={handlePublishConfirm}
        onCancel={() => setPublishConfirmOpen(false)}
        isLoading={isPublishing}
        isActorReady={isActorReady}
        progress={uploadProgress}
        error={publishError}
        onDismissError={() => setPublishError(null)}
      />
      
      {/* Modal Placeholders */}
      {stitchModalOpen && <ImageStitchingModal open onClose={() => setStitchModalOpen(false)} onImagesUploaded={() => {}} chapterIndex={0} />}
    </div>
  );
            }
