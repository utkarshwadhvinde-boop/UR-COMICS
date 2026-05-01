import Map "mo:core/Map";
import Time "mo:core/Time";
import ProgressLib "../lib/progress";
import UserTypes "../types/users";
import Common "../types/common";

mixin (progressMap : Map.Map<Text, UserTypes.ReadingProgress>) {
  public func saveProgress(userId : Common.UserId, progress : UserTypes.ReadingProgress) : async () {
    let now = Time.now();
    ProgressLib.saveProgress(progressMap, userId, progress, now);
  };

  public query func getProgress(userId : Common.UserId, comicId : Common.ComicId) : async ?UserTypes.ReadingProgress {
    ProgressLib.getProgress(progressMap, userId, comicId);
  };

  public query func listProgress(userId : Common.UserId) : async [UserTypes.ReadingProgress] {
    ProgressLib.listProgressForUser(progressMap, userId);
  };
};
