import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: 1,
    category: "Reading",
    question: "How do I continue reading where I left off?",
    answer:
      "UR COMICS automatically saves your reading progress. Use the 'Continue Reading' section in the sidebar to jump back to the exact page and scroll position where you stopped.",
  },
  {
    id: 2,
    category: "Reading",
    question: "Why are some pages loading slowly?",
    answer:
      "High-resolution webtoon pages may take a moment to load. Pages are progressively loaded as you scroll, and the next chapter is pre-fetched automatically for a seamless experience.",
  },
  {
    id: 3,
    category: "Creators",
    question: "How do I upload my comic?",
    answer:
      "Go to Creator Studio via the sidebar, create a new comic, then upload chapters. The system uses a two-phase commit: images are verified before your chapter goes live, preventing partial uploads.",
  },
  {
    id: 4,
    category: "Creators",
    question: "What image formats are supported?",
    answer:
      "JPEG, PNG, and WebP are supported. For best performance, we recommend WebP at 800–1200px wide. Each chapter supports up to 100 pages.",
  },
  {
    id: 5,
    category: "Creators",
    question: "What happens if my upload fails partway through?",
    answer:
      "UR COMICS uses atomic publishing — if any image fails to upload, the entire chapter is automatically rolled back. No broken or empty chapters will ever appear to readers.",
  },
  {
    id: 6,
    category: "Account",
    question: "How do I log in?",
    answer:
      "Click 'Sign In' in the header or sidebar. UR COMICS uses Internet Identity — a secure, password-free authentication method built into the Internet Computer.",
  },
  {
    id: 7,
    category: "Account",
    question: "Can I change my display name and bio?",
    answer:
      "Yes! Once logged in, navigate to your profile page. You can update your display name, bio, and profile picture at any time.",
  },
];

const CATEGORIES = ["All", "Reading", "Creators", "Account"];

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`faq.item.${index + 1}`}
      style={{
        border: "2px solid #111111",
        borderRadius: "0px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        boxShadow: "3px 3px 0px #111111",
        marginBottom: "14px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-ocid={`faq.toggle.${index + 1}`}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          textAlign: "left",
          background: open ? "#f5f0e8" : "#ffffff",
          border: "none",
          cursor: "pointer",
          boxSizing: "border-box",
          transition: "background-color 0.1s ease",
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.backgroundColor = "#fffdf9";
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.backgroundColor = "#ffffff";
        }}
      >
        <span style={{
          fontFamily: "serif",
          fontSize: "15px",
          fontWeight: "900",
          color: "#111111",
          paddingRight: "16px",
          lineHeight: "1.4",
          boxSizing: "border-box"
        }}>
          {question}
        </span>
        <ChevronDown
          style={{
            width: "16px",
            height: "16px",
            flexShrink: 0,
            color: "#111111",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ boxSizing: "border-box" }}
          >
            <div style={{
              padding: "0px 20px 16px 20px",
              backgroundColor: "#f5f0e8",
              borderTop: "2px solid #111111",
              boxSizing: "border-box"
            }}>
              <p style={{
                margin: 0,
                paddingTop: "14px",
                fontSize: "14px",
                color: "#222222",
                fontFamily: "serif",
                lineHeight: "1.6",
                boxSizing: "border-box"
              }}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !search ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      style={{
        backgroundColor: "#f5f0e8",
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div 
        className="max-w-2xl mx-auto px-4 py-12" 
        data-ocid="faq.page"
        style={{ boxSizing: "border-box" }}
      >
        {/* Header Block Section */}
        <div style={{ textAlign: "center", marginBottom: "40px", boxSizing: "border-box" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            borderRadius: "0px",
            backgroundColor: "#fbbf24",
            border: "2px solid #111111",
            boxShadow: "2px 2px 0px #111111",
            marginBottom: "16px",
            boxSizing: "border-box"
          }}>
            <HelpCircle style={{ width: "24px", height: "24px", color: "#111111" }} />
          </div>
          <h1 style={{
            fontFamily: "serif",
            fontSize: "36px",
            fontWeight: "900",
            color: "#111111",
            margin: "0 0 6px 0",
            letterSpacing: "-0.5px"
          }}>
            Help &amp; FAQ
          </h1>
          <p style={{
            margin: 0,
            fontFamily: "monospace, sans-serif",
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#555555"
          }}>
            Everything you need to know about UR COMICS.
          </p>
        </div>

        {/* Search Field Anchor Box */}
        <div style={{ position: "relative", marginBottom: "24px", boxSizing: "border-box" }}>
          <Search style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            color: "#111111"
          }} />
          <input
            type="text"
            placeholder="SEARCH QUESTIONS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="faq.search_input"
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              borderRadius: "0px",
              backgroundColor: "#ffffff",
              border: "2px solid #111111",
              color: "#111111",
              boxShadow: "3px 3px 0px #111111",
              fontFamily: "monospace, sans-serif",
              fontSize: "13px",
              fontWeight: "bold",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Category Badge Filter Lane */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px", boxSizing: "border-box" }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`faq.category_filter.${cat.toLowerCase()}`}
                style={{
                  padding: "6px 14px",
                  borderRadius: "0px",
                  fontSize: "11px",
                  fontFamily: "monospace, sans-serif",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  border: "2px solid #111111",
                  backgroundColor: isActive ? "#111111" : "#ffffff",
                  color: isActive ? "#ffffff" : "#111111",
                  boxShadow: isActive ? "none" : "2px 2px 0px #111111",
                  transform: isActive ? "translate(2px, 2px)" : "none",
                  transition: "all 0.1s ease",
                  boxSizing: "border-box"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Items Content Container Shell */}
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            {filtered.map((item, idx) => (
              <FaqItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                index={idx}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Fallback Template Display */
          <div
            data-ocid="faq.empty_state"
            style={{
              textAlign: "center",
              padding: "48px 16px",
              backgroundColor: "#ffffff",
              border: "2px solid #111111",
              boxShadow: "4px 4px 0px #111111",
              boxSizing: "border-box"
            }}
          >
            <HelpCircle style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#111111", opacity: 0.4 }} />
            <p style={{ margin: 0, fontFamily: "monospace, sans-serif", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: "#111111" }}>
              No results found for "{search}"
            </p>
          </div>
        )}
      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
            }
