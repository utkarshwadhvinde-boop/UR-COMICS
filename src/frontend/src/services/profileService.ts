import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/index";

export async function getProfile(handleOrId: string): Promise<UserProfile | null> {
  if (!handleOrId || handleOrId.trim() === "") {
    console.error("getProfile: handleOrId cannot be empty");
    return null;
  }

  try {
    // Try by handle first
    const { data: byHandle, error: handleError } = await supabase
      .from("users")
      .select("*")
      .eq("handle", handleOrId)
      .single();

    if (byHandle) return byHandle as UserProfile;

    // Fall back to id if handle not found (not an error)
    if (handleError?.code === "PGRST116") {
      const { data: byId, error: idError } = await supabase
        .from("users")
        .select("*")
        .eq("id", handleOrId)
        .single();

      if (idError && idError.code !== "PGRST116") {
        console.error("getProfile error:", idError);
      }
      return byId ? (byId as UserProfile) : null;
    }

    if (handleError) {
      console.error("getProfile error:", handleError);
    }
    return null;
  } catch (error) {
    console.error("getProfile exception:", error);
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    handle?: string;
  },
): Promise<UserProfile> {
  if (!userId || userId.trim() === "") {
    throw new Error("updateProfile: userId cannot be empty");
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("updateProfile error:", error);
      throw error;
    }

    if (!data) {
      throw new Error("updateProfile: No data returned from update");
    }

    return data as UserProfile;
  } catch (error) {
    console.error("updateProfile exception:", error);
    throw error;
  }
}

export async function getCreatorProfile(
  userId: string,
): Promise<UserProfile | null> {
  if (!userId || userId.trim() === "") {
    console.error("getCreatorProfile: userId cannot be empty");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("getCreatorProfile error:", error);
      }
      return null;
    }

    return data ? (data as UserProfile) : null;
  } catch (error) {
    console.error("getCreatorProfile exception:", error);
    return null;
  }
}

export async function markAsCreator(userId: string): Promise<void> {
  if (!userId || userId.trim() === "") {
    throw new Error("markAsCreator: userId cannot be empty");
  }

  try {
    const { error } = await supabase
      .from("users")
      .update({
        is_creator: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("markAsCreator error:", error);
      throw error;
    }
  } catch (error) {
    console.error("markAsCreator exception:", error);
    throw error;
  }
}

export async function saveReadProgress(
  userId: string,
  comicId: string,
  lastChapterId: string,
  lastPageNumber: number,
): Promise<void> {
  if (!userId || userId.trim() === "") {
    throw new Error("saveReadProgress: userId cannot be empty");
  }

  if (!comicId || comicId.trim() === "") {
    throw new Error("saveReadProgress: comicId cannot be empty");
  }

  if (lastPageNumber < 1) {
    throw new Error("saveReadProgress: lastPageNumber must be >= 1");
  }

  try {
    const { error } = await supabase.from("bookmarks").upsert(
      {
        user_id: userId,
        comic_id: comicId,
        last_chapter_id: lastChapterId,
        last_page_number: lastPageNumber,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,comic_id" },
    );

    if (error) {
      console.error("saveReadProgress error:", error);
      throw error;
    }
  } catch (error) {
    console.error("saveReadProgress exception:", error);
    throw error;
  }
}

export async function getReadProgress(
  userId: string,
  comicId: string,
): Promise<{
  last_chapter_id: string | null;
  last_page_number: number;
} | null> {
  if (!userId || userId.trim() === "") {
    console.error("getReadProgress: userId cannot be empty");
    return null;
  }

  if (!comicId || comicId.trim() === "") {
    console.error("getReadProgress: comicId cannot be empty");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("last_chapter_id, last_page_number")
      .eq("user_id", userId)
      .eq("comic_id", comicId)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("getReadProgress error:", error);
      }
      return null;
    }

    return data ? { last_chapter_id: data.last_chapter_id, last_page_number: data.last_page_number } : null;
  } catch (error) {
    console.error("getReadProgress exception:", error);
    return null;
  }
}

export async function getResumeReading(
  userId: string,
  limit = 3,
): Promise<import("@/types/index").Comic[]> {
  if (!userId || userId.trim() === "") {
    console.error("getResumeReading: userId cannot be empty");
    return [];
  }

  if (limit < 1) {
    console.error("getResumeReading: limit must be >= 1");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("comic_id, comics(*)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getResumeReading error:", error);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? [])
      .map((b: any) => b.comics)
      .filter(Boolean);
  } catch (error) {
    console.error("getResumeReading exception:", error);
    return [];
  }
}
