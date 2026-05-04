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

  // Removes all reading progress entries pointing to a specific chapter.
  // Call this after deleting a chapter so it no longer appears in "continue reading".
  public func deleteReadingHistoryEntry(chapterId : Common.ChapterId) : async () {
    ProgressLib.deleteProgressForChapter(progressMap, chapterId);
  };
  // Convenience alias: update progress for a specific comic+chapter.
  // Matches the frontend-expected API shape: updateReadingProgress(comicId, chapterId, userId).
  public func updateReadingProgress(comicId : Common.ComicId, chapterId : Common.ChapterId, userId : Common.UserId) : async () {
    let now = Time.now();
    let progress : UserTypes.ReadingProgress = {
      comicId;
      chapterId;
      scrollPosition = 0;
      lastReadAt = now;
    };
    ProgressLib.saveProgress(progressMap, userId, progress, now);
  };

  // Convenience alias: get reading progress for a specific comic (frontend-expected shape).
  public query func getReadingProgress(comicId : Common.ComicId, userId : Common.UserId) : async ?UserTypes.ReadingProgress {
    ProgressLib.getProgress(progressMap, userId, comicId);
  };
};
