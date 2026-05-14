import Map "mo:core/Map";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";
import GenreTypes "types/genres";
import Types "types/common";

module {
  // ── Old types (copied from .old/src/backend/types/common.mo) ─────────────
  type OldComicId = Text;
  type OldChapterId = Text;
  type OldUserId = Principal;
  type OldTimestamp = Int;
  type OldProfileId = Text;

  type OldComic = {
    id : OldComicId;
    author_id : OldUserId;
    title : Text;
    description : Text;
    cover_blob : Storage.ExternalBlob;
    is_deleted : Bool;
    created_at : OldTimestamp;
    updated_at : OldTimestamp;
  };

  type OldChapter = {
    id : OldChapterId;
    comic_id : OldComicId;
    number : Float;
    title : Text;
    image_blobs : [Storage.ExternalBlob];
    is_published : Bool;
    is_deleted : Bool;
    created_at : OldTimestamp;
    updated_at : OldTimestamp;
  };

  type OldUploadStatus = { #draft; #uploading; #published; #failed };

  type OldUploadSession = {
    chapter_id : OldChapterId;
    uploaded_blobs : [Storage.ExternalBlob];
    status : OldUploadStatus;
    started_at : OldTimestamp;
    updated_at : OldTimestamp;
  };

  type OldUserProfile = {
    id : OldProfileId;
    auth_id : Text;
    handle : Text;
    display_name : Text;
    bio : Text;
    profile_picture_url : ?Text;
    is_creator : Bool;
    created_at : OldTimestamp;
    updated_at : OldTimestamp;
  };

  type OldReadProgress = {
    user_id : OldProfileId;
    chapter_id : OldChapterId;
    comic_id : OldComicId;
    scroll_pixel_y : Nat;
    last_read_at : OldTimestamp;
  };

  type OldTrendingEntry = {
    comic_id : OldComicId;
    hot_score : Float;
    views : Nat;
    last_updated : OldTimestamp;
  };

  // ── Migration record types ────────────────────────────────────────────────
  type OldActor = {
    comics : Map.Map<OldComicId, OldComic>;
    comicCounter : { var next : Nat };
    chapters : Map.Map<OldChapterId, OldChapter>;
    chapterCounter : { var next : Nat };
    uploads : Map.Map<OldChapterId, OldUploadSession>;
    profiles : Map.Map<OldProfileId, OldUserProfile>;
    readProgress : Map.Map<Text, OldReadProgress>;
    trending : Map.Map<OldComicId, OldTrendingEntry>;
    accessControlState : AccessControl.AccessControlState;
  };

  type NewActor = {
    comics : Map.Map<Types.ComicId, Types.Comic>;
    comicCounter : { var next : Nat };
    chapters : Map.Map<Types.ChapterId, Types.Chapter>;
    chapterCounter : { var next : Nat };
    uploads : Map.Map<Types.ChapterId, Types.UploadSession>;
    profiles : Map.Map<Types.ProfileId, Types.UserProfile>;
    readProgress : Map.Map<Text, Types.ReadProgress>;
    trending : Map.Map<Types.ComicId, Types.TrendingEntry>;
    genres : Map.Map<GenreTypes.GenreId, GenreTypes.Genre>;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate comics: add genre_ids = [] to each comic
    let comics = old.comics.map<OldComicId, OldComic, Types.Comic>(
      func(_, c) {
        { c with genre_ids = [] : [Text] }
      }
    );

    {
      comics;
      comicCounter = old.comicCounter;
      chapters = old.chapters;
      chapterCounter = old.chapterCounter;
      uploads = old.uploads;
      profiles = old.profiles;
      readProgress = old.readProgress;
      trending = old.trending;
      genres = Map.empty<GenreTypes.GenreId, GenreTypes.Genre>();
      accessControlState = old.accessControlState;
    };
  };
};
