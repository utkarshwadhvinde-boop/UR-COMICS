import { e as useParams, g as useNavigate, k as useActor, m as useQueryClient, r as reactExports, j as jsxRuntimeExports, E as ErrorFallback, L as Link, d as Button, q as ExternalBlob, p as ue, n as createActor } from "./index-DBVmmKIh.js";
import { B as Badge } from "./badge-4nQqznig.js";
import { I as Input } from "./input-BzqWAKa9.js";
import { L as Label } from "./label-DKvVgvPq.js";
import { S as Skeleton } from "./skeleton-CkgraJgd.js";
import { T as Textarea } from "./textarea-G4I-vNCj.js";
import { u as useChapters } from "./useChapters-DgAB5RZ_.js";
import { u as useComic, c as comicQueryKey } from "./useComic-Dgsngt_3.js";
import { u as updateComic } from "./comicsService-BozSeBsV.js";
import { C as ChevronLeft } from "./chaptersService-CSOdR9Lz.js";
import { I as ImagePlus } from "./image-plus-Btdm69YH.js";
import { P as Plus } from "./plus-C22L-5vU.js";
function EditComicPage() {
  const { comicId } = useParams({ from: "/creator/comics/$comicId" });
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: comic, isLoading, isError } = useComic(comicId);
  const { data: chapters, isLoading: chaptersLoading } = useChapters(comicId);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [coverFile, setCoverFile] = reactExports.useState(null);
  const [coverPreview, setCoverPreview] = reactExports.useState(null);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (comic) {
      setTitle(comic.title);
      setDescription(comic.description);
      setCoverPreview(comic.cover_blob.getDirectURL());
    }
  }, [comic]);
  const handleCoverChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actor || !comic || !title.trim()) return;
    setIsSubmitting(true);
    try {
      let coverBlob = comic.cover_blob;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverBlob = ExternalBlob.fromBytes(bytes);
      }
      await updateComic(actor, comicId, {
        title: title.trim(),
        description: description.trim(),
        cover_blob: coverBlob
      });
      await queryClient.invalidateQueries({ queryKey: comicQueryKey(comicId) });
      ue.success("Comic updated!");
      navigate({ to: "/creator" });
    } catch {
      ue.error("Failed to update comic.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorFallback, { message: "Failed to load comic." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 sm:px-6 py-10",
      "data-ocid": "edit_comic.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/creator",
            className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6 font-body",
            "data-ocid": "edit_comic.back_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Back to Dashboard"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground mb-8", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-48 bg-muted" }) : `Edit: ${comic == null ? void 0 : comic.title}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", htmlFor: "cover", children: "Cover Image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "cover",
                className: "relative flex items-center justify-center w-40 h-56 rounded-lg border-2 border-dashed border-border hover:border-accent/50 bg-card cursor-pointer transition-smooth overflow-hidden",
                "data-ocid": "edit_comic.cover_dropzone",
                children: [
                  coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: coverPreview,
                      alt: "Cover preview",
                      className: "absolute inset-0 w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body", children: "Upload cover" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "cover",
                      type: "file",
                      accept: "image/*",
                      className: "sr-only",
                      onChange: handleCoverChange,
                      "data-ocid": "edit_comic.cover_input"
                    }
                  )
                ]
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
                required: true,
                className: "bg-card border-border font-body",
                "data-ocid": "edit_comic.title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", className: "font-body text-sm", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 4,
                className: "bg-card border-border font-body resize-none",
                "data-ocid": "edit_comic.description_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isSubmitting || !title.trim(),
              className: "bg-accent text-accent-foreground hover:bg-accent/90 w-full",
              "data-ocid": "edit_comic.submit_button",
              children: isSubmitting ? "Saving…" : "Save Changes"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12", "data-ocid": "edit_comic.chapters_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-foreground", children: "Chapters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                size: "sm",
                className: "bg-accent text-accent-foreground hover:bg-accent/90",
                "data-ocid": "edit_comic.add_chapter_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/creator/comics/$comicId/chapters/new",
                    params: { comicId },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
                      " Add Chapter"
                    ]
                  }
                )
              }
            )
          ] }),
          chaptersLoading && [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: "h-12 w-full mb-2 bg-muted rounded-lg"
            },
            i
          )),
          !chaptersLoading && (!chapters || chapters.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-muted-foreground font-body text-sm py-6 text-center",
              "data-ocid": "edit_comic.chapters_empty_state",
              children: "No chapters yet. Add your first chapter!"
            }
          ),
          !chaptersLoading && chapters && chapters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: chapters.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between p-3 rounded-lg bg-card border border-border",
              "data-ocid": `edit_comic.chapters.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-mono text-sm font-bold", children: [
                    "Ch.",
                    ch.number
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm text-foreground truncate", children: ch.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: ch.is_published ? "default" : "secondary",
                      className: "text-xs",
                      children: ch.is_published ? "Published" : "Draft"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    asChild: true,
                    "data-ocid": `edit_comic.edit_chapter_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/creator/comics/$comicId/chapters/$chapterId",
                        params: { comicId, chapterId: ch.id },
                        children: "Edit"
                      }
                    )
                  }
                )
              ]
            },
            ch.id
          )) })
        ] })
      ]
    }
  );
}
export {
  EditComicPage
};
