import List "mo:core/List";
import Time "mo:core/Time";
import FAQsLib "../lib/faqs";
import FAQTypes "../types/faqs";

mixin (
  faqs : List.List<FAQTypes.FAQ>,
  nextFAQId : [var Nat],
) {
  public query func listFAQs(approvedOnly : Bool) : async [FAQTypes.FAQPublic] {
    FAQsLib.listFAQs(faqs, approvedOnly);
  };

  // Public submission — requires admin approval
  public func submitFAQ(input : FAQTypes.FAQInput) : async Nat {
    let now = Time.now();
    let faq = FAQsLib.addFAQ(faqs, nextFAQId[0], input, now, false);
    nextFAQId[0] += 1;
    faq.id;
  };

  // Admin: add FAQ with auto-approval
  public func createFAQ(input : FAQTypes.FAQInput) : async Nat {
    let now = Time.now();
    let faq = FAQsLib.addFAQ(faqs, nextFAQId[0], input, now, true);
    nextFAQId[0] += 1;
    faq.id;
  };

  public func updateFAQ(id : Nat, input : FAQTypes.FAQInput) : async Bool {
    FAQsLib.updateFAQ(faqs, id, input);
  };

  public func deleteFAQ(id : Nat) : async Bool {
    FAQsLib.deleteFAQ(faqs, id);
  };

  public func voteFAQ(id : Nat) : async Bool {
    FAQsLib.upvoteFAQ(faqs, id);
  };

  public func approveFAQ(id : Nat) : async Bool {
    FAQsLib.approveFAQ(faqs, id);
  };
};
