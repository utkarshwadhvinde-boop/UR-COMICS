import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/common";
import ChaptersLib "../lib/chapters";
import UploadsLib "../lib/uploads";

mixin (
  accessControlState : AccessControl.AccessControlState,
  comics : Map.Map<Types.ComicId, Types.Comic>,
  chapters : Map.Map<Types.ChapterId, Types.Chapter>,
  uploads : Map.Map<Types.ChapterId, Types.UploadSession>,
  chapterCounter : { var next : Nat },
) {
  // ── Creator-only mutations ────────────────────────────────────────────────

  public shared ({ caller }) func createChapter(args : Types.CreateChapterArgs) : async Types.ChapterView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to create a chapter");
    };
    ChaptersLib.createChapter(chapters, comics, chapterCounter, caller, args);
  };

  public shared ({ caller }) func updateChapterDraft(id : Types.ChapterId, args : Types.UpdateChapterDraftArgs) : async Types.ChapterView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to update a chapter");
    };
    ChaptersLib.updateChapterDraft(chapters, comics, caller, id, args);
  };

  public shared ({ caller }) func deleteChapter(id : Types.ChapterId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to delete a chapter");
    };
    ChaptersLib.deleteChapter(chapters, comics, caller, id);
  };

  // ── Upload pipeline ───────────────────────────────────────────────────────

  public shared ({ caller }) func beginUpload(chapter_id : Types.ChapterId) : async Types.UploadSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to upload");
    };
    UploadsLib.beginUpload(uploads, chapters, comics, caller, chapter_id);
  };

  public shared ({ caller }) func registerUploadedImage(chapter_id : Types.ChapterId, blob : Storage.ExternalBlob) : async Types.UploadSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to upload");
    };
    UploadsLib.registerUploadedImage(uploads, chapters, comics, caller, chapter_id, blob);
  };

  public shared ({ caller }) func commitUpload(chapter_id : Types.ChapterId) : async Types.ChapterView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to commit upload");
    };
    UploadsLib.commitUpload(uploads, chapters, comics, caller, chapter_id);
  };

  public shared ({ caller }) func rollbackUpload(chapter_id : Types.ChapterId) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to rollback upload");
    };
    UploadsLib.rollbackUpload(uploads, chapters, comics, caller, chapter_id);
  };

  // ── Public reads ──────────────────────────────────────────────────────────

  public query func listChapters(comic_id : Types.ComicId) : async [Types.ChapterView] {
    ChaptersLib.listChapters(chapters, comic_id);
  };

  public query func getChapter(id : Types.ChapterId) : async ?Types.ChapterView {
    ChaptersLib.getChapter(chapters, id);
  };
};
