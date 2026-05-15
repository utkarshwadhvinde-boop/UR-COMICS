import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MAX_DISPLAY_NAME = 100;
const MAX_BIO = 300;

function EditProfileSkeleton() {
  return (
    <div
      className="px-4 sm:px-6 py-10 max-w-xl mx-auto"
      data-ocid="edit_profile.loading_state"
    >
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
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id ?? "";

  const { data: profile, isLoading } = useProfile(userId);
  const updateProfile = useUpdateProfile(userId);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setProfilePictureUrl(profile.avatar_url ?? "");
      setAvatarPreview(profile.avatar_url ?? null);
    }
  }, [profile]);

  const initials = (displayName || profile?.display_name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleAvatarUrlChange(url: string) {
    setProfilePictureUrl(url);
    setAvatarPreview(url.trim() ? url.trim() : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Display name is required.");
      return;
    }
    try {
      const updated = await updateProfile.mutateAsync({
        display_name: displayName.trim(),
        bio: bio.trim() || undefined,
        avatar_url: profilePictureUrl.trim() || undefined,
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

  if (!isAuthenticated && !isLoading) return null;
  if (isLoading || !profile || !profile.handle) return <EditProfileSkeleton />;

  return (
    <div
      className="px-4 sm:px-6 py-10 max-w-xl mx-auto"
      data-ocid="edit_profile.page"
    >
      {/* Page header */}
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
          data-ocid="edit_profile.back_button"
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
        <form onSubmit={handleSubmit} data-ocid="edit_profile.form">
          <div className="bg-midnight-card border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-elevated space-y-6">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-3">
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
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
                  }}
                >
                  {initials}
                </div>
              )}
              <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                <User className="w-3 h-3" />@{profile.handle}
              </p>
            </div>

            {/* Display Name */}
            <div
              className="space-y-1.5"
              data-ocid="edit_profile.display_name_field"
            >
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="displayName"
                  className="text-sm font-medium text-foreground font-body"
                >
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <span
                  className={`text-xs font-body ${
                    displayName.length > MAX_DISPLAY_NAME * 0.9
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {displayName.length}/{MAX_DISPLAY_NAME}
                </span>
              </div>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) =>
                  setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME))
                }
                placeholder="Your display name"
                className="bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 transition-smooth"
                maxLength={MAX_DISPLAY_NAME}
                data-ocid="edit_profile.display_name_input"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5" data-ocid="edit_profile.bio_field">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-foreground font-body"
                >
                  Bio
                </Label>
                <span
                  className={`text-xs font-body ${
                    bio.length > MAX_BIO * 0.9
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
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
                data-ocid="edit_profile.bio_textarea"
              />
            </div>

            {/* Profile Picture URL */}
            <div
              className="space-y-1.5"
              data-ocid="edit_profile.avatar_url_field"
            >
              <Label
                htmlFor="profilePictureUrl"
                className="text-sm font-medium text-foreground font-body"
              >
                Profile Picture URL
              </Label>
              <Input
                id="profilePictureUrl"
                type="url"
                value={profilePictureUrl}
                onChange={(e) => handleAvatarUrlChange(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 transition-smooth"
                data-ocid="edit_profile.avatar_url_input"
              />
              <p className="text-xs text-muted-foreground font-body">
                Paste a direct image URL to set your avatar.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={updateProfile.isPending || !displayName.trim()}
                className="flex-1 bg-accent hover:bg-accent/85 text-white font-body font-semibold gap-2 transition-smooth disabled:opacity-50"
                data-ocid="edit_profile.submit_button"
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
                data-ocid="edit_profile.cancel_button"
              >
                Cancel
              </Button>
            </div>

            {/* Mutation error */}
            {updateProfile.isError && (
              <p
                className="text-xs text-destructive font-body text-center"
                data-ocid="edit_profile.error_state"
              >
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
