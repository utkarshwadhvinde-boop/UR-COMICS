import List "mo:core/List";
import Types "../types/faqs";

module {
  public func toPublic(faq : Types.FAQ) : Types.FAQPublic {
    {
      id = faq.id;
      category = faq.category;
      question = faq.question;
      answer = faq.answer;
      upvotes = faq.upvotes;
      approved = faq.approved;
      isUserQuestion = faq.isUserQuestion;
      createdAt = faq.createdAt;
    };
  };

  public func listFAQs(
    faqs : List.List<Types.FAQ>,
    approvedOnly : Bool,
  ) : [Types.FAQPublic] {
    let filtered = if (approvedOnly) {
      faqs.filter(func(f : Types.FAQ) : Bool { f.approved });
    } else {
      faqs.filter(func(_f : Types.FAQ) : Bool { true });
    };
    filtered.map<Types.FAQ, Types.FAQPublic>(toPublic).toArray();
  };

  public func addFAQ(
    faqs : List.List<Types.FAQ>,
    nextId : Nat,
    input : Types.FAQInput,
    now : Int,
    autoApprove : Bool,
  ) : Types.FAQ {
    let faq : Types.FAQ = {
      id = nextId;
      category = input.category;
      question = input.question;
      answer = input.answer;
      var upvotes = 0;
      var approved = autoApprove;
      isUserQuestion = input.isUserQuestion;
      createdAt = now;
    };
    faqs.add(faq);
    faq;
  };

  public func updateFAQ(
    faqs : List.List<Types.FAQ>,
    id : Nat,
    input : Types.FAQInput,
  ) : Bool {
    var found = false;
    faqs.mapInPlace(func(f : Types.FAQ) : Types.FAQ {
      if (f.id == id) {
        found := true;
        {
          id = f.id;
          category = input.category;
          question = input.question;
          answer = input.answer;
          var upvotes = f.upvotes;
          var approved = f.approved;
          isUserQuestion = input.isUserQuestion;
          createdAt = f.createdAt;
        };
      } else { f };
    });
    found;
  };

  public func deleteFAQ(
    faqs : List.List<Types.FAQ>,
    id : Nat,
  ) : Bool {
    let sizeBefore = faqs.size();
    let filtered = faqs.filter(func(f : Types.FAQ) : Bool { f.id != id });
    let sizeAfter = filtered.size();
    if (sizeBefore == sizeAfter) { return false };
    faqs.clear();
    faqs.append(filtered);
    true;
  };

  public func upvoteFAQ(
    faqs : List.List<Types.FAQ>,
    id : Nat,
  ) : Bool {
    switch (faqs.find(func(f : Types.FAQ) : Bool { f.id == id })) {
      case (?faq) {
        faq.upvotes += 1;
        true;
      };
      case null { false };
    };
  };

  public func approveFAQ(
    faqs : List.List<Types.FAQ>,
    id : Nat,
  ) : Bool {
    switch (faqs.find(func(f : Types.FAQ) : Bool { f.id == id })) {
      case (?faq) {
        faq.approved := true;
        true;
      };
      case null { false };
    };
  };
};
