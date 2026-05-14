import Map "mo:core/Map";
import Types "../types/common";
import GenreTypes "../types/genres";
import GenresLib "../lib/genres";

mixin (
  genres : Map.Map<GenreTypes.GenreId, GenreTypes.Genre>,
  comics : Map.Map<Types.ComicId, Types.Comic>,
) {
  // ── Public genre queries ──────────────────────────────────────────────────

  public query func listGenres() : async [GenreTypes.Genre] {
    GenresLib.ensureSeeded(genres);
    GenresLib.listGenres(genres);
  };

  public query func getGenre(id : GenreTypes.GenreId) : async ?GenreTypes.Genre {
    GenresLib.ensureSeeded(genres);
    GenresLib.getGenre(genres, id);
  };

  // ── Genre-filtered comic queries ──────────────────────────────────────────

  public query func getComicsByGenre(genreId : GenreTypes.GenreId) : async [Types.ComicView] {
    GenresLib.ensureSeeded(genres);
    GenresLib.getComicsByGenre(genreId, comics);
  };

  // ── Search ────────────────────────────────────────────────────────────────

  public query func searchComics(searchQuery : Text) : async [Types.ComicView] {
    GenresLib.ensureSeeded(genres);
    GenresLib.searchComics(searchQuery, comics, genres);
  };
};
