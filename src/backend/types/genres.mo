module {
  // ── Genre ────────────────────────────────────────────────────────────────
  public type GenreId = Text;

  public type Genre = {
    id : GenreId;
    name : Text;
    slug : Text;
  };
};
