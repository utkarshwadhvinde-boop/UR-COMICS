import { e as useParams, i as useNavigate, n as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as Link, h as Button, y as ue } from "./index-WeXjJ7Am.js";
import { L as Label, I as Input } from "./label-CbhwFfzo.js";
import { c as chaptersQueryKey } from "./useChapters-Aezclnad.js";
import { c as createChapter } from "./chaptersService-CdTVL-Cg.js";
import { C as ChevronLeft } from "./chevron-left-Bkumf7a0.js";
function CreateChapterPage() {
  const { comicId } = useParams({
    from: "/creator/comics/$comicId/chapters/new"
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [number, setNumber] = reactExports.useState("1");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const chNum = Number.parseFloat(number);
    if (!title.trim() || Number.isNaN(chNum)) return;
    setIsSubmitting(true);
    try {
      const chapter = await createChapter({
        comic_id: comicId,
        title: title.trim(),
        chapter_number: chNum
      });
      await queryClient.invalidateQueries({
        queryKey: chaptersQueryKey(comicId)
      });
      ue.success("Chapter created! You can now upload images.");
      navigate({
        to: "/creator/comics/$comicId/chapters/$chapterId",
        params: { comicId, chapterId: chapter.id }
      });
    } catch {
      ue.error("Failed to create chapter.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-lg mx-auto px-4 sm:px-6 py-10",
      "data-ocid": "create_chapter.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/creator/comics/$comicId",
            params: { comicId },
            className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6 font-body",
            "data-ocid": "create_chapter.back_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Back to Comic"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground mb-8", children: "New Chapter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "number", className: "font-body text-sm", children: "Chapter Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "number",
                type: "number",
                min: "0",
                step: "0.1",
                value: number,
                onChange: (e) => setNumber(e.target.value),
                required: true,
                className: "bg-card border-border font-mono",
                "data-ocid": "create_chapter.number_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", className: "font-body text-sm", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "e.g. The Awakening",
                required: true,
                className: "bg-card border-border font-body",
                "data-ocid": "create_chapter.title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isSubmitting || !title.trim(),
              className: "bg-accent text-accent-foreground hover:bg-accent/90 w-full",
              "data-ocid": "create_chapter.submit_button",
              children: isSubmitting ? "Creating…" : "Create Chapter"
            }
          )
        ] })
      ]
    }
  );
}
export {
  CreateChapterPage
};
