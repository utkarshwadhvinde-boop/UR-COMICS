import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useComics } from "@/hooks/useComics";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, BookOpen, Edit2, Eye } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Comic } from "@/types/index"; 

function ProfileSkeleton() {
  return (
    <div
      className="px-4 sm:px-6 py-10 max-w-4xl mx-auto"
      data-ocid="profile.loading_state"
      style={{ boxSizing: "border-box" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px", boxSizing: "border-box" }} className="sm:flex-row sm:items-start">
        <Skeleton className="w-24 h-24 shrink-0" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.1)", border: "2px solid #111111" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1, width: "100%", boxSizing: "border-box" }}>
          <Skeleton className="h-7 w-48" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
          <Skeleton className="h-4 w-28" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
          <Skeleton className="h-4 w-full max-w-sm" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.1)" }} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" style={{ boxSizing: "border-box" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ backgroundColor: "#ffffff", border: "2px solid #111111", boxShadow: "3px 3px 0px #111111", padding: "8px", boxSizing: "border-box" }}>
            <Skeleton className="w-full aspect-[9/14]" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.08)" }} />
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <Skeleton className="h-4 w-3/4" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.08)" }} />
              <Skeleton className="h-3 w-1/2" style={{ borderRadius: 0, backgroundColor: "rgba(17, 17, 17, 0.05)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComicCard({
  comic,
  index,
}: {
  comic: import("@/types/index").Comic;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.07, 0.5) }}
      data-ocid={`profile.comic.item.${index + 1}`}
      style={{ boxSizing: "border-box" }}
    >
      <Link
        to="/comics/$comicId"
        params={{ comicId: comic.id }}
        data-ocid={`profile.comic.link.${index + 1}`}
        style={{ textDecoration: "none", display: "block", boxSizing: "border-box" }}
      >
        <div 
          style={{
            width: "100%",
            aspectRatio: "9/14",
            borderRadius: "0px",
            overflow: "hidden",
            position: "relative",
            background: "#ffffff",
            border: "2px solid #111111",
            boxShadow: "3px 3px 0px #111111",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            transition: "transform 0.1s ease, box-shadow 0.1s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "5px 5px 0px #111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
          }}
        >
          {/* Cover Media Canvas Area */}
          <div style={{ flexGrow: 1, width: "100%", position: "relative", overflow: "hidden", background: "#f5f0e8", boxSizing: "border-box" }}>
            {comic.cover_url ? (
              <img
                src={comic.cover_url}
                alt={comic.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen style={{ width: 24, height: 24, color: "#111111" }} />
              </div>
            )}
          </div>

          {/* Descriptive Info Label */}
          <div style={{
            padding: "10px 8px",
            background: "#ffffff",
            borderTop: "2px solid #111111",
            boxSizing: "border-box"
          }}>
            <h3 style={{
              color: "#111111",
              fontSize: "13px",
              fontFamily: "serif",
              fontWeight: "900",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxSizing: "border-box"
            }}>
              {comic.title}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", boxSizing: "border-box" }}>
              <Eye style={{ width: "12px", height: "12px", color: "#555555" }} />
              <span style={{ fontSize: "10px", fontFamily: "monospace, sans-serif", textTransform: "uppercase", color: "#555555" }}>
                View Comic
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProfilePage() {
  const { handle } = useParams({ strict: false }) as { handle: string };
  const { data: profile, isLoading, error, refetch } = useProfile(handle);
  const { data: allComics } = useComics();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedComics, setSavedComics] = useState<Comic[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookmarks")
      .select("comic_id, comics(*)")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const comics = data.map((b: any) => b.comics).filter(Boolean);
          setSavedComics(comics);
        }
      });
  }, [user]);

  const isOwnProfile = !!profile && !!user && profile.id === user.id;
  const creatorComics = (allComics ?? []).filter(
    (c) => profile && c.author_id === profile.id,
  );

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (handle?.slice(0, 2).toUpperCase() ?? "??");

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", width: "100%" }}>
        <ProfileSkeleton />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[80vh] px-4"
        data-ocid="profile.error_state"
        style={{
          backgroundColor: "#f5f0e8",
          backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
          backgroundSize: "12px 12px",
          boxSizing: "border-box"
        }}
      >
        <div style={{
          background: "#ffffff",
          border: "2px solid #111111",
          boxShadow: "4px 4px 0px #111111",
          padding: "40px 24px",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
          boxSizing: "border-box"
        }}>
          <AlertCircle style={{ width: "40px", height: "40px", color: "#cc0000", margin: "0 auto 16px auto" }} />
          <h2 style={{ fontFamily: "monospace, sans-serif", textTransform: "uppercase", fontSize: "20px", fontWeight: "900", color: "#111111", margin: "0 0 8px 0" }}>
            Profile Not Found
          </h2>
          <p style={{ fontFamily: "serif", fontSize: "14px", color: "#555555", margin: "0 0 24px 0" }}>
            We couldn't locate a valid profile record for <span style={{ fontWeight: "bold", color: "#111111" }}>@{handle}</span>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", boxSizing: "border-box" }}>
            <button
              type="button"
              onClick={() => refetch()}
              data-ocid="profile.retry_button"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fbbf24",
                border: "2px solid #111111",
                fontFamily: "monospace, sans-serif",
                fontWeight: "900",
                textTransform: "uppercase",
                color: "#111111",
                cursor: "pointer",
                boxShadow: "2px 2px 0px #111111"
              }}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              data-ocid="profile.home_button"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#ffffff",
                border: "2px solid #111111",
                fontFamily: "monospace, sans-serif",
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#555555",
                cursor: "pointer",
                boxShadow: "2px 2px 0px #111111"
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="px-4 sm:px-6 py-10 max-w-4xl mx-auto"
      data-ocid="profile.page"
      style={{
        backgroundColor: "#f5f0e8",
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        minHeight: "100vh",
        color: "#111111",
        boxSizing: "border-box"
      }}
    >
      {/* Profile Passport Info Header Card Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          backgroundColor: "#ffffff",
          border: "4px solid #111111",
          boxShadow: "5px 5px 0px #111111",
          padding: "24px",
          marginBottom: "32px",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }} className="sm:flex-row sm:items-start">
          {/* Avatar Graphic Canvas */}
          <div style={{ shrink: 0, display: "flex", justifyContent: "center", boxSizing: "border-box" }} data-ocid="profile.avatar">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name ?? ""}
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "0px",
                  objectFit: "cover",
                  border: "3px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                  boxSizing: "border-box"
                }}
              />
            ) : (
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
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
          </div>

          {/* Identity Info Typography Block */}
          <div style={{ flexGrow: 1, minWidth: "0", display: "flex", flexDirection: "column", boxSizing: "border-box" }} className="text-center sm:text-left">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "4px", boxSizing: "border-box" }} className="sm:flex-row sm:items-center">
              <h1 style={{
                fontFamily: "serif",
                fontSize: "26px",
                fontWeight: "900",
                color: "#111111",
                margin: 0,
                lineHeight: "1.2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                boxSizing: "border-box"
              }}>
                {profile.display_name}
              </h1>
              {profile.is_creator && (
                <span
                  data-ocid="profile.creator_badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    backgroundColor: "#111111",
                    color: "#ffffff",
                    fontFamily: "monospace, sans-serif",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    width: "fit-content",
                    margin: "0 auto",
                    boxSizing: "border-box"
                  }}
                  className="sm:ml-2 sm:margin-0"
                >
                  <BookOpen style={{ width: "11px", height: "11px", color: "#fbbf24" }} />
                  Creator
                </span>
              )}
            </div>
            
            <p style={{ margin: "0 0 12px 0", fontFamily: "monospace, sans-serif", fontSize: "13px", color: "#555555", fontWeight: "bold" }}>
              @{profile.handle ?? handle}
            </p>
            
            {profile.bio && (
              <p style={{
                margin: 0,
                fontFamily: "serif",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333333",
                maxWidth: "500px",
                boxSizing: "border-box"
              }}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Edit Account Button Block (Restricted Visibility) */}
          {isOwnProfile && (
            <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
              <Link
                to="/profile/$handle/edit"
                params={{ handle: profile.handle ?? profile.id }}
                data-ocid="profile.edit_button"
                style={{ textDecoration: "none", boxSizing: "border-box" }}
              >
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    backgroundColor: "#fbbf24",
                    border: "2px solid #111111",
                    boxShadow: "2px 2px 0px #111111",
                    color: "#111111",
                    fontFamily: "monospace, sans-serif",
                    fontSize: "12px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                >
                  <Edit2 style={{ width: "12px", height: "12px" }} />
                  Edit Profile
                </button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Saved Comics Grid Listing Block */}
      {isOwnProfile && savedComics.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          style={{ marginBottom: "40px", boxSizing: "border-box" }}
        >
          {/* Section Split Indicator Header */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", boxSizing: "border-box" }}>
              <div style={{ width: "28px", height: "28px", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                <span style={{ fontSize: "14px" }}>🔖</span>
              </div>
              <h2 style={{ fontFamily: "monospace, sans-serif", fontSize: "18px", fontWeight: "900", textTransform: "uppercase", margin: 0, color: "#111111" }}>
                Saved Bookmarks
              </h2>
              <span style={{ fontFamily: "monospace, sans-serif", fontSize: "12px", fontWeight: "bold", backgroundColor: "#111111", color: "#ffffff", padding: "2px 6px", boxSizing: "border-box" }}>
                {savedComics.length}
              </span>
            </div>
            <div style={{ marginTop: "10px", width: "100%", height: "2px", backgroundColor: "#111111", boxSizing: "border-box" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" style={{ boxSizing: "border-box" }}>
            {savedComics.map((comic, i) => (
              <ComicCard key={comic.id} comic={comic} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Creator Dashboard Publications Section Block */}
      {profile.is_creator && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          data-ocid="profile.comics_section"
          style={{ boxSizing: "border-box" }}
        >
          {/* Section Split Indicator Header */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", boxSizing: "border-box" }}>
              <div style={{ width: "28px", height: "28px", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                <BookOpen style={{ width: "14px", height: "14px", color: "#fbbf24" }} />
              </div>
              <h2 style={{ fontFamily: "monospace, sans-serif", fontSize: "18px", fontWeight: "900", textTransform: "uppercase", margin: 0, color: "#111111" }}>
                Published Issues
              </h2>
              {creatorComics.length > 0 && (
                <span style={{ fontFamily: "monospace, sans-serif", fontSize: "12px", fontWeight: "bold", backgroundColor: "#111111", color: "#ffffff", padding: "2px 6px", boxSizing: "border-box" }}>
                  {creatorComics.length}
                </span>
              )}
            </div>
            <div style={{ marginTop: "10px", width: "100%", height: "2px", backgroundColor: "#111111", boxSizing: "border-box" }} />
          </div>

          {creatorComics.length === 0 ? (
            /* Blank Publication Display Panel Panel Box */
            <div
              data-ocid="profile.comics.empty_state"
              style={{
                textAlign: "center",
                padding: "40px 16px",
                backgroundColor: "#ffffff",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
                maxWidth: "400px",
                margin: "12px au
