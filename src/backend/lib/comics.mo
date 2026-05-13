import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Types "../types/common";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Int "mo:core/Int";

module {
  public func createComic(
    comics : Map.Map<Types.ComicId, Types.Comic>,
    counter : { var next : Nat },
    caller : Principal,
    args : Types.CreateComicArgs,
  ) : Types.ComicView {
    if (args.title.size() == 0) {
      Runtime.trap("Title cannot be empty");
    };
    let id = counter.next.toText();
    counter.next += 1;
    let now = Time.now();
    let comic : Types.Comic = {
      id;
      author_id = caller;
      title = args.title;
      description = args.description;
      cover_blob = args.cover_blob;
      is_deleted = false;
      created_at = now;
      updated_at = now;
    };
    comics.add(id, comic);
    toView(comic);
  };

  public func updateComic(
    comics : Map.Map<Types.ComicId, Types.Comic>,
    caller : Principal,
    id : Types.ComicId,
    args : Types.UpdateComicArgs,
  ) : Types.ComicView {
    let comic = switch (comics.get(id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (comic.is_deleted) { Runtime.trap("Comic not found") };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized: only the author can update this comic");
    };
    if (args.title.size() == 0) { Runtime.trap("Title cannot be empty") };
    let updated : Types.Comic = {
      comic with
      title = args.title;
      description = args.description;
      cover_blob = args.cover_blob;
      updated_at = Time.now();
    };
    comics.add(id, updated);
    toView(updated);
  };

  public func deleteComic(
    comics : Map.Map<Types.ComicId, Types.Comic>,
    chapters : Map.Map<Types.ChapterId, Types.Chapter>,
    caller : Principal,
    id : Types.ComicId,
  ) : () {
    let comic = switch (comics.get(id)) {
      case (?c) c;
      case null { Runtime.trap("Comic not found") };
    };
    if (comic.is_deleted) { Runtime.trap("Comic not found") };
    if (not Principal.equal(comic.author_id, caller)) {
      Runtime.trap("Unauthorized: only the author can delete this comic");
    };
    // Soft-delete the comic
    comics.add(id, { comic with is_deleted = true; updated_at = Time.now() });
    // Cascade soft-delete all chapters belonging to this comic
    for ((cid, chapter) in chapters.entries()) {
      if (Text.equal(chapter.comic_id, id) and not chapter.is_deleted) {
        chapters.add(cid, { chapter with is_deleted = true; updated_at = Time.now() });
      };
    };
  };

  public func listComics(
    comics : Map.Map<Types.ComicId, Types.Comic>,
  ) : [Types.ComicView] {
    let visible = comics.entries()
      |> _.filter(func((_, c) : (Types.ComicId, Types.Comic)) : Bool = not c.is_deleted)
      |> _.map(func((_, c) : (Types.ComicId, Types.Comic)) : Types.ComicView = toView(c))
      |> _.toArray();
    // Sort by created_at descending
    visible.sort(func(a : Types.ComicView, b : Types.ComicView) : { #less; #equal; #greater } {
      Int.compare(b.created_at, a.created_at)
    });
  };

  public func getComic(
    comics : Map.Map<Types.ComicId, Types.Comic>,
    id : Types.ComicId,
  ) : ?Types.ComicView {
    switch (comics.get(id)) {
      case (?comic) {
        if (comic.is_deleted) null else ?toView(comic);
      };
      case null null;
    };
  };

  public func toView(comic : Types.Comic) : Types.ComicView {
    {
      id = comic.id;
      author_id = comic.author_id;
      title = comic.title;
      description = comic.description;
      cover_blob = comic.cover_blob;
      created_at = comic.created_at;
      updated_at = comic.updated_at;
    };
  };
};
