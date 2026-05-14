import { j as jsxRuntimeExports } from "./index-yTllSx9S.js";
import { S as Skeleton } from "./skeleton-KJO8djK4.js";
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg overflow-hidden bg-card border border-border shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[3/4] bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full bg-muted" })
    ] })
  ] });
}
function SkeletonCardRow({ count = 4 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, `skeleton-${String(i)}`)) });
}
export {
  SkeletonCardRow as S,
  SkeletonCard as a
};
