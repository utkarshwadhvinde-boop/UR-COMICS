import { j as jsxRuntimeExports, L as Link, f as Button } from "./index-CK63xfI2.js";
function NotFoundPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center min-h-[60vh] text-center px-4",
      "data-ocid": "not_found.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-8xl mb-6", children: "📭" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-display font-bold text-foreground mb-3", children: "Page Not Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-md", children: "The page you're looking for doesn't exist or has been moved." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "gradient-primary text-primary-foreground border-0 rounded-xl px-8",
            "data-ocid": "not_found.home_link",
            children: "Back to Home"
          }
        ) })
      ]
    }
  );
}
export {
  NotFoundPage as default
};
