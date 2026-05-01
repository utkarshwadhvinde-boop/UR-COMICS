module {
  public type FAQ = {
    id : Nat;
    category : Text;
    question : Text;
    answer : Text;
    var upvotes : Nat;
    var approved : Bool;
    isUserQuestion : Bool;
    createdAt : Int;
  };

  public type FAQPublic = {
    id : Nat;
    category : Text;
    question : Text;
    answer : Text;
    upvotes : Nat;
    approved : Bool;
    isUserQuestion : Bool;
    createdAt : Int;
  };

  public type FAQInput = {
    category : Text;
    question : Text;
    answer : Text;
    isUserQuestion : Bool;
  };
};
