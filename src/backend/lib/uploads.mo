import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/common";
import ChaptersLib "chapters";

module {
  public func beginUpload(
    uploads : Map.Map<Types.ChapterId, Types.UploadSession>,
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    chapter_id : Types.ChapterId,
  ) : Types.UploadSession {
    let chapter = switch (chapters.get(chapter_id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    if (chapter.is_deleted) { Runtime.trap("Chapter not found") };
    if (chapter.is_published) { Runtime.trap("Chapter is already published") };
    // Ownership check
    let comic = switch (comics.get(chapter.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized: only the comic author can upload images");
    };
    let now = Time.now();
    let session : Types.UploadSession = {
      chapter_id;
      uploaded_blobs = [];
      status = #uploading;
      started_at = now;
      updated_at = now;
    };
    uploads.add(chapter_id, session);
    session;
  };

  public func registerUploadedImage(
    uploads : Map.Map<Types.ChapterId, Types.UploadSession>,
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    chapter_id : Types.ChapterId,
    blob : Storage.ExternalBlob,
  ) : Types.UploadSession {
    // Ownership check
    let chapter = switch (chapters.get(chapter_id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    let comic = switch (comics.get(chapter.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized");
    };
    let session = switch (uploads.get(chapter_id)) {
      case (?s) s;
      case null { Runtime.trap("No active upload session for this chapter") };
    };
    if (session.status != #uploading) {
      Runtime.trap("Upload session is not in uploading state");
    };
    let updated : Types.UploadSession = {
      session with
      uploaded_blobs = session.uploaded_blobs.concat([blob]);
      updated_at = Time.now();
    };
    uploads.add(chapter_id, updated);
    updated;
  };

  public func commitUpload(
    uploads : Map.Map<Types.ChapterId, Types.UploadSession>,
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    chapter_id : Types.ChapterId,
  ) : Types.ChapterView {
    // Ownership check
    let chapter = switch (chapters.get(chapter_id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    let comic = switch (comics.get(chapter.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized");
    };
    let session = switch (uploads.get(chapter_id)) {
      case (?s) s;
      case null { Runtime.trap("No active upload session for this chapter") };
    };
    if (session.status != #uploading) {
      Runtime.trap("Upload session is not in uploading state");
    };
    if (session.uploaded_blobs.size() == 0) {
      Runtime.trap("No images have been registered for this upload session");
    };
    // Publish chapter with the uploaded blobs
    let view = ChaptersLib.publishChapter(chapters, chapter_id, session.uploaded_blobs);
    // Mark session as published
    uploads.add(chapter_id, { session with status = #published; updated_at = Time.now() });
    view;
  };

  public func rollbackUpload(
    uploads : Map.Map<Types.ChapterId, Types.UploadSession>,
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    chapter_id : Types.ChapterId,
  ) : Nat {
    // Ownership check
    let chapter = switch (chapters.get(chapter_id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    let comic = switch (comics.get(chapter.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized");
    };
    let count = switch (uploads.get(chapter_id)) {
      case (?session) {
        let n = session.uploaded_blobs.size();
        // Mark session as failed
        uploads.add(chapter_id, { session with status = #failed; updated_at = Time.now() });
        n;
      };
      case null 0;
    };
    // Reset chapter back to draft (clear published state if it was set)
    switch (chapters.get(chapter_id)) {
      case (?ch) {
        if (ch.is_published) {
          chapters.add(chapter_id, {
            ch with
            image_blobs = [];
            is_published = false;
            updated_at = Time.now();
          });
        };
      };
      case null {};
    };
    count;
  };
};
