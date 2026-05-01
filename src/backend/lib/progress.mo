import Map "mo:core/Map";
import Types "../types/users";
import Common "../types/common";

module {
  // Composite key: "userId:comicId"
  func progressKey(userId : Common.UserId, comicId : Common.ComicId) : Text {
    userId # ":" # comicId.toText();
  };

  public func saveProgress(
    progressMap : Map.Map<Text, Types.ReadingProgress>,
    userId : Common.UserId,
    progress : Types.ReadingProgress,
    now : Common.Timestamp,
  ) {
    let key = progressKey(userId, progress.comicId);
    let updated : Types.ReadingProgress = {
      comicId = progress.comicId;
      chapterId = progress.chapterId;
      scrollPosition = progress.scrollPosition;
      lastReadAt = now;
    };
    progressMap.add(key, updated);
  };

  public func getProgress(
    progressMap : Map.Map<Text, Types.ReadingProgress>,
    userId : Common.UserId,
    comicId : Common.ComicId,
  ) : ?Types.ReadingProgress {
    let key = progressKey(userId, comicId);
    progressMap.get(key);
  };

  public func listProgressForUser(
    progressMap : Map.Map<Text, Types.ReadingProgress>,
    userId : Common.UserId,
  ) : [Types.ReadingProgress] {
    let prefix = userId # ":";
    progressMap.entries()
      .filter(func((k, _v) : (Text, Types.ReadingProgress)) : Bool { k.startsWith(#text prefix) })
      .map<(Text, Types.ReadingProgress), Types.ReadingProgress>(func((_k, v) : (Text, Types.ReadingProgress)) : Types.ReadingProgress { v })
      .toArray();
  };
};
