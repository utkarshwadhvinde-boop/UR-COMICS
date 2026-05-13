import { ExternalBlob, createActor } from "@/backend";
import { ChapterUploader } from "@/components/ChapterUploader";
import { ThumbnailCropper } from "@/components/ThumbnailCropper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { COMICS_QUERY_KEY } from "@/hooks/useComics";
import { createChapter } from "@/services/chaptersService";
import { createComic } from "@/services/comicsService";
import {
  beginUpload,
  commitUpload,
  registerUploadedImage,
  rollbackUpload,
} from "@/services/uploadService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, ImagePlus, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type WizardStep = 1 | 2 | 3 | 4;

const STEP_LABELS = ["Metadata", "Upload Pages", "Publishing", "Done"];
const MAX_RETRIES = 3;

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: WizardStep }) {
  return (
    <div
      className="flex items-center gap-1 mb-8"
      data-ocid="create_comic.step_indicator"
    >
      {STEP_LABELS.map((label, i) => {
        const step = (i + 1) as WizardStep;
        const active = step === current;
        const done = step < current;
        return (
          <div
            key={step}
            className="flex items-center gap-1 flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-display border-2 transition-colors duration-200",
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : done
                      ? "border-accent/40 bg-accent/15 text-accent"
                      : "border-border bg-card text-muted-foreground",
                ].join(" ")}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : step}
              </div>
              <span
                className={[
                  "text-[10px] font-body whitespace-nowrap",
                  active ? "text-accent" : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={[
                  "flex-1 h-px mb-4 transition-colors duration-200",
                  done ? "bg-accent/40" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CreateComicPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  // Wizard state
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1 — Metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Step 2 → 3 state
  const [comicId, setComicId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  // Step 3 — upload progress
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const cancelRef = useRef(false);

  // Step 4 — final IDs for nav
  const [publishedComicId, setPublishedComicId] = useState<string | null>(null);
  const [publishedChapterId, setPublishedChapterId] = useState<string | null>(
    null,
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCroppingFile(file);
  };

  const handleCropDone = (blob: Blob) => {
    const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
    setCoverFile(file);
    const url = URL.createObjectURL(blob);
    setCoverPreview(url);
    setCroppingFile(null);
  };

  // Step 1 → 2: create comic + scaffold chapter
  const handleMetadataNext = async () => {
    if (!actor || !title.trim() || !coverFile) return;
    setIsCreating(true);
    try {
      const bytes = new Uint8Array(await coverFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const comic = await createComic(actor, {
        title: title.trim(),
        description: description.trim(),
        cover_blob: blob,
      });
      // Scaffold chapter 1
      const chapter = await createChapter(actor, {
        comic_id: comic.id,
        title: "Chapter 1",
        number: 1,
      });
      setComicId(comic.id);
      setChapterId(chapter.id);
      await queryClient.invalidateQueries({ queryKey: COMICS_QUERY_KEY });
      setStep(2);
    } catch {
      toast.error("Failed to create comic. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Step 2 → 3: receive files and begin upload pipeline
  const handleImagesReady = async (files: File[]) => {
    if (!actor || !chapterId || !comicId) return;
    setStagedFiles(files);
    setUploadedCount(0);
    setUploadError("");
    cancelRef.current = false;
    setStep(3);
    await runUpload(files, chapterId, comicId);
  };

  const runUpload = async (files: File[], cid: string, comId: string) => {
    if (!actor) return;
    let rollbackTriggered = false;
    try {
      await beginUpload(actor, cid);
      for (let i = 0; i < files.length; i++) {
        if (cancelRef.current) {
          await rollbackUpload(actor, cid).catch(() => 0n);
          setUploadError(
            "Upload cancelled. Comic and chapter have been cleaned up.",
          );
          setStep(4);
          return;
        }
        let attempt = 0;
        let success = false;
        while (attempt < MAX_RETRIES && !success && !cancelRef.current) {
          try {
            if (attempt > 0) {
              await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
            }
            const bytes = new Uint8Array(await files[i].arrayBuffer());
            const blob = ExternalBlob.fromBytes(bytes);
            await registerUploadedImage(actor, cid, blob);
            setUploadedCount((c) => c + 1);
            success = true;
          } catch {
            attempt++;
          }
        }
        if (!success) {
          rollbackTriggered = true;
          const cleaned = await rollbackUpload(actor, cid).catch(() => 0n);
          setUploadError(
            `Image ${i + 1} failed after ${MAX_RETRIES} attempts. Cleaned up ${cleaned} orphaned file(s).`,
          );
          setStep(4);
          return;
        }
      }
      // All images uploaded — commit
      const chapter = await commitUpload(actor, cid);
      await queryClient.invalidateQueries({ queryKey: COMICS_QUERY_KEY });
      setPublishedComicId(comId);
      setPublishedChapterId(chapter.id);
      setStep(4);
    } catch {
      if (!rollbackTriggered) {
        const cleaned = await rollbackUpload(actor, cid).catch(() => 0n);
        setUploadError(
          `Publish failed. Cleaned up ${cleaned} orphaned file(s). Please retry.`,
        );
        setStep(4);
      }
    }
  };

  const handleRetry = async () => {
    if (!actor || !chapterId || !comicId || stagedFiles.length === 0) return;
    setUploadedCount(0);
    setUploadError("");
    cancelRef.current = false;
    setStep(3);
    await runUpload(stagedFiles, chapterId, comicId);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="max-w-2xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="create_comic.page"
    >
      <Link
        to="/creator"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 font-body"
        data-ocid="create_comic.back_link"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="font-display text-3xl text-foreground mb-6">New Comic</h1>

      <StepIndicator current={step} />

      {/* ── STEP 1: Metadata ── */}
      {step === 1 && (
        <div className="flex flex-col gap-6" data-ocid="create_comic.step1">
          {croppingFile ? (
            <ThumbnailCropper
              file={croppingFile}
              onCrop={handleCropDone}
              onCancel={() => setCroppingFile(null)}
            />
          ) : (
            <>
              {/* Cover */}
              <div className="flex flex-col gap-2">
                <Label className="font-body text-sm">Cover Image (9:16)</Label>
                <label
                  htmlFor="cover"
                  className="relative flex items-center justify-center w-40 h-56 rounded-lg border-2 border-dashed border-border hover:border-accent/50 bg-card cursor-pointer transition-colors duration-200 overflow-hidden"
                  data-ocid="create_comic.cover_dropzone"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImagePlus className="w-8 h-8" />
                      <span className="text-xs font-body">Upload cover</span>
                    </div>
                  )}
                  <input
                    id="cover"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverPick}
                    data-ocid="create_comic.cover_input"
                  />
                </label>
                {coverFile && (
                  <button
                    type="button"
                    className="text-xs text-accent hover:underline w-fit font-body"
                    onClick={() => setCroppingFile(coverFile)}
                  >
                    Re-crop
                  </button>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="font-body text-sm">
                    Title
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {title.length}/150
                  </span>
                </div>
                <Input
                  id="title"
                  value={title}
                  maxLength={150}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shadow Protocol"
                  required
                  className="bg-card border-border font-body"
                  data-ocid="create_comic.title_input"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="font-body text-sm">
                    Description
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {description.length}/1000
                  </span>
                </div>
                <Textarea
                  id="description"
                  value={description}
                  maxLength={1000}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this comic about?"
                  rows={4}
                  className="bg-card border-border font-body resize-none"
                  data-ocid="create_comic.description_textarea"
                />
              </div>

              <Button
                type="button"
                disabled={isCreating || !title.trim() || !coverFile}
                onClick={handleMetadataNext}
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                data-ocid="create_comic.next_button"
              >
                {isCreating ? "Creating…" : "Next →"}
              </Button>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: Upload Pages ── */}
      {step === 2 && (
        <div data-ocid="create_comic.step2">
          <p className="font-body text-sm text-muted-foreground mb-5">
            Upload the pages for Chapter 1 — up to 50 images.
          </p>
          <ChapterUploader onImagesReady={handleImagesReady} maxImages={50} />
        </div>
      )}

      {/* ── STEP 3: Upload Progress ── */}
      {step === 3 && (
        <div className="flex flex-col gap-6" data-ocid="create_comic.step3">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
            <h2 className="font-display text-xl text-foreground">
              Publishing your chapter
            </h2>
            <p
              className="font-body text-sm text-muted-foreground"
              data-ocid="create_comic.loading_state"
            >
              Uploading {uploadedCount} / {stagedFiles.length} images…
            </p>
          </div>
          <Progress
            value={
              stagedFiles.length > 0
                ? (uploadedCount / stagedFiles.length) * 100
                : 0
            }
            className="h-2"
          />
          <p className="text-xs font-body text-muted-foreground text-center">
            Do not close this page until the upload completes.
          </p>
        </div>
      )}

      {/* ── STEP 4: Done / Error ── */}
      {step === 4 && (
        <div
          className="flex flex-col items-center gap-6 py-10 text-center"
          data-ocid="create_comic.step4"
        >
          {!uploadError ? (
            // Success
            <>
              <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center">
                <CheckCircle2 className="w-11 h-11 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-3xl text-foreground">
                  🎉 Your comic is live!
                </h2>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  {stagedFiles.length} page{stagedFiles.length !== 1 ? "s" : ""}{" "}
                  published successfully.
                </p>
              </div>
              <div className="flex gap-3">
                {publishedComicId && publishedChapterId && (
                  <Button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/comics/$comicId/chapters/$chapterId",
                        params: {
                          comicId: publishedComicId,
                          chapterId: publishedChapterId,
                        },
                      })
                    }
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="create_comic.read_button"
                  >
                    Read it
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/creator" })}
                  data-ocid="create_comic.dashboard_button"
                >
                  Back to Dashboard
                </Button>
              </div>
            </>
          ) : (
            // Error
            <>
              <div className="w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <div>
                <h2 className="font-display text-2xl text-foreground">
                  Upload failed
                </h2>
                <p
                  className="font-body text-sm text-muted-foreground mt-2 max-w-sm mx-auto"
                  data-ocid="create_comic.error_state"
                >
                  {uploadError}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleRetry}
                  disabled={stagedFiles.length === 0 || !chapterId}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-ocid="create_comic.retry_button"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry Upload
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/creator" })}
                  data-ocid="create_comic.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
