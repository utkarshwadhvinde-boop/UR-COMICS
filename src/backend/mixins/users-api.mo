import Map "mo:core/Map";
import Time "mo:core/Time";
import UsersLib "../lib/users";
import Types "../types/users";
import Common "../types/common";

mixin (
  userProfiles : Map.Map<Text, Types.UserProfile>,
) {
  public func createOrUpdateProfile(
    userId : Common.UserId,
    username : Text,
    avatarUrl : ?Text,
    bio : ?Text,
  ) : async Types.UserProfilePublic {
    let now = Time.now();
    UsersLib.createOrUpdateProfile(userProfiles, userId, username, avatarUrl, bio, now);
  };

  public query func getProfile(userId : Common.UserId) : async ?Types.UserProfilePublic {
    UsersLib.getProfile(userProfiles, userId);
  };

  public query func listCreatorProfiles(limit : Nat) : async [Types.UserProfilePublic] {
    UsersLib.listTopCreators(userProfiles, limit);
  };
};
