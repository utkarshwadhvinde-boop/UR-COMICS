import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/common";
import ComicsLib "../lib/comics";
import Time "mo:core/Time";
import Float "mo:core/Float";

mixin (
  accessControlState : AccessControl.AccessControlState,
  comics : Map.Map<Types.ComicId, Types.Comic>,
  chapters : Map.Map<Types.ChapterId, Types.Chapter>,
  comicCounter : { var next : Nat },
  trending : Map.Map<Types.ComicId, Types.TrendingEntry>,
) {
  // ── Creator-only mutations ────────────────────────────────────────────────

  public shared ({ caller }) func createComic(args : Types.CreateComicArgs) : async Types.ComicView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to create a comic");
    };
    ComicsLib.createComic(comics, comicCounter, caller, args);
  };

  public shared ({ caller }) func updateComic(id : Types.ComicId, args : Types.UpdateComicArgs) : async Types.ComicView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to update a comic");
    };
    ComicsLib.updateComic(comics, caller, id, args);
  };

  public shared ({ caller }) func deleteComic(id : Types.ComicId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to delete a comic");
    };
    ComicsLib.deleteComic(comics, chapters, caller, id);
  };

  // ── Public reads ──────────────────────────────────────────────────────────

  public query func listComics() : async [Types.ComicView] {
    ComicsLib.listComics(comics);
  };

  public query func getComic(id : Types.ComicId) : async ?Types.ComicView {
    ComicsLib.getComic(comics, id);
  };

  // ── View tracking ─────────────────────────────────────────────────────────

  public shared func incrementComicViews(comicId : Types.ComicId) : async () {
    let now = Time.now();
    let entry = switch (trending.get(comicId)) {
      case (?e) {
        let newViews = e.views + 1;
        {
          e with
          views = newViews;
          hot_score = newViews.toFloat();
          last_updated = now;
        };
      };
      case null {
        {
          comic_id = comicId;
          views = 1;
          hot_score = 1.0;
          last_updated = now;
        };
      };
    };
    trending.add(comicId, entry);
  };
};
