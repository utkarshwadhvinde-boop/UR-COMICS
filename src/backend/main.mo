import List "mo:core/List";
import Map "mo:core/Map";
import ComicTypes "types/comics";
import UserTypes "types/users";
import FAQTypes "types/faqs";
import ComicsApi "mixins/comics-api";
import ProgressApi "mixins/progress-api";
import CommentsApi "mixins/comments-api";
import FAQsApi "mixins/faqs-api";
import SocialApi "mixins/social-api";
import NotificationsApi "mixins/notifications-api";
import UsersApi "mixins/users-api";
import ComicsLib "lib/comics";







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

  // Social state
  let follows = Map.empty<Text, UserTypes.Follow>();
  let chapterLikes = Map.empty<Text, UserTypes.ChapterLike>();
  let commentReplies = Map.empty<Text, List.List<UserTypes.CommentReply>>();
  let nextReplyId = [var 1 : Nat];

  // Notifications state
  let notifications = List.empty<UserTypes.Notification>();
  let nextNotificationId = [var 1 : Nat];

  // User profiles state
  let userProfiles = Map.empty<Text, UserTypes.UserProfile>();

  // Health-check: frontend polls this before attempting writes
  public query func canisterStatus() : async Text {
    "running"
  };

  // Run orphan/ghost-entry cleanup on canister initialization
  ComicsLib.cleanupOrphans(comics, chapters);

  // Compose all domain APIs
  include ComicsApi(comics, chapters, nextComicId, nextChapterId);
  include ProgressApi(progressMap);
  include CommentsApi(comments, nextCommentId);
  include FAQsApi(faqs, nextFAQId);
  include SocialApi(follows, chapterLikes, commentReplies, nextReplyId);
  include NotificationsApi(notifications, nextNotificationId);
  include UsersApi(userProfiles);
};
