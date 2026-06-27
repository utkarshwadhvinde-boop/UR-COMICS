import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, Pencil, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ChapterUploaderProps {
  onImagesReady: (files: File[]) => void;
  maxImages?: number;
}

export function ChapterUploader({
  onImagesReady,
  maxImages = 50,
}: ChapterUploaderProps) {
  const { user } = useAuth();
  const isOwner = user?.email === "utkarshwadhvinde@gmail.com";
  const MAX_SIZE_BYTES = 60 * 1024 * 1024; // 60MB
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const [stretchMode, setStretchMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (raw: File[], isOwner = false) => {
      const images = raw.filter((f) => f.type.startsWith("image/"));
      setFiles((prev) => {
        const newTotal = isOwner ? 0 : [...prev, ...images].reduce((acc, f) => acc + f.size, 0);
        if (!isOwner && newTotal > MAX_SIZE_BYTES) {
          alert("Episode size limit reached! Max 60MB per chapter.");
          const allowed: File[] = [];
          let size = prev.reduce((acc, f) => acc + f.size, 0);
          for (const f of images) {
            if (size + f.size <= MAX_SIZE_BYTES) { allowed.push(f); size += f.size; }
          }
          const combined = [...prev, ...allowed].slice(0, maxImages);
          setTotalSize(size);
          setPreviews((prevUrls) => {
            const next = [...prevUrls];
            for (let i = prevUrls.length; i < combined.length; i++) next.push(URL.createObjectURL(combined[i]));
            return next;
          });
          return combined;
        }
        const combined = [...prev, ...images].slice(0, maxImages);
        setTotalSize(combined.reduce((acc, f) => acc + f.size, 0));
        setPreviews((prevUrls) => {
          const next = [...prevUrls];
          for (let i = prevUrls.length; i < combined.length; i++) next.push(URL.createObjectURL(combined[i]));
          return next;
        });
        return combined;
      });
    },
    [maxImages, MAX_SIZE_BYTES],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);

  return (
    <div className="flex flex-col gap-5" data-ocid="chapter_uploader.panel">
      {/* Drop zone */}
      <button
        type="button"
        aria-label="Drop images here or click to select"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={[
          "flex flex-col items-center justify-center gap-3 w-full py-12 rounded-xl border-2 border-dashed transition-colors duration-200 cursor-pointer",
          isDragOver
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/60",
        ].join(" ")}
        data-ocid="chapter_uploader.dropzone"
      >
        <Upload className="w-9 h-9 text-muted-foreground" />
        <span className="font-body text-sm text-muted-foreground">
          Drop images here or click to select
        </span>
        <span className="font-mono text-xs text-muted-foreground/60">
          PNG · JPG · WebP
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFileInput}
          data-ocid="chapter_uploader.upload_button"
        />
      </button>

      {/* Page count + controls row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="font-body text-sm text-muted-foreground">
  <span
    className={
      files.length >= maxImages ? "text-destructive" : "text-foreground"
    }
  >
    {files.length}
  </span>
  {" / "}
  {maxImages} pages
  {" · "}
  <span style={{ color: totalSize > MAX_SIZE_BYTES ? "#ff4444" : "rgba(255,255,255,0.5)" }}>
    {(totalSize / (1024 * 1024)).toFixed(1)} MB / 60 MB
  </span>
</span>
        <div className="flex items-center gap-3">
          {files.length > 0 && (
            <button
              type="button"
              onClick={() => setPreviewMode((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-body border border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground transition-colors duration-150"
              data-ocid="chapter_uploader.preview_toggle"
            >
              {previewMode ? (
                <>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Preview
                </>
              )}
            </button>
          )}
          <label
            className="flex items-center gap-2 cursor-pointer select-none"
            data-ocid="chapter_uploader.stretch_toggle"
          >
            <input
              type="checkbox"
              checked={stretchMode}
              onChange={(e) => setStretchMode(e.target.checked)}
              className="sr-only"
            />
            <span
              className={[
                "relative inline-block w-9 h-5 rounded-full transition-colors duration-200",
                stretchMode ? "bg-accent" : "bg-muted",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                  stretchMode ? "translate-x-4" : "",
                ].join(" ")}
              />
            </span>
            <span className="text-sm font-body text-muted-foreground">
              Seamless Stitch
            </span>
          </label>
        </div>
      </div>

      {/* Preview mode: full-size ordered scrollable column */}
      {files.length > 0 && previewMode && (
        <div
          className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1"
          data-ocid="chapter_uploader.preview_panel"
        >
          {files.map((f, i) => (
            <div
              key={`preview-${f.name}-${i}`}
              className="relative rounded-lg overflow-hidden"
              data-ocid={`chapter_uploader.preview.${i + 1}`}
            >
              <img
                src={previews[i]}
                alt={`Page ${i + 1}`}
                className="w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                Page {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Thumbnail grid (edit mode) */}
      {files.length > 0 && !previewMode && (
        <div
          className={[
            "grid grid-cols-4 gap-2",
            stretchMode ? "gap-y-0" : "",
          ].join(" ")}
          data-ocid="chapter_uploader.list"
        >
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="relative group"
              data-ocid={`chapter_uploader.item.${i + 1}`}
            >
              <img
                src={previews[i]}
                alt={`Page ${i + 1}`}
                className={[
                  "w-full object-cover rounded",
                  stretchMode ? "rounded-none" : "aspect-[3/4]",
                ].join(" ")}
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                data-ocid={`chapter_uploader.remove.${i + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1 rounded">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Next button */}
      <Button
        type="button"
        disabled={files.length === 0}
        onClick={() => onImagesReady(files)}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
        data-ocid="chapter_uploader.next_button"
      >
        Next →
      </Button>
    </div>
  );
}
