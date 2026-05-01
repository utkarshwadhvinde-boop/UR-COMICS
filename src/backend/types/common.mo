module {
  public type ComicId = Nat;
  public type ChapterId = Nat;
  public type UserId = Text; // localStorage-based, username or email as identifier
  public type Timestamp = Int; // nanoseconds from Time.now()
};
