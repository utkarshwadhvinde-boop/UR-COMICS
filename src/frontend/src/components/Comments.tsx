import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_id: string | null;
  like_count: number;
  created_at: string;
  profiles?: { display_name: string; avatar_url: string | null };
  liked?: boolean;
  replies?: Comment[];
}

type SortType = "top" | "newest" | "oldest";

interface CommentsProps {
  comicId: string;
  chapterId?: string;
  creatorId?: string;
}

export function Comments({ comicId, chapterId, creatorId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sort, setSort] = useState<SortType>("top");
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    let query = supabase
      .from("comments")
      .select("*, profiles(display_name, avatar_url)")
      .eq("comic_id", comicId)
      .is("parent_id", null);

    if (chapterId) query = query.eq("chapter_id", chapterId);
    else query = query.is("chapter_id", null);

    if (sort === "newest") query = query.order("created_at", { ascending: false });
    else if (sort === "oldest") query = query.order("created_at", { ascending: true });
    else query = query.order("like_count", { ascending: false });

    const { data } = await query;
    if (!data) { setLoading(false); return; }

    // Get replies
    const withReplies = await Promise.all(data.map(async (c) => {
      const { data: replies } = await supabase
        .from("comments")
        .select("*, profiles(display_name, avatar_url)")
        .eq("parent_id", c.id)
        .order("created_at", { ascending: true });

      // Check if user liked
      let liked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from("comment_likes")
          .select("id")
          .eq("comment_id", c.id)
          .eq("user_id", user.id)
          .single();
        liked = !!likeData;
      }

      return { ...c, replies: replies ?? [], liked };
    }));

    setComments(withReplies);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [comicId, chapterId, sort, user]);

  const handlePost = async () => {
    if (!user || !newComment.trim()) return;
    await supabase.from("comments").insert({
      comic_id: comicId,
      chapter_id: chapterId ?? null,
      user_id: user.id,
      content: newComment.trim(),
      parent_id: null,
    });
    setNewComment("");
    fetchComments();
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return;
    await supabase.from("comments").insert({
      comic_id: comicId,
      chapter_id: chapterId ?? null,
      user_id: user.id,
      content: replyText.trim(),
      parent_id: parentId,
    });
    setReplyTo(null);
    setReplyText("");
    fetchComments();
  };

  const handleLike = async (commentId: string, liked: boolean) => {
    if (!user) return;
    if (liked) {
      await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id);
      await supabase.from("comments").update({ like_count: supabase.rpc("decrement", { x: 1 }) }).eq("id", commentId);
    } else {
      await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: user.id });
      await supabase.from("comments").update({ like_count: supabase.rpc("increment", { x: 1 }) }).eq("id", commentId);
    }
    fetchComments();
  };

  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (!user) return;
    if (user.id !== commentUserId && user.id !== creatorId) return;
    await supabase.from("comments").delete().eq("id", commentId);
    fetchComments();
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div style={{ marginLeft: isReply ? "32px" : "0", marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Avatar */}
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "12px", fontWeight: 700,
        }}>
          {comment.profiles?.display_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>
              {comment.profiles?.display_name ?? "User"}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", margin: "0 0 8px", lineHeight: 1.5 }}>
            {comment.content}
          </p>
          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              onClick={() => handleLike(comment.id, comment.liked ?? false)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: comment.liked ? "#ff3232" : "rgba(255,255,255,0.4)", fontSize: "12px" }}
            >
              {comment.liked ? "❤️" : "🤍"} {comment.like_count}
            </button>
            {!isReply && user && (
              <button
                type="button"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
              >
                💬 Reply
              </button>
            )}
            {user && (user.id === comment.user_id || user.id === creatorId) && (
              <button
                type="button"
                onClick={() => handleDelete(comment.id, comment.user_id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,100,100,0.5)", fontSize: "12px" }}
              >
                🗑️
              </button>
            )}
          </div>
          {/* Reply input */}
          {replyTo === comment.id && user && (
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", fontSize: "13px", outline: "none" }}
              />
              <button
                type="button"
                onClick={() => handleReply(comment.id)}
                style={{ padding: "8px 14px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Replies */}
      {comment.replies && comment.replies.map(reply => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

  return (
    <div style={{ padding: "24px 0" }}>
      <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, margin: "0 0 16px" }}>
        💬 Comments ({comments.length})
      </h3>

      {/* Sort bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["top", "newest", "oldest"] as SortType[]).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setSort(s)}
            style={{
              padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none",
              background: sort === s ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "rgba(255,255,255,0.05)",
              color: sort === s ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          >
            {s === "top" ? "🔥 Top" : s === "newest" ? "🆕 Newest" : "📅 Oldest"}
          </button>
        ))}
      </div>

      {/* Comment input */}
      {user ? (
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.2)", color: "#fff", fontSize: "14px", outline: "none" }}
          />
          <button
            type="button"
            onClick={handlePost}
            style={{ padding: "12px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", border: "none", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
          >
            Post
          </button>
        </div>
      ) : (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "24px" }}>
          Login to comment
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>No comments yet. Be the first! 🎉</p>
      ) : (
        comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
      )}

      <style>{`input::placeholder { color: rgba(255,255,255,0.3); }`}</style>
    </div>
  );
}
