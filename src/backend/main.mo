import List "mo:core/List";
import Map "mo:core/Map";
import ComicTypes "types/comics";
import UserTypes "types/users";
import FAQTypes "types/faqs";
import ComicsApi "mixins/comics-api";
import ProgressApi "mixins/progress-api";
import CommentsApi "mixins/comments-api";
import FAQsApi "mixins/faqs-api";

actor {
  // Comics & chapters state
  let comics = List.empty<ComicTypes.Comic>();
  let chapters = List.empty<ComicTypes.Chapter>();
  let nextComicId = [var 1 : Nat];
  let nextChapterId = [var 1 : Nat];

  // Reading progress state — key: "userId:comicId"
  let progressMap = Map.empty<Text, UserTypes.ReadingProgress>();

  // Comments state
  let comments = List.empty<UserTypes.Comment>();
  let nextCommentId = [var 1 : Nat];

  // FAQs state
  let faqs = List.empty<FAQTypes.FAQ>();
  let nextFAQId = [var 1 : Nat];

  // Compose all domain APIs
  include ComicsApi(comics, chapters, nextComicId, nextChapterId);
  include ProgressApi(progressMap);
  include CommentsApi(comments, nextCommentId);
  include FAQsApi(faqs, nextFAQId);
};
