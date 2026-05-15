import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Types "types/common";
import ComicsApi "mixins/comics-api";
import ChaptersApi "mixins/chapters-api";
import ProfileApi "mixins/profile-api";
import GenreTypes "types/genres";
import GenresApi "mixins/genres-api";

import GenresLib "lib/genres";


actor {
  // ── Authorization ────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Object Storage ───────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ── Comics state ─────────────────────────────────────────────────────────
  let comics = Map.empty<Types.ComicId, Types.Comic>();
  let comicCounter = { var next : Nat = 0 };

  // ── Genres state ─────────────────────────────────────────────────────────
  let genres = Map.empty<GenreTypes.GenreId, GenreTypes.Genre>();

  // ── Chapters + upload state ───────────────────────────────────────────────
  let chapters = Map.empty<Types.ChapterId, Types.Chapter>();
  let chapterCounter = { var next : Nat = 0 };
  let uploads = Map.empty<Types.ChapterId, Types.UploadSession>();

  // ── Profile + read-progress state ────────────────────────────────────────
  let profiles = Map.empty<Types.ProfileId, Types.UserProfile>();
  let readProgress = Map.empty<Text, Types.ReadProgress>();
  let trending = Map.empty<Types.ComicId, Types.TrendingEntry>();

  // ── Mixin includes ───────────────────────────────────────────────────────
  include ComicsApi(accessControlState, comics, chapters, comicCounter, trending);
  include ChaptersApi(accessControlState, comics, chapters, uploads, chapterCounter);
  include ProfileApi(accessControlState, profiles, readProgress, trending, comics);
  include GenresApi(genres, comics);

  // Ensure genres are seeded on startup
  GenresLib.ensureSeeded(genres);
};
