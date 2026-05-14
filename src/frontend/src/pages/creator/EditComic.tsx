import { ExternalBlob, createActor } from "@/backend";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useChapters } from "@/hooks/useChapters";
import { chaptersQueryKey } from "@/hooks/useChapters";
import { useComic } from "@/hooks/useComic";
import { comicQueryKey } from "@/hooks/useComic";
import { FALLBACK_GENRES, useGenres } from "@/hooks/useGenres";
import { updateComic } from "@/services/comicsService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft, ImagePlus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function EditComicPage() {
  const { comicId } = useParams({ from: "/creator/comics/$comicId" });
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { data: genres = FALLBACK_GENRES } = useGenres();

  const queryClient = useQueryClient();
  const { data: comic, isLoading, isError } = useComic(comicId);
  const { data: chapters, isLoading: chaptersLoading } = useChapters(comicId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    if (comic) {
      setTitle(comic.title);
      setDescription(comic.description);
      setCoverPreview(comic.cover_blob.getDirectURL());
      setSelectedGenres(comic.genre_ids ?? []);
    }
  }, [comic]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !comic || !title.trim()) return;
    setIsSubmitting(true);
    try {
      let coverBlob = comic.cover_blob;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverBlob = ExternalBlob.fromBytes(bytes);
      }
      await updateComic(actor, comicId, {
        title: title.trim(),
        description: description.trim(),
        cover_blob: coverBlob,
        genre_ids: selectedGenres,
      });
      await queryClient.invalidateQueries({ queryKey: comicQueryKey(comicId) });
      toast.success("Comic updated!");
      navigate({ to: "/creator" });
    } catch {
      toast.error("Failed to update comic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isError) return <ErrorFallback message="Failed to load comic." />;

  return (
    <div
      className="max-w-2xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="edit_comic.page"
    >
      <Link
        to="/creator"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6 font-body"
        data-ocid="edit_comic.back_link"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl text-foreground mb-8">
        {isLoading ? (
          <Skeleton className="h-9 w-48 bg-muted" />
        ) : (
          `Edit: ${comic?.title}`
        )}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="font-body text-sm" htmlFor="cover">
            Cover Image
          </Label>
          <label
            htmlFor="cover"
            className="relative flex items-center justify-center w-40 h-56 rounded-lg border-2 border-dashed border-border hover:border-accent/50 bg-card cursor-pointer transition-smooth overflow-hidden"
            data-ocid="edit_comic.cover_dropzone"
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
              onChange={handleCoverChange}
              data-ocid="edit_comic.cover_input"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="font-body text-sm">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-card border-border font-body"
            data-ocid="edit_comic.title_input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="font-body text-sm">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-card border-border font-body resize-none"
            data-ocid="edit_comic.description_textarea"
          />
        </div>

        {/* Genres */}
        <div
          className="flex flex-col gap-2"
          data-ocid="edit_comic.genres_section"
        >
          <Label className="font-body text-sm">Genres</Label>
          <p className="text-xs text-muted-foreground font-body">
            Select one or more genres that best describe your comic.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {genres.map((genre) => {
              const active = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() =>
                    setSelectedGenres((prev) =>
                      active
                        ? prev.filter((id) => id !== genre.id)
                        : [...prev, genre.id],
                    )
                  }
                  className={[
                    "px-2 py-1.5 rounded-md text-xs font-body transition-colors duration-150 truncate",
                    active
                      ? "bg-[#8B5CF6]/20 border border-[#8B5CF6] text-white"
                      : "bg-card border border-border text-muted-foreground hover:border-[#8B5CF6]/50",
                  ].join(" ")}
                  data-ocid={`edit_comic.genre_chip.${genre.slug}`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
          data-ocid="edit_comic.submit_button"
        >
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      {/* Chapters management */}
      <div className="mt-12" data-ocid="edit_comic.chapters_section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-foreground">Chapters</h2>
          <Button
            asChild
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="edit_comic.add_chapter_button"
          >
            <Link
              to="/creator/comics/$comicId/chapters/new"
              params={{ comicId }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Chapter
            </Link>
          </Button>
        </div>
        {chaptersLoading &&
          [1, 2].map((i) => (
            <Skeleton
              key={i}
              className="h-12 w-full mb-2 bg-muted rounded-lg"
            />
          ))}
        {!chaptersLoading && (!chapters || chapters.length === 0) && (
          <p
            className="text-muted-foreground font-body text-sm py-6 text-center"
            data-ocid="edit_comic.chapters_empty_state"
          >
            No chapters yet. Add your first chapter!
          </p>
        )}
        {!chaptersLoading && chapters && chapters.length > 0 && (
          <div className="flex flex-col gap-2">
            {chapters.map((ch, i) => (
              <div
                key={ch.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                data-ocid={`edit_comic.chapters.item.${i + 1}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-accent font-mono text-sm font-bold">
                    Ch.{ch.number}
                  </span>
                  <span className="font-body text-sm text-foreground truncate">
                    {ch.title}
                  </span>
                  <Badge
                    variant={ch.is_published ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {ch.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  data-ocid={`edit_comic.edit_chapter_button.${i + 1}`}
                >
                  <Link
                    to="/creator/comics/$comicId/chapters/$chapterId"
                    params={{ comicId, chapterId: ch.id }}
                  >
                    Edit
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
