import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

interface ThumbnailCropperProps {
  file: File;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
}

const CROP_W = 270;
const CROP_H = 480;

export function ThumbnailCropper({
  file,
  onCrop,
  onCancel,
}: ThumbnailCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Load image
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      // Fit image so smallest dimension fills the crop frame
      const sc = Math.max(
        CROP_W / image.naturalWidth,
        CROP_H / image.naturalHeight,
      );
      setScale(sc);
      setOffset({ x: 0, y: 0 });
      setImg(image);
    };
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clampOffset = useCallback(
    (ox: number, oy: number, sc: number, image: HTMLImageElement) => {
      const iw = image.naturalWidth * sc;
      const ih = image.naturalHeight * sc;
      const maxX = 0;
      const minX = CROP_W - iw;
      const maxY = 0;
      const minY = CROP_H - ih;
      return {
        x: Math.min(maxX, Math.max(minX, ox)),
        y: Math.min(maxY, Math.max(minY, oy)),
      };
    },
    [],
  );

  // Draw frame
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    ctx.clearRect(0, 0, CROP_W, CROP_H);
    ctx.drawImage(img, offset.x, offset.y, iw, ih);
    // Dark vignette mask outside crop
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, CROP_W, CROP_H);
    // Clear the crop rectangle
    ctx.clearRect(0, 0, CROP_W, CROP_H);
    ctx.drawImage(img, offset.x, offset.y, iw, ih);
    // Crop border
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CROP_W - 2, CROP_H - 2);
  }, [img, offset, scale]);

  const startDrag = (clientX: number, clientY: number) => {
    dragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  };
  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging.current || !img) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    lastPos.current = { x: clientX, y: clientY };
    setOffset((prev) => clampOffset(prev.x + dx, prev.y + dy, scale, img));
  };
  const endDrag = () => {
    dragging.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) =>
    startDrag(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) =>
    moveDrag(e.clientX, e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (blob) onCrop(blob);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-body text-muted-foreground">
        Drag to reposition · 9:16 crop
      </p>
      <div
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: CROP_W, height: CROP_H }}
        data-ocid="thumbnail_cropper.canvas_target"
      >
        <canvas
          ref={canvasRef}
          width={CROP_W}
          height={CROP_H}
          className="rounded-lg"
          style={{ border: "2px solid #8B5CF6", display: "block" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={endDrag}
        />
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="thumbnail_cropper.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleCrop}
          disabled={!img}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-ocid="thumbnail_cropper.submit_button"
        >
          Crop &amp; Use
        </Button>
      </div>
    </div>
  );
}
