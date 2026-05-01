import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Download,
  GripVertical,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type StitchState =
  | "idle"
  | "selecting"
  | "reordering"
  | "stitching"
  | "preview"
  | "done";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onImagesUploaded: (imageUrls: string[]) => void;
  chapterIndex: number;
}

export function ImageStitchingModal({
  open,
  onClose,
  onImagesUploaded,
  chapterIndex,
}: Props) {
  const [state, setState] = useState<StitchState>("idle");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [stitchedUrl, setStitchedUrl] = useState<string | null>(null);
  const [stitchedBlob, setStitchedBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Touch reorder state
  const touchDragIndex = useRef<number | null>(null);
  const touchStartY = useRef(0);
  const itemHeight = useRef(0);

  const handleReset = () => {
    // Revoke old preview URLs
    for (const img of images) URL.revokeObjectURL(img.previewUrl);
    if (stitchedUrl) URL.revokeObjectURL(stitchedUrl);
    setImages([]);
    setStitchedUrl(null);
    setStitchedBlob(null);
    setProgress(0);
    setProgressLabel("");
    setError(null);
    setDragIndex(null);
    setDragOverIndex(null);
    setState("idle");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    const newItems: ImageItem[] = imageFiles.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setImages((prev) => {
      const updated = [...prev, ...newItems];
      if (updated.length > 0) setState("reordering");
      return updated;
    });
    setError(null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      const next = prev.filter((img) => img.id !== id);
      if (next.length === 0) setState("idle");
      return next;
    });
  };

  // HTML5 Drag-and-drop reorder
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Touch reorder
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchDragIndex.current = index;
    touchStartY.current = e.touches[0].clientY;
    const el = e.currentTarget as HTMLElement;
    itemHeight.current = el.getBoundingClientRect().height;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchDragIndex.current === null) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const steps = Math.round(deltaY / (itemHeight.current || 80));
    const newIndex = Math.max(
      0,
      Math.min(images.length - 1, touchDragIndex.current + steps),
    );
    setDragOverIndex(newIndex);
  };

  const handleTouchEnd = () => {
    if (
      touchDragIndex.current !== null &&
      dragOverIndex !== null &&
      touchDragIndex.current !== dragOverIndex
    ) {
      const from = touchDragIndex.current;
      const to = dragOverIndex;
      setImages((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    }
    touchDragIndex.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const stitchImages = async () => {
    if (images.length === 0) return;
    setState("stitching");
    setProgress(0);
    setError(null);

    try {
      // Load all images
      const loaded: HTMLImageElement[] = await Promise.all(
        images.map(
          (item, i) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new window.Image();
              img.onload = () => {
                setProgress(Math.round(((i + 1) / images.length) * 40));
                setProgressLabel(`Loading image ${i + 1}/${images.length}...`);
                resolve(img);
              };
              img.onerror = () =>
                reject(new Error(`Failed to load image ${i + 1}`));
              img.src = item.previewUrl;
            }),
        ),
      );

      // Calculate canvas dimensions
      const maxWidth = Math.max(...loaded.map((img) => img.naturalWidth));
      const totalHeight = loaded.reduce((sum, img) => {
        const scale = maxWidth / img.naturalWidth;
        return sum + Math.round(img.naturalHeight * scale);
      }, 0);

      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, maxWidth, totalHeight);

      let yOffset = 0;
      for (let i = 0; i < loaded.length; i++) {
        const img = loaded[i];
        const scale = maxWidth / img.naturalWidth;
        const drawHeight = Math.round(img.naturalHeight * scale);
        ctx.drawImage(img, 0, yOffset, maxWidth, drawHeight);
        yOffset += drawHeight;
        const pct = 40 + Math.round(((i + 1) / loaded.length) * 50);
        setProgress(pct);
        setProgressLabel(`Stitching panel ${i + 1}/${loaded.length}...`);
        // Yield to allow UI update
        await new Promise((r) => setTimeout(r, 0));
      }

      setProgress(95);
      setProgressLabel("Finalizing...");

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
          "image/jpeg",
          0.92,
        );
      });

      const url = URL.createObjectURL(blob);
      setStitchedBlob(blob);
      setStitchedUrl(url);
      setProgress(100);
      setProgressLabel("Stitched successfully!");
      setState("preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Stitching failed. Please try again.",
      );
      setState("reordering");
    }
  };

  const handleDownload = () => {
    if (!stitchedUrl || !stitchedBlob) return;
    const a = document.createElement("a");
    a.href = stitchedUrl;
    a.download = `chapter-${chapterIndex + 1}-stitched.jpg`;
    a.click();
    toast.success("Image downloaded!");
  };

  const handleUploadToChapter = () => {
    if (!stitchedUrl) return;
    onImagesUploaded([stitchedUrl]);
    toast.success("Chapter images updated!", {
      description: "Stitched image added to your chapter.",
    });
    setState("done");
  };

  const isIdle = state === "idle";
  const isReordering = state === "reordering";
  const isStitching = state === "stitching";
  const isPreview = state === "preview";
  const isDone = state === "done";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="modal-glass max-w-2xl w-full sm:max-w-2xl p-0 overflow-hidden animate-scale-in gap-0 max-h-[92vh] flex flex-col"
        data-ocid="stitch.dialog"
      >
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/40 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display font-bold text-lg text-foreground">
              Image Stitching Zone
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
              aria-label="Close modal"
              data-ocid="stitch.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {images.length > 0 && !isStitching && !isPreview && !isDone && (
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-primary font-semibold">
                {images.length} image{images.length !== 1 ? "s" : ""}
              </span>{" "}
              selected — drag to reorder
            </p>
          )}
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Drop Zone — shown when not stitching/done */}
          {!isStitching && !isPreview && !isDone && (
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-smooth ${
                isDragOver
                  ? "drop-zone-active border-primary"
                  : "border-border/60 hover:border-primary/50 hover:bg-primary/5"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDropZoneDrop}
              data-ocid="stitch.dropzone"
            >
              <label
                className="flex flex-col items-center justify-center py-8 px-4 gap-2 cursor-pointer select-none w-full"
                htmlFor="stitch-file-input"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-smooth ${isDragOver ? "bg-primary/20" : "bg-muted/60"}`}
                >
                  <ImagePlus
                    className={`w-6 h-6 ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {isIdle
                    ? "Drag & Drop or Click to Upload"
                    : "Add More Images"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP — multiple selection supported
                </p>
              </label>
              <input
                id="stitch-file-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                data-ocid="stitch.file_input"
              />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
              data-ocid="stitch.error_state"
            >
              {error}
            </div>
          )}

          {/* Thumbnail grid with drag reorder */}
          {isReordering && images.length > 0 && (
            <div className="space-y-2" data-ocid="stitch.image_list">
              {images.map((img, index) => {
                const isActive = dragIndex === index;
                const isOver = dragOverIndex === index && dragIndex !== index;
                return (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`flex items-center gap-3 rounded-xl border p-2 transition-smooth cursor-grab active:cursor-grabbing ${
                      isActive
                        ? "drag-item-active border-primary/50 bg-primary/10 shadow-glow"
                        : isOver
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted/20"
                    }`}
                    data-ocid={`stitch.image_item.${index + 1}`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img
                        src={img.previewUrl}
                        alt={`Panel ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Panel {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {img.file.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0"
                      aria-label={`Remove panel ${index + 1}`}
                      data-ocid={`stitch.remove_image_button.${index + 1}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stitching progress */}
          {isStitching && (
            <div className="py-6 space-y-5" data-ocid="stitch.loading_state">
              {/* Mini thumbnail grid preview */}
              <div className="grid grid-cols-3 gap-1.5">
                {images.slice(0, 6).map((img) => (
                  <div
                    key={img.id}
                    className="aspect-[3/4] rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={img.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden relative">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Shimmer overlay */}
                    <div
                      className="absolute inset-0 opacity-40 animate-[progress-shimmer_2s_linear_infinite] [background-size:200px_100%]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, oklch(var(--foreground) / 0.3), transparent)",
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {progressLabel}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-1">
                    {progress}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {(isPreview || isDone) && stitchedUrl && (
            <div className="space-y-4">
              {/* Success banner */}
              <div
                className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/30 px-4 py-3"
                data-ocid="stitch.success_state"
              >
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Stitched Successfully
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {images.length} panels merged into one page
                  </p>
                </div>
              </div>

              {/* Mini panel grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="aspect-[3/4] rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`Panel ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Stitched preview */}
              <div className="rounded-xl overflow-hidden border border-border/40 bg-muted max-h-56">
                <img
                  src={stitchedUrl}
                  alt="Stitched chapter preview"
                  className="w-full object-contain max-h-56"
                  data-ocid="stitch.preview_image"
                />
              </div>

              {isDone && (
                <p className="text-sm text-center text-muted-foreground">
                  Chapter updated. You can stitch another batch or close.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 pb-5 pt-4 border-t border-border/40 shrink-0 space-y-3">
          {/* Reordering actions */}
          {isReordering && images.length > 0 && (
            <div className="flex gap-2">
              <label
                htmlFor="stitch-file-input"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-background hover:bg-muted/40 transition-smooth cursor-pointer"
                data-ocid="stitch.add_more_button"
              >
                <ImagePlus className="w-3.5 h-3.5" /> Add More
              </label>
              <Button
                type="button"
                className="flex-1 gradient-primary text-primary-foreground border-0 rounded-xl font-semibold gap-2 shadow-glow"
                onClick={stitchImages}
                data-ocid="stitch.stitch_button"
              >
                <Upload className="w-4 h-4" />
                Stitch {images.length} Panel{images.length !== 1 ? "s" : ""}
              </Button>
            </div>
          )}

          {/* Preview/Done actions */}
          {(isPreview || isDone) && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                className="flex-1 gradient-primary text-primary-foreground border-0 rounded-xl font-semibold gap-2 shadow-glow"
                onClick={handleUploadToChapter}
                disabled={isDone}
                data-ocid="stitch.upload_button"
              >
                <Upload className="w-4 h-4" />
                {isDone ? "Added to Chapter ✓" : "Auto-upload to Chapter"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl font-semibold gap-2"
                onClick={handleDownload}
                data-ocid="stitch.download_button"
              >
                <Download className="w-4 h-4" />
                Download Stitched Image
              </Button>
            </div>
          )}

          {(isPreview || isDone) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full rounded-xl text-xs text-muted-foreground"
              onClick={handleReset}
              data-ocid="stitch.stitch_another_button"
            >
              Stitch Another Batch
            </Button>
          )}

          {/* Idle state CTA */}
          {isIdle && (
            <label
              htmlFor="stitch-file-input"
              className="w-full gradient-primary text-primary-foreground rounded-xl font-semibold gap-2 shadow-glow h-10 flex items-center justify-center cursor-pointer transition-smooth hover:opacity-90 select-none"
              data-ocid="stitch.open_gallery_button"
            >
              <ImagePlus className="w-4 h-4" />
              Select Images from Gallery
            </label>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
