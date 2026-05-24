import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertCircle, ArrowDown, ArrowUp, Eye, GripVertical, Info, Save, Trash2, Upload, X } from "lucide-react";
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
import { toast } from "sonner";

interface PageItem {
  id: string;
  file: File;
  preview: string;
}

function UploadTipBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-900/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="text-purple-300 text-sm font-semibold">Best way to upload your comic</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-1.5 pl-6">
        <p className="text-white/70 text-xs flex items-center gap-2">
          <span className="text-purple-400">▪</span>
          Each image should have <strong className="text-white">3 panels</strong>
        </p>
        <p className="text-white/70 text-xs flex items-center gap-2">
          <span className="text-purple-400">▪</span>
          Use <strong className="text-white">portrait format</strong> (tall, not wide)
        </p>
        <p className="text-white/70 text-xs flex items-center gap-2">
          <span className="text-purple-400">▪</span>
          Keep file size <strong className="text-white">under 10MB</strong> per image
        </p>
        <p className="text-white/70 text-xs flex items-center gap-2">
          <span className="text-purple-400">▪</span>
          Use <strong className="text-white">JPG or PNG</strong> format only
        </p>
        <p className="text-white/70 text-xs flex items-center gap-2">
          <span className="text-purple-400">▪</span>
          Clear lines and good contrast = <strong className="text-white">better reading experience</strong>
        </p>
      </div>
    </div>
  );
}

function SortablePage({
  item,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: PageItem;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-[9/14] rounded-lg overflow-hidden border-2 ${
        isDragging ? "border-purple-500" : "border-white/10"
      } group`}
    >
      <img
        src={item.preview}
        alt={`Page ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 p-1 rounded bg-black/60 text-white/70 hover:text-white cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3 text-white" />
      </button>
      <div className="absolute bottom-1 left-1 text-xs text-white bg-black/60 rounded px-1">
        {index + 1}
      </div>
      <div className="absolute bottom-1 right-1 flex flex-col gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-0.5 rounded bg-black/60 text-white/70 hover:text-white disabled:opacity-30"
        >
          <ArrowUp className="w-2.5 h-2.5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-0.5 rounded bg-black/60 text-white/70 hover:text-white disabled:opacity-30"
        >
          <ArrowDown className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

export function EditChapterPage() {
  const { comicId, chapterId } = useParams({
    from: "/creator/comics/$comicId/chapters/$chapterId",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: chapter, isLoading } = useChapter(comicId, chapterId);

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [pages, setPages] = useState<PageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  useEffect(() => {
    if (chapter) {
      setChapterTitle(chapter.title ?? "");
      setChapterNumber(String(chapter.chapter_number));
    }
  }, [chapter]);

  const existingPages = chapter?.pages ?? [];

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 100);
    const items: PageItem[] = files.map((file, i) => ({
      id: `page-${Date.now()}-${i}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPages(items);
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPages((prev) => arrayMove(prev, index, index - 1));
  };

  const moveDown = (index: number) => {
    if (index === pages.length - 1) return;
    setPages((prev) => arrayMove(prev, index, index + 1));
  };

  const handleDragStart = ({ active }: { active: { id: string } }) => {
    setActiveId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setPages((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const activeItem = pages.find((p) => p.id === activeId);

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
      toast.success("Chapter info saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAndPublish = async () => {
    if (pages.length === 0) return;
    setIsUploading(true);
    setError("");
    setUploadProgress(0);
    const uploadedPaths: string[] = [];
    const imageUrls: string[] = [];
    try {
      for (let i = 0; i < pages.length; i++) {
        const url = await uploadChapterPage(comicId, chapterId, i, pages[i].file);
        imageUrls.push(url);
        uploadedPaths.push(
          `${comicId}/${chapterId}/${String(i).padStart(4, "0")}.${pages[i].file.name.split(".").pop()}`,
        );
        setUploadProgress(Math.round(((i + 1) / pages.length) * 90));
      }
      await commitChapterUpload(chapterId, imageUrls);
      setUploadProgress(100);
      toast.success("Chapter uploaded and published!");
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      setPages([]);
      navigate({ to: `/creator/comics/${comicId}/edit` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      if (uploadedPaths.length > 0) {
        await rollbackChapterUpload(comicId, chapterId, uploadedPaths).catch(() => {});
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

  void publishChapter;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
        <div className="text-center text-white/60">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Chapter not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
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

        {/* Upload Tip Banner */}
        {showTip && <UploadTipBanner onDismiss={() => setShowTip(false)} />}

        {/* Metadata */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Chapter Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="chapter-number-input" className="block text-sm font-medium text-white/70 mb-2">
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
              <label htmlFor="chapter-title-input" className="block text-sm font-medium text-white/70 mb-2">
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
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Info
          </button>
        </div>

        {/* Existing pages */}
        {existingPages.length > 0 && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Current Pages ({existingPages.length})</h2>
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
                {existingPages.map((page: { id: string; image_url: string }, idx: number) => (
                  <div key={page.id} className="relative aspect-[9/14] rounded-lg overflow-hidden">
                    <img src={page.image_url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1">
                      {idx + 1}
                    </div>
                  </div>
                ))}
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
              <p className="text-white/70 text-sm">Click to select pages (max 100)</p>
            </div>
            <input type="file" accept="image/*" multiple onChange={handlePagesChange} className="hidden" />
          </label>

          {pages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/60 text-sm">{pages.length} pages — drag to reorder</p>
                <p className="text-white/40 text-xs">Use ↑↓ buttons on mobile</p>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
                    {pages.map((item, idx) => (
                      <SortablePage
                        key={item.id}
                        item={item}
                        index={idx}
                        total={pages.length}
                        onRemove={() => removePage(item.id)}
                        onMoveUp={() => moveUp(idx)}
                        onMoveDown={() => moveDown(idx)}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeItem && (
                    <div className="aspect-[9/14] w-20 rounded-lg overflow-hidden border-2 border-purple-500 shadow-xl rotate-3">
                      <img src={activeItem.preview} alt="Dragging" className="w-full h-full object-cover" />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>

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
                style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload &amp; Publish ({pages.length} pages)
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
