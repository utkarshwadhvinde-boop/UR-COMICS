import { useAuth } from "@/hooks/useAuth";
import { listGenres, createComic, updateComic, setComicGenres } from "@/services/comicsService";
import { uploadCoverImage } from "@/services/uploadService";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { sanitizeDescription, sanitizeTitle, isValidImageFile } from "@/lib/utils";

const globalStyles = `
  * { box-sizing: border-box; }
  @keyframes stampIn {
    0% { opacity: 0; transform: scale(1.3) rotate(-5deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
`;

const paperBg = {
  background: "#f5f0e8",
  backgroundImage: "radial-gradient(circle, #fbbf2440 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  minHeight: "100vh",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "0px",
  background: "#fff",
  border: "2px solid #111",
  color: "#111",
  fontSize: "14px",
  outline: "none",
  fontFamily: "monospace",
  boxShadow: "3px 3px 0px #111",
};

const labelStyle = {
  color: "#111",
  fontSize: "12px",
  fontWeight: 900,
  fontFamily: "monospace",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  display: "block",
  marginBottom: "8px",
};

export function CreateComicPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listGenres().then(setGenres);
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      toast.error("Invalid file. Use JPG/PNG/WebP under 10MB.");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    const cleanTitle = sanitizeTitle(title);
    if (!cleanTitle) { toast.error("Please enter a valid title."); return; }
    const cleanDesc = sanitizeDescription(description);
    if (cleanDesc === null) { toast.error("Description too long."); return; }
    setIsSubmitting(true);
    try {
      const comic = await createComic({
        title: cleanTitle,
        description: cleanDesc || undefined,
        cover_url: undefined,
        creator_id: user.id,
        is_ai_generated: isAiGenerated,
        ai_status: isAiGenerated ? "pending" : "none",
      });
      if (coverFile) {
        const cover_url = await uploadCoverImage(comic.id, coverFile);
        await import("@/services/comicsService").then(m => m.updateComic(comic.id, { cover_url }));
      }
      if (selectedGenres.length > 0) {
        await import("@/services/comicsService").then(m => m.setComicGenres(comic.id, selectedGenres));
      }
      toast.success("Comic created!");
      navigate({ to: "/creator/comics/$comicId", params: { comicId: comic.id } });
    } catch {
      toast.error("Failed to create comic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Comic Info", "Upload Cover", "Publish"];

  return (
    <div style={paperBg}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ background: "#111", padding: "16px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "10px 10px", pointerEvents: "none" }} />
          <p style={{ color: "#cc0000", fontSize: "10px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "3px", margin: "0 0 4px", textTransform: "uppercase" }}>
            Creator Studio
          </p>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 900, fontFamily: "serif", margin: 0 }}>
            New Comic
          </h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "0", marginBottom: "24px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: i === step ? "#cc0000" : i < step ? "#111" : "#fff", border: "2px solid #111", borderRight: i < steps.length - 1 ? "none" : "2px solid #111" }}>
              <p style={{ margin: 0, fontSize: "10px", fontWeight: 900, fontFamily: "monospace", color: i <= step ? "#fff" : "#999", textTransform: "uppercase", letterSpacing: "1px" }}>
                {i + 1}. {s}
              </p>
            </div>
          ))}
        </div>

        {/* Step 0 — Comic Info */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your comic title"
                maxLength={150}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this comic about?"
                rows={4}
                maxLength={1000}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Genres</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {genres.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGenre(g.id)}
                    style={{
                      padding: "6px 14px",
                      border: "2px solid #111",
                      cursor: "pointer",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: selectedGenres.includes(g.id) ? "#111" : "#fff",
                      color: selectedGenres.includes(g.id) ? "#fff" : "#111",
                      boxShadow: selectedGenres.includes(g.id) ? "2px 2px 0px #cc0000" : "2px 2px 0px #111",
                    }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Toggle */}
            <div style={{ padding: "16px", background: "#fff", border: "2px solid #111", boxShadow: "3px 3px 0px #111" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isAiGenerated ? "12px" : "0" }}>
                <div>
                  <p style={{ color: "#111", fontSize: "13px", fontWeight: 900, fontFamily: "monospace", margin: "0 0 2px", textTransform: "uppercase" }}>
                    AI Generated
                  </p>
                  <p style={{ color: "#666", fontSize: "11px", fontFamily: "serif", margin: 0 }}>
                    Enable if artwork uses AI
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiGenerated((v) => !v)}
                  style={{
                    width: "48px", height: "26px", border: "2px solid #111",
                    cursor: "pointer", position: "relative", flexShrink: 0,
                    background: isAiGenerated ? "#cc0000" : "#fff",
                    transition: "background 0.2s",
                  }}
                >
                  <span style={{
                    position: "absolute", top: "2px", width: "18px", height: "18px",
                    background: "#111", transition: "left 0.2s",
                    left: isAiGenerated ? "24px" : "2px",
                  }} />
                </button>
              </div>
              {isAiGenerated && (
                <div style={{ padding: "10px", background: "#fff8f0", border: "2px solid #cc0000" }}>
                  <p style={{ color: "#cc0000", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, margin: 0 }}>
                    AI comics require manual review before publishing and are not eligible for monetization.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => { if (title.trim()) setStep(1); }}
              disabled={!title.trim()}
              style={{
                padding: "14px",
                background: title.trim() ? "#111" : "#ccc",
                border: "2px solid #111",
                color: "#fff",
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: "14px",
                cursor: title.trim() ? "pointer" : "not-allowed",
                textTransform: "uppercase",
                letterSpacing: "2px",
                boxShadow: title.trim() ? "4px 4px 0px #cc0000" : "none",
              }}
            >
              Next: Upload Cover
            </button>
          </div>
        )}

        {/* Step 1 — Cover Upload */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Cover Image (9:16 ratio)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "180px", height: "240px", border: "3px dashed #111",
                  cursor: "pointer", overflow: "hidden", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: coverPreview ? "none" : "#fff",
                  boxShadow: "4px 4px 0px #111",
                }}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ textAlign: "center", padding: "16px" }}>
                    <p style={{ color: "#111", fontFamily: "monospace", fontWeight: 900, fontSize: "12px", margin: "0 0 4px" }}>+ COVER</p>
                    <p style={{ color: "#999", fontFamily: "serif", fontSize: "11px", margin: 0 }}>9:16 ratio recommended</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(0)}
                style={{ flex: 1, padding: "12px", background: "#fff", border: "2px solid #111", color: "#111", fontFamily: "monospace", fontWeight: 700, cursor: "pointer", boxShadow: "3px 3px 0px #111" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{ flex: 2, padding: "12px", background: "#111", border: "2px solid #111", color: "#fff", fontFamily: "monospace", fontWeight: 900, cursor: "pointer", boxShadow: "4px 4px 0px #cc0000", textTransform: "uppercase", letterSpacing: "1px" }}
              >
                Next: Publish
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Publish */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ padding: "20px", background: "#fff", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                {coverPreview && (
                  <img src={coverPreview} alt="Cover" style={{ width: "80px", height: "107px", objectFit: "cover", border: "2px solid #111", flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ color: "#cc0000", fontSize: "10px", fontFamily: "monospace", fontWeight: 900, letterSpacing: "2px", margin: "0 0 4px", textTransform: "uppercase" }}>
                    Ready to publish
                  </p>
                  <p style={{ color: "#111", fontSize: "18px", fontWeight: 900, fontFamily: "serif", margin: "0 0 6px" }}>{title}</p>
                  {description && <p style={{ color: "#666", fontSize: "12px", fontFamily: "serif", margin: "0 0 8px" }}>{description.slice(0, 80)}{description.length > 80 ? "..." : ""}</p>}
                  {isAiGenerated && (
                    <span style={{ padding: "2px 8px", background: "#111", color: "#fff", fontSize: "10px", fontFamily: "monospace", fontWeight: 900 }}>AI</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: "12px", background: "#fff", border: "2px solid #111", color: "#111", fontFamily: "monospace", fontWeight: 700, cursor: "pointer", boxShadow: "3px 3px 0px #111" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ flex: 2, padding: "12px", background: "#cc0000", border: "2px solid #111", color: "#fff", fontFamily: "monospace", fontWeight: 900, cursor: isSubmitting ? "not-allowed" : "pointer", boxShadow: "4px 4px 0px #111", textTransform: "uppercase", letterSpacing: "1px", opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? "Creating..." : "Create Comic"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                    }
