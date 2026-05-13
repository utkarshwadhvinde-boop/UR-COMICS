import Debug "mo:core/Debug";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/common";
import ProfilesLib "../lib/profiles";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Types.ProfileId, Types.UserProfile>,
  readProgress : Map.Map<Text, Types.ReadProgress>,
  trending : Map.Map<Types.ComicId, Types.TrendingEntry>,
  comics : Map.Map<Types.ComicId, Types.Comic>,
) {
  // ── Public reads ──────────────────────────────────────────────────────────

  public query func getUserProfile(userId : Text) : async ?Types.UserProfile {
    ProfilesLib.getUserProfile(profiles, userId);
  };

  public query ({ caller }) func getMyReadProgress(comicId : Types.ComicId) : async ?Types.ReadProgress {
    ProfilesLib.getReadProgress(readProgress, caller.toText(), comicId);
  };

  public query func getTrendingComics(limit : Nat) : async [Types.TrendingEntry] {
    ProfilesLib.getTrendingComics(trending, limit);
  };

  public query ({ caller }) func getMyResumeReading(limit : Nat) : async [(Types.Comic, Types.ReadProgress)] {
    ProfilesLib.getResumeReading(readProgress, comics, caller.toText(), limit);
  };

  // ── Authenticated mutations ───────────────────────────────────────────────

  public shared ({ caller }) func updateMyProfile(req : Types.UpdateProfileRequest) : async Types.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to update profile");
    };
    switch (ProfilesLib.updateUserProfile(profiles, caller.toText(), req)) {
      case (#ok profile) profile;
      case (#err msg) Runtime.trap(msg);
    };
  };

  public shared ({ caller }) func saveMyReadProgress(req : Types.SaveReadProgressRequest) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to save read progress");
    };
    switch (ProfilesLib.saveReadProgress(readProgress, caller.toText(), req)) {
      case (#ok) ();
      case (#err msg) Runtime.trap(msg);
    };
  };
};
