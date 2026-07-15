Import { Button } from "@/components/ui/button";
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
    <div className="px-4 sm:px-6 py-10 max-w-xl mx-auto">
      <Skeleton className="h-8 w-40 bg-purple-900/30 mb-8" />
      <div className="bg-midnight-card rounded-2xl p-6 space-y-6">
        <Skeleton className="w-20 h-20 rounded-full bg-purple-900/30 mx-auto" />
        <Skeleton className="h-10 w-full bg-purple-900/30 rounded-lg" />
        <Skeleton className="h-24 w-full bg-purple-900/30 rounded-lg" />
        <Skeleton className="h-10 w-full bg-purple-900/30 rounded-lg" />
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

  if (authLoading || profileLoading) return <EditProfileSkeleton />;
  if (!isAuthenticated) return null;
  if (!profile || !profile.handle) return <EditProfileSkeleton />;

  return (
    <div className="px-4 sm:px-6 py-10 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/profile/$handle",
              params: { handle: profile.handle ?? userId },
            })
          }
          className="w-9 h-9 rounded-lg bg-card/50 border border-border hover:bg-accent/10 hover:border-accent/30 flex items-center justify-center transition-smooth text-muted-foreground hover:text-accent"
          aria-label="Go back to profile"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Edit Profile
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Update your public information
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-midnight-card border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-elevated space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-accent/40 glow-accent-sm"
                    onError={() => setAvatarPreview(null)}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-display font-bold text-white border-2 border-accent/40 glow-accent-sm"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
                    }}
                  >
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent border-2 border-background flex items-center justify-center hover:bg-accent/80 transition-smooth"
                >
                  {uploading ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                className="text-xs text-accent font-body hover:underline disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Change photo"}
              </button>

              <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                <User className="w-3 h-3" />@{profile.handle}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="displayName" className="text-sm font-medium text-foreground font-body">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <span className={`text-xs font-body ${displayName.length > MAX_DISPLAY_NAME * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
                  {displayName.length}/{MAX_DISPLAY_NAME}
                </span>
              </div>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME))}
                placeholder="Your display name"
                className="bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 transition-smooth"
                maxLength={MAX_DISPLAY_NAME}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="bio" className="text-sm font-medium text-foreground font-body">
                  Bio
                </Label>
                <span className={`text-xs font-body ${bio.length > MAX_BIO * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
                  {bio.length}/{MAX_BIO}
                </span>
              </div>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO))}
                placeholder="Tell readers a little about yourself…"
                rows={4}
                className="bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 resize-none transition-smooth"
                maxLength={MAX_BIO}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={updateProfile.isPending || uploading || !displayName.trim()}
                className="flex-1 bg-accent hover:bg-accent/85 text-white font-body font-semibold gap-2 transition-smooth disabled:opacity-50"
              >
                {updateProfile.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
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
                className="flex-1 border-border/50 text-muted-foreground hover:text-foreground hover:border-border font-body transition-smooth"
              >
                Cancel
              </Button>
            </div>

            {updateProfile.isError && (
              <p className="text-xs text-destructive font-body text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
