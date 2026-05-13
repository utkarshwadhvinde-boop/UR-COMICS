import Storage "mo:caffeineai-object-storage/Storage";

module {
  // Shared primitive aliases
  public type ComicId = Text;
  public type ChapterId = Text;
  public type UserId = Principal;
  public type Timestamp = Int;

  // ── Comics ──────────────────────────────────────────────────────────────
  public type Comic = {
    id : ComicId;
    author_id : UserId;
    title : Text;
    description : Text;
    cover_blob : Storage.ExternalBlob;
    is_deleted : Bool;
    created_at : Timestamp;
    updated_at : Timestamp;
  };

  // Shared (API-boundary) view of a comic – no mutable fields
  public type ComicView = {
    id : ComicId;
    author_id : UserId;
    title : Text;
    description : Text;
    cover_blob : Storage.ExternalBlob;
    created_at : Timestamp;
    updated_at : Timestamp;
  };

  public type CreateComicArgs = {
    title : Text;
    description : Text;
    cover_blob : Storage.ExternalBlob;
  };

  public type UpdateComicArgs = {
    title : Text;
    description : Text;
    cover_blob : Storage.ExternalBlob;
  };

  // ── Chapters ─────────────────────────────────────────────────────────────
  public type Chapter = {
    id : ChapterId;
    comic_id : ComicId;
    number : Float;
    title : Text;
    image_blobs : [Storage.ExternalBlob];
    is_published : Bool;
    is_deleted : Bool;
    created_at : Timestamp;
    updated_at : Timestamp;
  };

  public type ChapterView = {
    id : ChapterId;
    comic_id : ComicId;
    number : Float;
    title : Text;
    image_blobs : [Storage.ExternalBlob];
    is_published : Bool;
    created_at : Timestamp;
    updated_at : Timestamp;
  };

  public type CreateChapterArgs = {
    comic_id : ComicId;
    number : Float;
    title : Text;
  };

  public type UpdateChapterDraftArgs = {
    title : Text;
    number : Float;
  };

  // ── Upload Registry ───────────────────────────────────────────────────────
  public type UploadStatus = {
    #draft;
    #uploading;
    #published;
    #failed;
  };

  public type UploadSession = {
    chapter_id : ChapterId;
    uploaded_blobs : [Storage.ExternalBlob];
    status : UploadStatus;
    started_at : Timestamp;
    updated_at : Timestamp;
  };

  // ── User Profiles ─────────────────────────────────────────────────────────
  public type ProfileId = Text;

  public type UserProfile = {
    id : ProfileId;
    auth_id : Text;
    handle : Text;
    display_name : Text;
    bio : Text;
    profile_picture_url : ?Text;
    is_creator : Bool;
    created_at : Timestamp;
    updated_at : Timestamp;
  };

  public type UpdateProfileRequest = {
    display_name : ?Text;
    bio : ?Text;
    profile_picture_url : ?Text;
  };

  // ── Read Progress ─────────────────────────────────────────────────────────
  public type ReadProgress = {
    user_id : ProfileId;
    chapter_id : ChapterId;
    comic_id : ComicId;
    scroll_pixel_y : Nat;
    last_read_at : Timestamp;
  };

  public type SaveReadProgressRequest = {
    chapter_id : ChapterId;
    comic_id : ComicId;
    scroll_pixel_y : Nat;
  };

  // ── Trending ──────────────────────────────────────────────────────────────
  public type TrendingEntry = {
    comic_id : ComicId;
    hot_score : Float;
    views : Nat;
    last_updated : Timestamp;
  };

  // ── Social stubs (Phase 2) ────────────────────────────────────────────────
  public type LikeId = Text;
  public type CommentId = Text;
  public type FollowId = Text;

  public type Like = {
    id : LikeId;
    user_id : UserId;
    target_id : Text;
    target_type : { #comic; #chapter };
    created_at : Timestamp;
  };

  public type Comment = {
    id : CommentId;
    user_id : UserId;
    target_id : Text;
    target_type : { #comic; #chapter };
    body : Text;
    is_deleted : Bool;
    created_at : Timestamp;
    updated_at : Timestamp;
  };

  public type Follow = {
    id : FollowId;
    follower_id : UserId;
    following_id : UserId;
    created_at : Timestamp;
  };
};
