import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chaptersQueryKey } from "@/hooks/useChapters";
import { createChapter } from "@/services/chaptersService";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateChapterPage() {
  const { comicId } = useParams({
    from: "/creator/comics/$comicId/chapters/new",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [number, setNumber] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chNum = Number.parseFloat(number);
    if (!title.trim() || Number.isNaN(chNum)) return;
    setIsSubmitting(true);
    try {
      const chapter = await createChapter({
        comic_id: comicId,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        chapter_number: chNum,
      });
      await queryClient.invalidateQueries({
        queryKey: chaptersQueryKey(comicId),
      });
      toast.success("Chapter created! You can now upload images.");
      navigate({
        to: "/creator/comics/$comicId/chapters/$chapterId",
        params: { comicId, chapterId: chapter.id },
      });
    } catch {
      toast.error("Failed to create chapter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto px-4 sm:px-6 py-10"
      data-ocid="create_chapter.page"
    >
      <Link
        to="/creator/comics/$comicId"
        params={{ comicId }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6 font-body"
        data-ocid="create_chapter.back_link"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Comic
      </Link>
      <h1 className="font-display text-3xl text-foreground mb-8">
        New Chapter
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="number" className="font-body text-sm">
            Chapter Number
          </Label>
          <Input
            id="number"
            type="number"
            min="0"
            step="0.1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            className="bg-card border-border font-mono"
            data-ocid="create_chapter.number_input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="font-body text-sm">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Awakening"
            required
            className="bg-card border-border font-body"
            data-ocid="create_chapter.title_input"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
  <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
    Episode Title <span style={{ color: "rgba(255,255,255,0.3)" }}>(optional)</span>
  </label>
  <input
    value={subtitle}
    onChange={(e) => setSubtitle(e.target.value)}
    placeholder="e.g. The First Sun of Circle Part 1"
    style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", width: "100%" }}
  />
</div>

        <Button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
          data-ocid="create_chapter.submit_button"
        >
          {isSubmitting ? "Creating…" : "Create Chapter"}
        </Button>
      </form>
    </div>
  );
}
