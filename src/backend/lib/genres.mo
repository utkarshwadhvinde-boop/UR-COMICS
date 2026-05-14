import Map "mo:core/Map";
import Types "../types/common";
import GenreTypes "../types/genres";
import Array "mo:core/Array";
import Text "mo:core/Text";

module {
  // Seed data: 14 canonical genres
  public let GENRES : [(GenreTypes.GenreId, GenreTypes.Genre)] = [
    ("action",       { id = "action";       name = "Action";        slug = "action" }),
    ("adventure",    { id = "adventure";    name = "Adventure";     slug = "adventure" }),
    ("comedy",       { id = "comedy";       name = "Comedy";        slug = "comedy" }),
    ("sci-fi",       { id = "sci-fi";       name = "Sci-Fi";        slug = "sci-fi" }),
    ("fantasy",      { id = "fantasy";      name = "Fantasy";       slug = "fantasy" }),
    ("romance",      { id = "romance";      name = "Romance";       slug = "romance" }),
    ("horror",       { id = "horror";       name = "Horror";        slug = "horror" }),
    ("drama",        { id = "drama";        name = "Drama";         slug = "drama" }),
    ("mystery",      { id = "mystery";      name = "Mystery";       slug = "mystery" }),
    ("thriller",     { id = "thriller";     name = "Thriller";      slug = "thriller" }),
    ("slice-of-life",{ id = "slice-of-life";name = "Slice of Life"; slug = "slice-of-life" }),
    ("martial-arts", { id = "martial-arts"; name = "Martial Arts";  slug = "martial-arts" }),
    ("supernatural", { id = "supernatural"; name = "Supernatural";  slug = "supernatural" }),
    ("psychological",{ id = "psychological";name = "Psychological"; slug = "psychological" }),
  ];

  /// Ensure the genres map is seeded with all canonical genres.
  /// Safe to call on every startup — only adds missing entries.
  public func ensureSeeded(genres : Map.Map<GenreTypes.GenreId, GenreTypes.Genre>) : () {
    if (genres.isEmpty()) {
      for ((id, genre) in GENRES.values()) {
        genres.add(id, genre);
      };
    };
  };

  /// Return a Genre by its id (= slug), or null if not found.
  public func getGenre(
    genres : Map.Map<GenreTypes.GenreId, GenreTypes.Genre>,
    id : GenreTypes.GenreId,
  ) : ?GenreTypes.Genre {
    genres.get(id);
  };

  /// Return all genres as an array, sorted by name.
  public func listGenres(
    genres : Map.Map<GenreTypes.GenreId, GenreTypes.Genre>,
  ) : [GenreTypes.Genre] {
    let arr = genres.values().toArray();
    arr.sort(func(a : GenreTypes.Genre, b : GenreTypes.Genre) : { #less; #equal; #greater } {
      Text.compare(a.name, b.name)
    });
  };

  /// Return all non-deleted comics whose genre_ids contain the given genreId.
  public func getComicsByGenre(
    genreId : GenreTypes.GenreId,
    comics : Map.Map<Types.ComicId, Types.Comic>,
  ) : [Types.ComicView] {
    comics.values()
      .filter(func(c : Types.Comic) : Bool {
        not c.is_deleted and c.genre_ids.find(func(gid : Text) : Bool { Text.equal(gid, genreId) }) != null
      })
      .map<Types.Comic, Types.ComicView>(func(c) {
        {
          id = c.id;
          author_id = c.author_id;
          title = c.title;
          description = c.description;
          cover_blob = c.cover_blob;
          genre_ids = c.genre_ids;
          created_at = c.created_at;
          updated_at = c.updated_at;
        }
      })
      .toArray();
  };

  /// Search comics by partial title, genre name, or (eventually) creator display name.
  /// Case-insensitive partial match on title and genre slug/name.
  public func searchComics(
    searchQuery : Text,
    comics : Map.Map<Types.ComicId, Types.Comic>,
    genres : Map.Map<GenreTypes.GenreId, GenreTypes.Genre>,
  ) : [Types.ComicView] {
    let q = searchQuery.toLower();
    comics.values()
      .filter(func(c : Types.Comic) : Bool {
        if (c.is_deleted) return false;
        // Match on title
        if (c.title.toLower().contains(#text q)) return true;
        // Match on any genre name or slug
        c.genre_ids.find(func(gid : Text) : Bool {
          switch (genres.get(gid)) {
            case (?g) {
              g.name.toLower().contains(#text q) or g.slug.toLower().contains(#text q)
            };
            case null false;
          };
        }) != null;
      })
      .map<Types.Comic, Types.ComicView>(func(c) {
        {
          id = c.id;
          author_id = c.author_id;
          title = c.title;
          description = c.description;
          cover_blob = c.cover_blob;
          genre_ids = c.genre_ids;
          created_at = c.created_at;
          updated_at = c.updated_at;
        }
      })
      .toArray();
  };
};
