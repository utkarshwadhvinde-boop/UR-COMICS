import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/services/uploadService";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function EditNovelChapterPage() {
  const { novelId, chapterId } = useParams({ from: "/creator/novels/$novelId/chapters/$chapterId" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("novel_chapters").select("*").eq("id", chapterId).single(),
      supabase.from("novel_chapter_images").select("*").eq("chapter_id", chapterId).order("page_number", { ascending: true }),
    ]).then(([{ data: chapter }, { data: imgs }]) => {
      if (chapter) {
        setTitle(chapter.title);
        setContent(chapter.content ?? "");
      }
      setImages((imgs ?? []).map((i: any) => i.image_url));
      setLoading(false);
    });
  }, [chapterId]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleSave = async (publish: boolean) => {
    if (!user || !title.trim()) return;
    setIsSubmitting(true);
    try {
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

      await supabase.from("novel_chapters").update({
        title: title.trim(),
        content: content.trim() || null,
        word_count: wordCount,
        is_published: publish,
        updated_at: new Date().toISOString(),
      }).eq("id", chapterId);

      // Upload new images
      if (newImages.length > 0) {
        const existingCount = images.length;
        for (let i = 0; i < newImages.length; i++) {
          const url = await uploadImage(newImages[i]);
          await supabase.from("novel_chapter_images").insert({
            chapter_id: chapterId,
            image_url: url,
            page_number: existingCount + i + 1,
          });
        }
      }

      toast.success(publish ? "Chapter published!" : "Draft saved!");
      navigate({ to: "/novels/$novelId", params: { novelId } });
    } catch {
      toast.error("Failed to save chapter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "rgba(255,255,255,0.4)", padding: "24px" }}>Loading...</p>;

  return (
    <div style={{ padding: "24px 16px", maxWidth: "720px", margin: "0 auto", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>
        Edit Chapter
      </h1>

      {/* Title */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "8px" }}>Chapter Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chapter title..."
          style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Text editor */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "8px" }}>
          Content (optional)
          <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: "8px" }}>
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your chapter here..."
          rows={12}
          style={{ width: "100%", padding: "14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "15px", lineHeight: 1.8, outline: "none", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>

      {/* Images */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "8px" }}>Images (optional)</label>

        {/* Existing images */}
        {images.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {images.map((url, i) => (
              <img key={url} src={url} alt={`Page ${i + 1}`} style={{ width: "100%", borderRadius: "8px", objectFit: "contain" }} />
            ))}
          </div>
        )}

        {/* New image previews */}
        {previews.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {previews.map((url, i) => (
              <img key={url} src={url} alt={`New ${i + 1}`} style={{ width: "100%", borderRadius: "8px", objectFit: "contain", opacity: 0.7 }} />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#8b5cf6", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
        >
          + Add Images
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageAdd} style={{ display: "none" }} />
      </div>

      {/* Save buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={isSubmitting}
          style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={isSubmitting}
          style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", color: "#fff", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}
        >
          {isSubmitting ? "Saving..." : "Publish"}
        </button>
      </div>
    </div>
  );
                  }
