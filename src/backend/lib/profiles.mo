import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/common";

module {
  // ── getUserProfile ──────────────────────────────────────────────────────────
  // Look up by id (direct key) first; fall back to scanning by auth_id.
  public func getUserProfile(
    profiles : Map.Map<Types.ProfileId, Types.UserProfile>,
    userId : Text,
  ) : ?Types.UserProfile {
    switch (profiles.get(userId)) {
      case (?p) ?p;
      case null {
        profiles.entries()
          |> _.find(func((_, p) : (Types.ProfileId, Types.UserProfile)) : Bool {
            Text.equal(p.auth_id, userId)
          })
          |> (switch (_) { case (?(_, p)) ?p; case null null });
      };
    };
  };

  // ── updateUserProfile ───────────────────────────────────────────────────────
  // Find profile by auth_id; create if absent. Apply optional field updates.
  public func updateUserProfile(
    profiles : Map.Map<Types.ProfileId, Types.UserProfile>,
    authId : Text,
    req : Types.UpdateProfileRequest,
  ) : { #ok : Types.UserProfile; #err : Text } {
    let existing = profiles.entries()
      |> _.find(func((_, p) : (Types.ProfileId, Types.UserProfile)) : Bool {
        Text.equal(p.auth_id, authId)
      });
    let now = Time.now();
    let profile = switch (existing) {
      case (?(_, p)) {
        let updated : Types.UserProfile = {
          p with
          display_name = switch (req.display_name) { case (?v) v; case null p.display_name };
          bio = switch (req.bio) { case (?v) v; case null p.bio };
          profile_picture_url = switch (req.profile_picture_url) {
            case (?_) req.profile_picture_url;
            case null p.profile_picture_url;
          };
          updated_at = now;
        };
        profiles.add(p.id, updated);
        updated;
      };
      case null {
        // Auto-create profile — use timestamp-based id
        let id = now.toText() # "-" # authId;
        let handle = authId;
        let newProfile : Types.UserProfile = {
          id;
          auth_id = authId;
          handle;
          display_name = switch (req.display_name) { case (?v) v; case null "" };
          bio = switch (req.bio) { case (?v) v; case null "" };
          profile_picture_url = req.profile_picture_url;
          is_creator = false;
          created_at = now;
          updated_at = now;
        };
        profiles.add(id, newProfile);
        newProfile;
      };
    };
    #ok profile;
  };

  // ── getReadProgress ─────────────────────────────────────────────────────────
  public func getReadProgress(
    readProgress : Map.Map<Text, Types.ReadProgress>,
    authId : Text,
    comicId : Types.ComicId,
  ) : ?Types.ReadProgress {
    let key = authId # ":" # comicId;
    readProgress.get(key);
  };

  // ── saveReadProgress ────────────────────────────────────────────────────────
  public func saveReadProgress(
    readProgress : Map.Map<Text, Types.ReadProgress>,
    authId : Text,
    req : Types.SaveReadProgressRequest,
  ) : { #ok; #err : Text } {
    let key = authId # ":" # req.comic_id;
    let now = Time.now();
    let entry : Types.ReadProgress = switch (readProgress.get(key)) {
      case (?existing) {
        {
          existing with
          chapter_id = req.chapter_id;
          scroll_pixel_y = req.scroll_pixel_y;
          last_read_at = now;
        };
      };
      case null {
        {
          user_id = authId;
          chapter_id = req.chapter_id;
          comic_id = req.comic_id;
          scroll_pixel_y = req.scroll_pixel_y;
          last_read_at = now;
        };
      };
    };
    readProgress.add(key, entry);
    #ok;
  };

  // ── getTrendingComics ───────────────────────────────────────────────────────
  // Sort all TrendingEntries by hot_score DESC, return top `limit`.
  public func getTrendingComics(
    trending : Map.Map<Types.ComicId, Types.TrendingEntry>,
    limit : Nat,
  ) : [Types.TrendingEntry] {
    let all = trending.values() |> _.toArray();
    let sorted = all.sort(func(a : Types.TrendingEntry, b : Types.TrendingEntry) : { #less; #equal; #greater } {
      Float.compare(b.hot_score, a.hot_score)
    });

    if (limit >= sorted.size()) {
      sorted;
    } else {
      Array.tabulate<Types.TrendingEntry>(limit, func i = sorted[i]);
    };
  };

  // ── getResumeReading ────────────────────────────────────────────────────────
  // Find all ReadProgress for user, sort by last_read_at DESC, return Comic+Progress pairs.
  public func getResumeReading(
    readProgress : Map.Map<Text, Types.ReadProgress>,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    authId : Text,
    limit : Nat,
  ) : [(Types.Comic, Types.ReadProgress)] {
    // Collect all progress entries for this user
    let userEntries = readProgress.values()
      |> _.filter(func(p : Types.ReadProgress) : Bool { Text.equal(p.user_id, authId) })
      |> _.toArray();
    // Sort by last_read_at DESC
    let sorted = userEntries.sort(func(a : Types.ReadProgress, b : Types.ReadProgress) : { #less; #equal; #greater } {
      Int.compare(b.last_read_at, a.last_read_at)
    });
    // Take up to `limit`, join with comic
    let taken = if (limit >= sorted.size()) sorted
                else Array.tabulate(limit, func i = sorted[i]);
    taken.filterMap<Types.ReadProgress, (Types.Comic, Types.ReadProgress)>(func(p) {
      switch (comics.get(p.comic_id)) {
        case (?comic) { if (comic.is_deleted) null else ?(comic, p) };
        case null null;
      };
    });
  };
};
