import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { isValidImageFile, sanitizeBio, sanitizeDisplayName } from "@/lib/utils";
import { uploadAvatarImage } from "@/services/uploadService";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_DISPLAY_NAME = 100;
const MAX_BIO = 300;

function EditProfileSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-10 max-w-xl mx-auto" style={{ boxSizing: "border-box" }}>
      <Skeleton className="h-8 w-40 mb-8" style={{ borderRadius: "0px", backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
      <div style={{ backgroundColor: "#ffffff", border: "4px solid #111111", padding: "24px", display: "flex", flexDirection: "column", gap: "24px", boxSizing: "border-box" }}>
        <Skeleton className="w-20 h-20 mx-auto" style={{ borderRadius: "0px", backgroundColor: "rgba(17, 17, 17, 0.1)", border: "2px solid #111111" }} />
        <Skeleton className="h-10 w-full" style={{ borderRadius: "0px", backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
        <Skeleton className="h-24 w-full" style={{ borderRadius: "0px", backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
        <Skeleton className="h-10 w-full" style={{ borderRadius: "0px", backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
      </div>
    </div>
  );
}

export function EditProfilePage() {
  const navigate = useNavigate();
  const { handle } = useParams({ strict: false }) as { handle: string };
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? "";

  const { data: profile, isLoading: profileLoading } = useProfile(handle || userId);
  const updateProfile = useUpdateProfile(userId);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setAvatarPreview(profile.avatar_url ?? null);
    }
  }, [profile]);

  const initials = (displayName || profile?.display_name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      toast.error("Invalid file. Use JPG/PNG/WebP under 10MB.");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setUploading(true);
    try {
      const url = await uploadAvatarImage(userId, file);
      setAvatarUrl(url);
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Failed to upload photo.");
      setAvatarPreview(avatarUrl || null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = sanitizeDisplayName(displayName);
    if (!cleanName) {
      toast.error("Display name is required and must be under 100 characters.");
      return;
    }
    const cleanBio = sanitizeBio(bio);
    if (cleanBio === null) {
      toast.error("Bio must be under 300 characters.");
      return;
    }
    try {
      const updated = await updateProfile.mutateAsync({
        display_name: cleanName,
        bio: cleanBio || undefined,
        avatar_url: avatarUrl.trim() || undefined,
      });
      toast.success("Profile updated!");
      navigate({
        to: "/profile/$handle",
        params: { handle: updated.handle ?? userId },
      });
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", width: "100%" }}>
        <EditProfileSkeleton />
      </div>
    );
  }
  if (!isAuthenticated) return null;
  if (!profile || !profile.handle) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", width: "100%" }}>
        <EditProfileSkeleton />
      </div>
    );
  }

  return (
    <div 
      style={{ 
        backgroundColor: "#f5f0e8", 
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        minHeight: "100vh", 
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div className="px-4 sm:px-6 py-10 max-w-xl mx-auto" style={{ boxSizing: "border-box" }}>
        {/* Navigation Action Header Canvas Block */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", boxSizing: "border-box" }}>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/profile/$handle",
                params: { handle: profile.handle ?? userId },
              })
            }
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "0px",
              backgroundColor: "#ffffff",
              border: "2px solid #111111",
              boxShadow: "2px 2px 0px #111111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#111111",
              boxSizing: "border-box"
            }}
            aria-label="Go back to profile"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div style={{ boxSizing: "border-box" }}>
            <h1 style={{ fontFamily: "serif", fontSize: "24px", fontWeight: "900", color: "#111111", margin: 0, lineHeight: "1.2" }}>
              Edit Profile
            </h1>
            <p style={{ margin: "2px 0 0 0", fontFamily: "monospace, sans-serif", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#555555" }}>
              Update your public credentials
            </p>
          </div>
        </div>

        {/* Form Identity Editor Container Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ boxSizing: "border-box" }}
        >
          <form onSubmit={handleSubmit} style={{ boxSizing: "border-box" }}>
            <div style={{
              backgroundColor: "#ffffff",
              border: "4px solid #111111",
              boxShadow: "5px 5px 0px #111111",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxSizing: "border-box"
            }}>
              
              {/* Profile Avatar Canvas Setup Frame */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", boxSizing: "border-box" }}>
                <div style={{ position: "relative", boxSizing: "border-box" }}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile avatar preview"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        objectFit: "cover",
                        border: "3px solid #111111",
                        boxShadow: "2px 2px 0px #111111",
                        boxSizing: "border-box"
                      }}
                      onError={() => setAvatarPreview(null)}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontFamily: "monospace, sans-serif",
                        fontWeight: "900",
                        color: "#111111",
                        backgroundColor: "#fbbf24",
                        border: "3px solid #111111",
                        boxShadow: "2px 2px 0px #111111",
                        boxSizing: "border-box"
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  
                  {/* Camera File Trigger Overlay Button Block */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "0px",
                      backgroundColor: "#111111",
                      border: "2px solid #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    {uploading ? (
                      <span style={{
                        width: "12px",
                        height: "12px",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                    ) : (
                      <Camera className="w-3 h-3 text-white" />
                    )}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "monospace, sans-serif",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#111111",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    boxSizing: "border-box"
                  }}
                >
                  {uploading ? "Uploading…" : "Change Photo"}
                </button>

                <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "12px", color: "#555555", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                  <User className="w-3 h-3" />@{profile.handle}
                </p>
              </div>

              {/* Display Name Form Label Input Track */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", boxSizing: "border-box" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
                  <Label htmlFor="displayName" style={{ fontFamily: "monospace, sans-serif", textTransform: "uppercase", fontSize: "12px", fontWeight: "900", color: "#111111" }}>
                    Display Name <span style={{ color: "#cc0000" }}>*</span>
                  </Label>
                  <span style={{ 
                    fontFamily: "monospace, sans-serif", 
                    fontSize: "11px", 
                    fontWeight: "bold",
                    color: displayName.length > MAX_DISPLAY_NAME * 0.9 ? "#cc0000" : "#555555" 
                  }}>
                    {displayName.length}/{MAX_DISPLAY_NAME}
                  </span>
                </div>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME))}
                  placeholder="Your display name"
                  maxLength={MAX_DISPLAY_NAME}
                  style={{
                    borderRadius: "0px",
                    border: "2px solid #111111",
                    backgroundColor: "#ffffff",
                    color: "#111111",
                    fontFamily: "serif",
                    fontSize: "14px",
                    padding: "10px",
                    height: "auto",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Biography Text Area Content Box */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", boxSizing: "border-box" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
                  <Label htmlFor="bio" style={{ fontFamily: "monospace, sans-serif", textTransform: "uppercase", fontSize: "12px", fontWeight: "900", color: "#111111" }}>
                    Bio Text Summary
                  </Label>
                  <span style={{ 
                    fontFamily: "monospace, sans-serif", 
                    fontSize: "11px", 
                    fontWeight: "bold",
                    color: bio.length > MAX_BIO * 0.9 ? "#cc0000" : "#555555" 
                  }}>
                    {bio.length}/{MAX_BIO}
                  </span>
                </div>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO))}
                  placeholder="Tell readers a little about yourself…"
                  rows={4}
                  maxLength={MAX_BIO}
                  style={{
                    borderRadius: "0px",
                    border: "2px solid #111111",
                    backgroundColor: "#ffffff",
                    color: "#111111",
                    fontFamily: "serif",
                    fontSize: "14px",
                    padding: "10px",
                    resize: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Action Operations Submission Buttons Bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "8px", boxSizing: "border-box" }} className="sm:flex-row">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending || uploading || !displayName.trim()}
                  style={{
                    flexGrow: 1,
                    borderRadius: "0px",
                    border: "2px solid #111111",
                    backgroundColor: "#fbbf24",
                    color: "#111111",
                    fontFamily: "monospace, sans-serif",
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    boxShadow: "2px 2px 0px #111111",
                    padding: "12px",
                    height: "auto",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                >
                  {updateProfile.isPending ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <span style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(17, 17, 17, 0.2)",
                        borderTopColor: "#111111",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Saving…
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate({
                      to: "/profile/$handle",
                      params: { handle: profile.handle ?? userId },
                    })
                  }
                  style={{
                    flexGrow: 1,
                    borderRadius: "0px",
                    border: "2px solid #111111",
                    backgroundColor: "#ffffff",
                    color: "#555555",
                    fontFamily: "monospace, sans-serif",
                    fontSize: "13px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    boxShadow: "2px 2px 0px #111111",
                    padding: "12px",
                    height: "auto",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                >
                  Cancel
                </Button>
              </div>

              {updateProfile.isError && (
                <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "11px", fontWeight: "bold", color: "#cc0000", textAlign: "center" }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Dynamic Keyframe Injection Block */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
                    }
