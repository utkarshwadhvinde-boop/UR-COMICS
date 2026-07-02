import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/services/uploadService";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Genre {
  id: string;
  name: string;
}

export function CreateNovelPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("genres").select("*").order("name").then(({ data }) => {
      setGenres(data ?? []);
    });
  }, []);

  const toggleGenre = (id: string) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!user || !title.trim()) return;
    setIsSubmitting(true);
    try {
      let cover_url = null;
      if (coverFile) {
        cover_url = await uploadImage(coverFile);
      }
      const { data, error } = await supabase.from("novels").insert({
        creator_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        cover_url,
      }).select().single();
      if (error) throw error;

      if (selectedGenres.length > 0) {
        await supabase.from("novel_genres").insert(
          selectedGenres.map(genre_id => ({ novel_id: data.id, genre_id }))
        );
      }

      toast.success("Novel created!");
      navigate({ to: "/novels/$novelId", params: { novelId: data.id } });
    } catch {
      toast.error("Failed to create novel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: "600px", margin: "0 auto", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, marginBottom: "24px" }}>
        New Novel
      </h1>

      {/* Cover */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "8px" }}>
          Cover Image (optional)
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{ width: "120px", height: "160px", borderRadius: "10px", background: coverPreview ? "none" : "rgba(255,255,255,0.05)", border: "2px dashed rgba(124,58,237,0.4)", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>+ Cover</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} />
      </div>

      {/* Title */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "8px" }}>
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Novel title..."
          style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "8px" }}>
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is your novel about..."
          rows={4}
          style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>

      {/* Genres */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "10px" }}>
          Genres (optional)
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {genres.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => toggleGenre(g.id)}
              style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "none",
                background: selectedGenres.includes(g.id) ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "rgba(255,255,255,0.06)",
                color: selectedGenres.includes(g.id) ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !title.trim()}
        style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", color: "#fff", fontSize: "15px", fontWeight: 800, cursor: isSubmitting || !title.trim() ? "not-allowed" : "pointer", opacity: isSubmitting || !title.trim() ? 0.5 : 1, boxSizing: "border-box" }}
      >
        {isSubmitting ? "Creating..." : "Create Novel"}
      </button>
    </div>
  );
}
