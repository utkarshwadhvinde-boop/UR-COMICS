import { ALL_GENRES, GenreChip } from "@/components/ui/GenreChip";
import { ImageStitchingModal } from "@/components/ui/ImageStitchingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store";
import type { Chapter, Comic, ComicStatus, Genre } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  BookOpen,
  ImagePlus,
  Layers,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ChapterDraft = { title: string; content: string };

function StatusToggle({
  value,
  onChange,
}: {
  value: ComicStatus;
  onChange: (v: ComicStatus) => void;
}) {
  const options: { value: ComicStatus; label: string; color: string }[] = [
    {
      value: "ongoing",
      label: "Ongoing",
      color: "bg-primary text-primary-foreground",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-accent text-accent-foreground",
    },
    {
      value: "hiatus",
      label: "Hiatus",
      color: "bg-muted text-muted-foreground",
    },
  ];
  return (
    <div className="flex gap-2 flex-wrap" data-ocid="create.status_toggle">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border ${
            value === opt.value
              ? `${opt.color} border-primary/30 shadow-sm`
              : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40"
          }`}
          data-ocid={`create.status.${opt.value}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChapterEditor({
  chapters,
  onAdd,
  onRemove,
  onChange,
  onStitchImages,
}: {
  chapters: ChapterDraft[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: keyof ChapterDraft, val: string) => void;
  onStitchImages: (chapterIndex: number) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-semibold">
          Chapters
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            ({chapters.length} total)
          </span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="rounded-xl gap-1"
          data-ocid="create.add_chapter_button"
        >
          <Plus className="w-4 h-4" /> Add Chapter
        </Button>
      </div>
      <div className="space-y-2">
        {chapters.map((ch, i) => (
          <div
            key={ch.title + String(i)}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            data-ocid={`create.chapter.item.${i + 1}`}
          >
            {/* Header row */}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-muted/20 transition-colors text-left"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <Input
                value={ch.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onChange(i, "title", e.target.value)}
                placeholder={`Chapter ${i + 1} title`}
                className="rounded-lg h-8 text-sm border-0 bg-transparent focus-visible:ring-1 px-2"
                data-ocid={`create.chapter.title_input.${i + 1}`}
              />
              <div className="flex items-center gap-1 shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {expanded === i ? "▲" : "▼"}
                </span>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(i);
                    }}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                    data-ocid={`create.chapter.delete_button.${i + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </button>
            {/* Expanded content */}
            {expanded === i && (
              <div className="px-4 pb-4 border-t border-border/50">
                <Label className="text-xs text-muted-foreground mt-3 mb-1.5 block">
                  Chapter Content
                </Label>
                <Textarea
                  value={ch.content}
                  onChange={(e) => onChange(i, "content", e.target.value)}
                  placeholder="Write chapter content, paste image URLs (one per line), or describe the chapter..."
                  rows={6}
                  className="rounded-xl resize-none text-sm"
                  data-ocid={`create.chapter.content_textarea.${i + 1}`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    Tip: Paste one image URL per line, or use Stitch Images to
                    merge panels.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10 hover:text-primary shrink-0 ml-3"
                    onClick={() => onStitchImages(i)}
                    data-ocid={`create.chapter.stitch_button.${i + 1}`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Stitch Images
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreatePage() {
  const navigate = useNavigate();
  // Support ?edit=comicId for pre-filling
  const search = useSearch({ strict: false }) as { edit?: string };
  const editId = search?.edit;
  const { currentUser, comics, addComic, updateComic } = useAppStore();

  const existing = editId ? comics.find((c) => c.id === editId) : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(
    existing?.genres ?? [],
  );
  const [coverUrl, setCoverUrl] = useState(existing?.coverImage ?? "");
  const [coverPreview, setCoverPreview] = useState(existing?.coverImage ?? "");
  const [status, setStatus] = useState<ComicStatus>(
    existing?.status ?? "ongoing",
  );
  const [chapters, setChapters] = useState<ChapterDraft[]>(
    existing?.chapters.map((ch) => ({
      title: ch.title,
      content: ch.pages.join("\n"),
    })) ?? [{ title: "Chapter 1", content: "" }],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stitchModalOpen, setStitchModalOpen] = useState(false);
  const [stitchTargetChapter, setStitchTargetChapter] = useState(0);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setSelectedGenres(existing.genres);
      setCoverUrl(existing.coverImage);
      setCoverPreview(existing.coverImage);
      setStatus(existing.status);
      setChapters(
        existing.chapters.map((ch) => ({
          title: ch.title,
          content: ch.pages.join("\n"),
        })),
      );
    }
  }, [existing]);

  const toggleGenre = (genre: Genre | "All") => {
    if (genre === "All") return;
    setSelectedGenres((prev) =>
      prev.includes(genre as Genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre as Genre],
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setCoverUrl(url);
  };

  const handleCoverUrlChange = (url: string) => {
    setCoverUrl(url);
    setCoverPreview(url);
  };

  const addChapter = () =>
    setChapters((prev) => [
      ...prev,
      { title: `Chapter ${prev.length + 1}`, content: "" },
    ]);

  const removeChapter = (idx: number) =>
    setChapters((prev) => prev.filter((_, i) => i !== idx));

  const updateChapter = (i: number, field: keyof ChapterDraft, val: string) =>
    setChapters((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)),
    );

  const handleSubmit = (e: React.FormEvent, publishNow = true) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (selectedGenres.length === 0) {
      toast.error("Select at least one genre");
      return;
    }
    if (publishNow && chapters.length === 0) {
      toast.error("Add at least one chapter to publish");
      return;
    }
    setIsSubmitting(true);

    const comicId = existing?.id ?? `comic-${Date.now()}`;
    const newChapters: Chapter[] = chapters.map((ch, i) => ({
      id: `${comicId}-ch${i + 1}`,
      comicId,
      title: ch.title || `Chapter ${i + 1}`,
      chapterNumber: i + 1,
      pages: ch.content
        ? ch.content
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        : [],
      createdAt: existing?.chapters[i]?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      isPremium: false,
      coinCost: 0,
      views: existing?.chapters[i]?.views ?? 0,
    }));

    const finalCover =
      coverPreview ||
      existing?.coverImage ||
      "/assets/generated/cover-lost-realm.dim_400x600.jpg";

    if (existing) {
      updateComic(comicId, {
        title: title.trim(),
        description: description.trim(),
        genres: selectedGenres,
        coverImage: finalCover,
        status,
        chapters: newChapters,
        updatedAt: Date.now(),
      });
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success("Comic updated!");
        void navigate({ to: "/creator-dashboard" });
      }, 600);
    } else {
      const newComic: Comic = {
        id: comicId,
        title: title.trim(),
        description: description.trim(),
        author: currentUser?.username ?? "Anonymous",
        coverImage: finalCover,
        genres: selectedGenres,
        status,
        likes: 0,
        views: 0,
        rating: 0,
        chapters: newChapters,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFeatured: false,
        isTrending: false,
        isPremium: false,
        isPinned: false,
        creatorId: currentUser?.id ?? "anonymous",
        isOwnerComic: false,
      };
      addComic(newComic);
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success("Comic published!");
        void navigate({ to: "/creator-dashboard" });
      }, 800);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => handleSubmit(e, false);

  const handleOpenStitch = (chapterIndex: number) => {
    setStitchTargetChapter(chapterIndex);
    setStitchModalOpen(true);
  };

  const handleStitchedImages = (imageUrls: string[]) => {
    const existing = chapters[stitchTargetChapter]?.content ?? "";
    const newContent = existing
      ? `${existing}\n${imageUrls.join("\n")}`
      : imageUrls.join("\n");
    updateChapter(stitchTargetChapter, "content", newContent);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" data-ocid="create.page">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {existing ? "Edit Comic" : "Upload Your Comic"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {existing
              ? "Update your comic details and chapters"
              : "Share your story with the world"}
          </p>
        </div>
        {existing && (
          <Badge variant="secondary" className="rounded-full mt-1 shrink-0">
            Editing
          </Badge>
        )}
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, true)}
        className="space-y-8"
        data-ocid="create.form"
      >
        {/* Cover + Title */}
        <div className="grid md:grid-cols-[200px_1fr] gap-6 bg-card border border-border rounded-3xl p-6 shadow-sm">
          {/* Cover upload */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              Cover Image
            </Label>
            <label
              htmlFor="cover-file-input"
              className="flex flex-col items-center justify-center w-full aspect-[2/3] rounded-2xl border-2 border-dashed border-border bg-muted/40 cursor-pointer hover:bg-muted/60 transition-smooth overflow-hidden"
              data-ocid="create.cover_upload"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={() => setCoverPreview("")}
                />
              ) : (
                <div className="text-center p-4">
                  <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Upload cover</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    or paste URL below
                  </p>
                </div>
              )}
              <input
                id="cover-file-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
            <Input
              value={coverUrl}
              onChange={(e) => handleCoverUrlChange(e.target.value)}
              placeholder="Paste image URL..."
              className="rounded-xl mt-2 text-xs h-8"
              data-ocid="create.cover_url_input"
            />
          </div>

          {/* Title + Description + Status */}
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-semibold mb-1.5 block"
              >
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter comic title..."
                className="rounded-xl"
                data-ocid="create.title_input"
              />
            </div>
            <div>
              <Label
                htmlFor="desc"
                className="text-sm font-semibold mb-1.5 block"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your comic..."
                rows={4}
                className="rounded-xl resize-none"
                data-ocid="create.description_textarea"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Status</Label>
              <StatusToggle value={status} onChange={setStatus} />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <Label className="text-sm font-semibold mb-3 block">
            Genres *
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (select at least one)
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.filter((g) => g !== "All").map((genre, i) => (
              <GenreChip
                key={genre}
                genre={genre}
                isActive={selectedGenres.includes(genre as Genre)}
                onClick={() => toggleGenre(genre)}
                index={i}
              />
            ))}
          </div>
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground self-center mr-1">
                Selected:
              </span>
              {selectedGenres.map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="rounded-full text-xs gap-1"
                >
                  {g}
                  <button
                    type="button"
                    className="hover:text-destructive transition-colors"
                    onClick={() => toggleGenre(g)}
                    data-ocid={`create.genre.remove.${g.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Chapters */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <ChapterEditor
            chapters={chapters}
            onAdd={addChapter}
            onRemove={removeChapter}
            onChange={updateChapter}
            onStitchImages={handleOpenStitch}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl py-5 text-sm font-semibold gap-2"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            data-ocid="create.save_draft_button"
          >
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button
            type="submit"
            className="flex-[2] gradient-primary text-primary-foreground border-0 rounded-2xl py-5 text-base font-semibold shadow-glow gap-2"
            disabled={isSubmitting}
            data-ocid="create.submit_button"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" />
                {existing ? "Saving..." : "Publishing..."}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {existing ? "Save Changes" : "Publish Comic"}
              </>
            )}
          </Button>
        </div>
      </form>

      <ImageStitchingModal
        open={stitchModalOpen}
        onClose={() => setStitchModalOpen(false)}
        onImagesUploaded={handleStitchedImages}
        chapterIndex={stitchTargetChapter}
      />
    </div>
  );
}
