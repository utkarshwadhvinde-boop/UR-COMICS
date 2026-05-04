import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Types "../types/users";
import Common "../types/common";

module {
  public func toPublic(profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = profile.id;
      username = profile.username;
      avatarUrl = profile.avatarUrl;
      bio = profile.bio;
      createdAt = profile.createdAt;
      followerCount = profile.followerCount;
      followingCount = profile.followingCount;
      totalSeries = profile.totalSeries;
      totalLikesReceived = profile.totalLikesReceived;
      totalCommentsReceived = profile.totalCommentsReceived;
    };
  };

  public func createOrUpdateProfile(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
    username : Text,
    avatarUrl : ?Text,
    bio : ?Text,
    now : Common.Timestamp,
  ) : Types.UserProfilePublic {
    switch (profiles.get(userId)) {
      case (?existing) {
        existing.username := username;
        existing.avatarUrl := avatarUrl;
        existing.bio := bio;
        toPublic(existing);
      };
      case null {
        let profile : Types.UserProfile = {
          id = userId;
          var username = username;
          var avatarUrl = avatarUrl;
          var bio = bio;
          createdAt = now;
          var followerCount = 0;
          var followingCount = 0;
          var totalSeries = 0;
          var totalLikesReceived = 0;
          var totalCommentsReceived = 0;
        };
        profiles.add(userId, profile);
        toPublic(profile);
      };
    };
  };

  public func getProfile(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfilePublic {
    switch (profiles.get(userId)) {
      case (?p) { ?toPublic(p) };
      case null { null };
    };
  };

  public func incrementFollowerCount(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { p.followerCount += 1 };
      case null {};
    };
  };

  public func decrementFollowerCount(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { if (p.followerCount > 0) { p.followerCount -= 1 } };
      case null {};
    };
  };

  public func incrementFollowingCount(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { p.followingCount += 1 };
      case null {};
    };
  };

  public func decrementFollowingCount(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { if (p.followingCount > 0) { p.followingCount -= 1 } };
      case null {};
    };
  };

  public func incrementTotalSeries(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { p.totalSeries += 1 };
      case null {};
    };
  };

  public func incrementLikesReceived(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { p.totalLikesReceived += 1 };
      case null {};
    };
  };

  public func incrementCommentsReceived(
    profiles : Map.Map<Text, Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (profiles.get(userId)) {
      case (?p) { p.totalCommentsReceived += 1 };
      case null {};
    };
  };

  // Returns top creators sorted by follower count descending
  public func listTopCreators(
    profiles : Map.Map<Text, Types.UserProfile>,
    limit : Nat,
  ) : [Types.UserProfilePublic] {
    let all = profiles.values();
    let arr = List.fromIter<Types.UserProfile>(all).toArray();
    let sorted = arr.sort(func(a : Types.UserProfile, b : Types.UserProfile) : Order.Order {
      if (a.followerCount > b.followerCount) { #less }
      else if (a.followerCount < b.followerCount) { #greater }
      else { #equal };
    });
    let taken = if (limit == 0 or limit >= sorted.size()) {
      sorted;
    } else {
      sorted.sliceToArray(0, limit);
    };
    taken.map<Types.UserProfile, Types.UserProfilePublic>(toPublic);
  };
};
