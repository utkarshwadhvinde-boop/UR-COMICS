import Array "mo:core/Array";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Types "../types/common";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public func createChapter(
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    counter : { var next : Nat },
    caller : Principal,
    args : Types.CreateChapterArgs,
  ) : Types.ChapterView {
    // Validate comic exists and caller is the author
    let comic = switch (comics.get(args.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (comic.is_deleted) { Runtime.trap("Comic not found") };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized: only the comic author can add chapters");
    };
    // Validate chapter number uniqueness within the comic
    for ((_, ch) in chapters.entries()) {
      if (Text.equal(ch.comic_id, args.comic_id) and not ch.is_deleted and ch.number == args.number) {
        Runtime.trap("A chapter with this number already exists for this comic");
      };
    };
    let id = counter.next.toText();
    counter.next += 1;
    let now = Time.now();
    let chapter : Types.Chapter = {
      id;
      comic_id = args.comic_id;
      number = args.number;
      title = args.title;
      image_blobs = [];
      is_published = false;
      is_deleted = false;
      created_at = now;
      updated_at = now;
    };
    chapters.add(id, chapter);
    toView(chapter);
  };

  public func updateChapterDraft(
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    id : Types.ChapterId,
    args : Types.UpdateChapterDraftArgs,
  ) : Types.ChapterView {
    let chapter = switch (chapters.get(id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    if (chapter.is_deleted) { Runtime.trap("Chapter not found") };
    if (chapter.is_published) { Runtime.trap("Cannot edit a published chapter") };
    // Ownership: check via comic author
    let comic = switch (comics.get(chapter.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized: only the comic author can update chapters");
    };
    // Validate number uniqueness if changed
    if (chapter.number != args.number) {
      for ((_, ch) in chapters.entries()) {
        if (Text.equal(ch.comic_id, chapter.comic_id) and ch.id != id and not ch.is_deleted and ch.number == args.number) {
          Runtime.trap("A chapter with this number already exists for this comic");
        };
      };
    };
    let updated : Types.Chapter = {
      chapter with
      title = args.title;
      number = args.number;
      updated_at = Time.now();
    };
    chapters.add(id, updated);
    toView(updated);
  };

  // Called by commitUpload once images are verified
  public func publishChapter(
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    id : Types.ChapterId,
    image_blobs : [Storage.ExternalBlob],
  ) : Types.ChapterView {
    let chapter = switch (chapters.get(id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    if (chapter.is_deleted) { Runtime.trap("Chapter not found") };
    let updated : Types.Chapter = {
      chapter with
      image_blobs;
      is_published = true;
      updated_at = Time.now();
    };
    chapters.add(id, updated);
    toView(updated);
  };

  public func deleteChapter(
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    id : Types.ChapterId,
  ) : () {
    let chapter = switch (chapters.get(id)) {
      case (?c) c;
      case null { Runtime.trap("Chapter not found") };
    };
    if (chapter.is_deleted) { Runtime.trap("Chapter not found") };
    let comic = switch (comics.get(chapter.comic_id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized: only the comic author can delete chapters");
    };
    chapters.add(id, { chapter with is_deleted = true; updated_at = Time.now() });
  };

  public func listChapters(
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    comic_id : Types.ComicId,
  ) : [Types.ChapterView] {
    let visible = chapters.entries()
      |> _.filter(func((_, c) : (Types.ChapterId, Types.Chapter)) : Bool {
        Text.equal(c.comic_id, comic_id) and not c.is_deleted
      })
      |> _.map(func((_, c) : (Types.ChapterId, Types.Chapter)) : Types.ChapterView = toView(c))
      |> _.toArray();
    visible.sort(func(a : Types.ChapterView, b : Types.ChapterView) : { #less; #equal; #greater } {
      Float.compare(a.number, b.number)
    });
  };

  public func getChapter(
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    id : Types.ChapterId,
  ) : ?Types.ChapterView {
    switch (chapters.get(id)) {
      case (?chapter) {
        if (chapter.is_deleted) null else ?toView(chapter);
      };
      case null null;
    };
  };

  public func toView(chapter : Types.Chapter) : Types.ChapterView {
    {
      id = chapter.id;
      comic_id = chapter.comic_id;
      number = chapter.number;
      title = chapter.title;
      image_blobs = chapter.image_blobs;
      is_published = chapter.is_published;
      created_at = chapter.created_at;
      updated_at = chapter.updated_at;
    };
  };
};
