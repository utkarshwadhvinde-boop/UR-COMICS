import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, N as useComposedRefs, a as cn, O as isOwnerAuthenticated, u as useAppStore, P as loadStealth, B as BookOpen, T as TrendingUp, g as formatNumber, U as Upload, h as Badge, k as useNavigate, I as Input, f as Button, Q as saveStealth, R as saveOwnerAuth } from "./index-B-vfLtPB.js";
import { u as useLayoutEffect2, P as Presence, a as Primitive, b as useControllableState, c as composeEventHandlers, d as createContextScope } from "./index-CxrAChpG.js";
import { C as Check } from "./check-CGVAu_n0.js";
import { L as Label } from "./label-DiRqCm25.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-4nIroVS_.js";
import { T as Textarea } from "./textarea-C-pSGs7O.js";
import { u as ue } from "./index-CRYEPULx.js";
import { E as Eye } from "./eye-cDKSMoj1.js";
import { H as Heart } from "./heart-x3YuBdyG.js";
import { L as LogOut } from "./log-out-CMIHteBV.js";
import { S as Sparkles, F as Flame } from "./sparkles-BUU-kwGM.js";
import { E as EyeOff, S as Shield } from "./shield-BSnp_5AB.js";
import { S as SquarePen } from "./square-pen-8JRAgkZT.js";
import { S as Star } from "./star-BRPg9LIZ.js";
import { L as Lock } from "./lock-BFqCFY4y.js";
import { T as Trash2 } from "./trash-2-EEtAlR-5.js";
import { Z as Zap } from "./zap-CU2ZFdnB.js";
import "./index-DHzBZauC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
      key: "1nkz8b"
    }
  ]
];
const Pin = createLucideIcon("pin", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5", key: "1uzm8b" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const SquareCheckBig = createLucideIcon("square-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState$1(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState$1(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME$1 = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME$1, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME$1;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState$1(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const OWNER_PASSWORD = "UrComics2025!";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 1e4;
const ALL_GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Action",
  "Romance",
  "Thriller",
  "Horror",
  "Slice of Life",
  "Comedy",
  "Drama",
  "Adventure"
];
function LoginScreen({ onSuccess }) {
  const navigate = useNavigate();
  const [password, setPassword] = reactExports.useState("");
  const [showPw, setShowPw] = reactExports.useState(false);
  const [attempts, setAttempts] = reactExports.useState(0);
  const [lockoutEnd, setLockoutEnd] = reactExports.useState(null);
  const [secondsLeft, setSecondsLeft] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!lockoutEnd) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutEnd - Date.now()) / 1e3);
      if (remaining <= 0) {
        setLockoutEnd(null);
        setSecondsLeft(0);
        clearInterval(interval);
      } else {
        setSecondsLeft(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockoutEnd]);
  const isLocked = lockoutEnd !== null && Date.now() < lockoutEnd;
  const handleLogin = (e) => {
    e.preventDefault();
    if (isLocked) return;
    if (password === OWNER_PASSWORD) {
      saveOwnerAuth(true);
      ue.success("Owner access granted", { id: "owner-login" });
      onSuccess();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        const end = Date.now() + LOCKOUT_MS;
        setLockoutEnd(end);
        setSecondsLeft(Math.ceil(LOCKOUT_MS / 1e3));
        ue.error(`Too many attempts. Locked for ${LOCKOUT_MS / 1e3}s.`);
        setTimeout(() => void navigate({ to: "/" }), LOCKOUT_MS);
      } else {
        ue.error(`Wrong password. ${MAX_ATTEMPTS - next} attempt(s) left.`);
      }
      setPassword("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen flex items-center justify-center",
      style: {
        background: "linear-gradient(135deg, #0D0A1A 0%, #1A1035 50%, #0D0A1A 100%)"
      },
      "data-ocid": "owner.login_page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-sm mx-auto p-8 rounded-3xl",
          style: {
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(114,102,255,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(90,59,255,0.15)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                  style: { background: "linear-gradient(135deg, #5A3BFF, #A855F7)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-8 h-8 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "text-2xl font-bold mb-1",
                  style: { color: "#E8E0FF", fontFamily: "var(--font-display)" },
                  children: "Owner Panel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#7B6FAA", fontSize: "0.85rem" }, children: "Restricted access — authorized only" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    style: {
                      color: "#9B8ECF",
                      fontSize: "0.8rem",
                      letterSpacing: "0.05em"
                    },
                    children: "OWNER PASSWORD"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: showPw ? "text" : "password",
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      placeholder: "Enter owner password",
                      disabled: isLocked,
                      className: "pr-10 rounded-xl border-0 text-white placeholder:text-white/20",
                      style: {
                        background: "rgba(255,255,255,0.05)",
                        color: "#E8E0FF",
                        border: "1px solid rgba(114,102,255,0.3)"
                      },
                      "data-ocid": "owner.password_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity",
                      onClick: () => setShowPw((v) => !v),
                      style: { color: "#9B8ECF" },
                      "aria-label": showPw ? "Hide password" : "Show password",
                      children: showPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center text-sm rounded-xl py-2",
                  style: { background: "rgba(239,68,68,0.1)", color: "#F87171" },
                  children: [
                    "Locked. Redirecting in ",
                    secondsLeft,
                    "s…"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  disabled: isLocked || !password,
                  className: "w-full rounded-xl h-11 font-semibold border-0 text-white",
                  style: { background: "linear-gradient(135deg, #5A3BFF, #A855F7)" },
                  "data-ocid": "owner.login_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 mr-2" }),
                    "Access Owner Panel"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const EMPTY_FORM = {
  title: "",
  description: "",
  author: "",
  coverImage: "",
  genres: [],
  status: "ongoing",
  isFeatured: false,
  isTrending: false,
  isPremium: false,
  isPinned: false,
  forceBoost: false
};
function OwnerUploadForm({ onDone }) {
  const { addComic } = useAppStore();
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const toggleGenre = (g) => {
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g]
    }));
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      ue.error("Title and author are required.");
      return;
    }
    const id = `owner-${Date.now()}`;
    const now = Date.now();
    const newComic = {
      id,
      title: form.title,
      description: form.description,
      author: form.author,
      coverImage: form.coverImage || "/assets/generated/placeholder-page.jpg",
      genres: form.genres.length ? form.genres : ["Action"],
      status: form.status,
      likes: form.forceBoost ? 5e3 : 0,
      views: form.forceBoost ? 5e4 : 0,
      rating: 5,
      chapters: [],
      createdAt: now,
      updatedAt: now,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isPremium: form.isPremium,
      isPinned: form.isPinned,
      creatorId: "owner",
      isOwnerComic: true
    };
    addComic(newComic);
    ue.success(`"${form.title}" published instantly!`);
    setForm(EMPTY_FORM);
    onDone();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-5",
      "data-ocid": "owner.upload_form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "owner-label", children: "TITLE *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.title,
                onChange: (e) => set("title", e.target.value),
                placeholder: "Comic title",
                className: "owner-input mt-1",
                "data-ocid": "owner.upload_title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "owner-label", children: "AUTHOR *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.author,
                onChange: (e) => set("author", e.target.value),
                placeholder: "Author name",
                className: "owner-input mt-1",
                "data-ocid": "owner.upload_author_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "owner-label", children: "DESCRIPTION" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: form.description,
              onChange: (e) => set("description", e.target.value),
              placeholder: "Comic description…",
              rows: 3,
              className: "owner-input mt-1 resize-none",
              "data-ocid": "owner.upload_description_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "owner-label", children: "COVER IMAGE URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.coverImage,
              onChange: (e) => set("coverImage", e.target.value),
              placeholder: "https://…",
              className: "owner-input mt-1",
              "data-ocid": "owner.upload_cover_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "owner-label", children: "STATUS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: form.status,
              onChange: (e) => set("status", e.target.value),
              className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
              "data-ocid": "owner.upload_status_select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ongoing", children: "Ongoing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "Completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hiatus", children: "Hiatus" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "owner-label", children: "GENRES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: ALL_GENRES.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleGenre(g),
              className: "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
              style: form.genres.includes(g) ? {
                background: "linear-gradient(135deg, #5A3BFF, #A855F7)",
                color: "#fff"
              } : {
                background: "rgba(255,255,255,0.06)",
                color: "#7B6FAA",
                border: "1px solid rgba(114,102,255,0.2)"
              },
              "data-ocid": `owner.genre_toggle.${g.toLowerCase().replace(/\s+/g, "-")}`,
              children: g
            },
            g
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl p-4 space-y-3",
            style: {
              background: "rgba(90,59,255,0.08)",
              border: "1px solid rgba(114,102,255,0.2)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-semibold",
                  style: { color: "#9B8ECF", letterSpacing: "0.05em" },
                  children: "OWNER PRIVILEGES"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                { key: "isFeatured", label: "⭐ Featured", field: "isFeatured" },
                { key: "isTrending", label: "🔥 Trending", field: "isTrending" },
                { key: "isPremium", label: "🔒 Premium", field: "isPremium" },
                { key: "isPinned", label: "📌 Pinned at Top", field: "isPinned" }
              ].map(({ key, label, field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2",
                  "data-ocid": `owner.upload_${field}_checkbox`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: `flag-${key}`,
                        checked: form[field],
                        onCheckedChange: (v) => set(field, !!v),
                        className: "border-purple-500/40 data-[state=checked]:bg-purple-600"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: `flag-${key}`,
                        className: "text-sm cursor-pointer",
                        style: { color: "#C4B5FD" },
                        children: label
                      }
                    )
                  ]
                },
                key
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 cursor-pointer",
                  "data-ocid": "owner.upload_boost_toggle",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        id: "force-boost-switch",
                        checked: form.forceBoost,
                        onCheckedChange: (v) => set("forceBoost", v),
                        className: "data-[state=checked]:bg-purple-600"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "force-boost-switch",
                        className: "text-sm cursor-pointer",
                        style: { color: "#C4B5FD" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 inline mr-1" }),
                          "Force Visibility Boost (seed views/likes)"
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              className: "flex-1 rounded-xl h-11 font-semibold border-0 text-white",
              style: { background: "linear-gradient(135deg, #5A3BFF, #A855F7)" },
              "data-ocid": "owner.upload_submit_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                "Publish Instantly"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: () => setForm(EMPTY_FORM),
              className: "rounded-xl px-4",
              style: { color: "#7B6FAA" },
              "data-ocid": "owner.upload_reset_button",
              children: "Reset"
            }
          )
        ] })
      ]
    }
  );
}
function ComicRow({
  comic,
  index,
  selected,
  onSelect
}) {
  const { updateComic, deleteComic } = useAppStore();
  const [editing, setEditing] = reactExports.useState(false);
  const [editTitle, setEditTitle] = reactExports.useState(comic.title);
  const toggleFlag = (field) => {
    updateComic(comic.id, { [field]: !comic[field] });
    ue.success("Updated!");
  };
  const handleDelete = () => {
    if (confirm(`Delete "${comic.title}" permanently?`)) {
      deleteComic(comic.id);
      ue.success("Comic deleted");
    }
  };
  const saveEdit = () => {
    if (editTitle.trim()) updateComic(comic.id, { title: editTitle.trim() });
    setEditing(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 transition-all duration-200 group",
      style: {
        borderBottom: "1px solid rgba(114,102,255,0.1)",
        background: selected ? "rgba(90,59,255,0.08)" : "transparent"
      },
      "data-ocid": `owner.comic.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: selected,
            onCheckedChange: (v) => onSelect(comic.id, !!v),
            className: "shrink-0 border-purple-500/40 data-[state=checked]:bg-purple-600",
            "data-ocid": `owner.comic.checkbox.${index}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: comic.coverImage,
            alt: comic.title,
            className: "w-10 h-14 object-cover rounded-lg shrink-0",
            style: { border: "1px solid rgba(114,102,255,0.2)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editTitle,
                onChange: (e) => setEditTitle(e.target.value),
                className: "h-7 text-sm rounded-lg owner-input",
                onKeyDown: (e) => e.key === "Enter" && saveEdit(),
                "data-ocid": `owner.comic.edit_input.${index}`,
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: saveEdit,
                className: "h-7 text-xs rounded-lg border-0",
                style: { background: "#5A3BFF", color: "#fff" },
                "data-ocid": `owner.comic.save_button.${index}`,
                children: "Save"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-semibold text-sm truncate",
              style: { color: "#E8E0FF" },
              children: comic.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs truncate mt-0.5", style: { color: "#7B6FAA" }, children: comic.author }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
            comic.isOwnerComic && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[9px] px-1.5 py-0.5 rounded-full",
                style: { background: "rgba(90,59,255,0.3)", color: "#C4B5FD" },
                children: "👑 Owner"
              }
            ),
            comic.isPinned && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300", children: "📌 Pinned" }),
            comic.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400", children: "⭐ Featured" }),
            comic.isTrending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400", children: "🔥 Trending" }),
            comic.isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-700/40 text-zinc-400", children: "🔒 Premium" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-xs text-right shrink-0 hidden md:block",
            style: { color: "#7B6FAA" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                formatNumber(comic.views),
                " views"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                formatNumber(comic.likes),
                " likes"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setEditing((v) => !v);
                setEditTitle(comic.title);
              },
              className: "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              style: { color: "#9B8ECF" },
              title: "Edit title",
              "data-ocid": `owner.comic.edit_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleFlag("isPinned"),
              className: "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              style: { color: comic.isPinned ? "#A78BFA" : "#7B6FAA" },
              title: "Pin",
              "data-ocid": `owner.comic.pin_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleFlag("isFeatured"),
              className: "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              style: { color: comic.isFeatured ? "#F59E0B" : "#7B6FAA" },
              title: "Feature",
              "data-ocid": `owner.comic.feature_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleFlag("isTrending"),
              className: "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              style: { color: comic.isTrending ? "#F97316" : "#7B6FAA" },
              title: "Trending",
              "data-ocid": `owner.comic.trending_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleFlag("isPremium"),
              className: "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              style: { color: comic.isPremium ? "#E8E0FF" : "#7B6FAA" },
              title: "Premium",
              "data-ocid": `owner.comic.premium_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleDelete,
              className: "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
              style: { color: "#F87171" },
              title: "Delete",
              "data-ocid": `owner.comic.delete_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function Dashboard() {
  const { comics, updateComic, deleteComic, demoMode, setDemoMode } = useAppStore();
  const [stealthMode, setStealthMode] = reactExports.useState(loadStealth);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [filterOwner, setFilterOwner] = reactExports.useState(false);
  const handleStealthToggle = (v) => {
    saveStealth(v);
    setStealthMode(v);
    ue.success(
      v ? "Stealth mode ON — panel hidden from UI" : "Stealth mode OFF"
    );
  };
  const handleDemoToggle = (v) => {
    setDemoMode(v);
    ue.success(
      v ? "Demo Mode ON — sample comics loaded for testing" : "Demo Mode OFF — showing real data only"
    );
  };
  const handleLogout = () => {
    saveOwnerAuth(false);
    window.location.href = "/";
  };
  const totalViews = comics.reduce((a, c) => a + c.views, 0);
  const totalLikes = comics.reduce((a, c) => a + c.likes, 0);
  const ownerComics = comics.filter((c) => c.isOwnerComic);
  const displayed = filterOwner ? ownerComics : comics;
  const toggleSelect = (id, checked) => {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };
  const selectAll = () => {
    if (selected.size === displayed.length) {
      setSelected(/* @__PURE__ */ new Set());
    } else {
      setSelected(new Set(displayed.map((c) => c.id)));
    }
  };
  const bulkPublish = () => {
    for (const id of selected) updateComic(id, { status: "ongoing" });
    ue.success(`Published ${selected.size} comic(s)`);
    setSelected(/* @__PURE__ */ new Set());
  };
  const bulkUnpublish = () => {
    for (const id of selected) updateComic(id, { status: "hiatus" });
    ue.success(`Set ${selected.size} comic(s) to hiatus`);
    setSelected(/* @__PURE__ */ new Set());
  };
  const bulkDelete = () => {
    if (!confirm(`Delete ${selected.size} comic(s) permanently?`)) return;
    for (const id of selected) deleteComic(id);
    ue.success(`Deleted ${selected.size} comic(s)`);
    setSelected(/* @__PURE__ */ new Set());
  };
  const stats = [
    {
      icon: BookOpen,
      label: "Total Comics",
      value: comics.length,
      accent: "#7C3AED"
    },
    {
      icon: Eye,
      label: "Total Views",
      value: formatNumber(totalViews),
      accent: "#2563EB"
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: formatNumber(totalLikes),
      accent: "#DC2626"
    },
    {
      icon: Users,
      label: "Creators",
      value: new Set(comics.map((c) => c.creatorId)).size,
      accent: "#059669"
    },
    {
      icon: Crown,
      label: "Owner Comics",
      value: ownerComics.length,
      accent: "#D97706"
    },
    {
      icon: TrendingUp,
      label: "Trending",
      value: comics.filter((c) => c.isTrending).length,
      accent: "#EA580C"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: { background: "#0D0A1A" },
      "data-ocid": "owner.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "sticky top-0 z-40 px-6 py-4 flex items-center justify-between",
            style: {
              background: "rgba(13,10,26,0.9)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(114,102,255,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-xl flex items-center justify-center",
                    style: { background: "linear-gradient(135deg, #5A3BFF, #A855F7)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h1",
                    {
                      className: "text-base font-bold",
                      style: { color: "#E8E0FF", fontFamily: "var(--font-display)" },
                      children: "Owner Panel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#7B6FAA" }, children: "Full platform control" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium", style: { color: "#F59E0B" }, children: "Demo Mode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: "#7B6FAA" }, children: demoMode ? "Sample data ON" : "Real data only" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: demoMode,
                      onCheckedChange: handleDemoToggle,
                      className: "data-[state=checked]:bg-amber-500",
                      "data-ocid": "owner.demo_mode_toggle"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium", style: { color: "#C4B5FD" }, children: "Stealth Mode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: "#7B6FAA" }, children: stealthMode ? "Panel hidden from UI" : "Panel visible" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: stealthMode,
                      onCheckedChange: handleStealthToggle,
                      className: "data-[state=checked]:bg-purple-600",
                      "data-ocid": "owner.stealth_toggle"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleLogout,
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-colors",
                    style: {
                      color: "#7B6FAA",
                      border: "1px solid rgba(114,102,255,0.2)"
                    },
                    "data-ocid": "owner.logout_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8",
              "data-ocid": "owner.stats_section",
              children: stats.map(({ icon: Icon, label, value, accent }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl p-4 text-center",
                  style: {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(114,102,255,0.15)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2",
                        style: { background: `${accent}22` },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4", style: { color: accent } })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xl font-bold",
                        style: { color: "#E8E0FF", fontFamily: "var(--font-display)" },
                        children: value
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] mt-0.5", style: { color: "#7B6FAA" }, children: label })
                  ]
                },
                label
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "comics", className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsList,
              {
                className: "rounded-xl p-1 border-0",
                style: {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(114,102,255,0.15)"
                },
                children: [
                  { value: "comics", label: "Comics", icon: BookOpen },
                  { value: "upload", label: "Upload", icon: Upload },
                  { value: "analytics", label: "Analytics", icon: ChartColumn }
                ].map(({ value, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value,
                    className: "rounded-lg text-sm data-[state=active]:text-white border-0",
                    style: { color: "#7B6FAA" },
                    "data-ocid": `owner.tab.${value}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 mr-1.5" }),
                      label
                    ]
                  },
                  value
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "comics", className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2",
                    "data-ocid": "owner.filter_owner_toggle",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          id: "filter-owner-switch",
                          checked: filterOwner,
                          onCheckedChange: setFilterOwner,
                          className: "data-[state=checked]:bg-purple-600 scale-90"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "filter-owner-switch",
                          className: "text-sm cursor-pointer",
                          style: { color: "#9B8ECF" },
                          children: "Owner comics only"
                        }
                      )
                    ]
                  }
                ),
                selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", style: { color: "#9B8ECF" }, children: [
                    selected.size,
                    " selected"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: bulkPublish,
                      className: "px-3 py-1 rounded-lg text-xs font-medium",
                      style: {
                        background: "rgba(5,150,105,0.2)",
                        color: "#34D399"
                      },
                      "data-ocid": "owner.bulk_publish_button",
                      children: "Publish"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: bulkUnpublish,
                      className: "px-3 py-1 rounded-lg text-xs font-medium",
                      style: {
                        background: "rgba(245,158,11,0.15)",
                        color: "#FCD34D"
                      },
                      "data-ocid": "owner.bulk_unpublish_button",
                      children: "Hiatus"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: bulkDelete,
                      className: "px-3 py-1 rounded-lg text-xs font-medium",
                      style: {
                        background: "rgba(239,68,68,0.15)",
                        color: "#F87171"
                      },
                      "data-ocid": "owner.bulk_delete_button",
                      children: "Delete"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl overflow-hidden",
                  style: {
                    border: "1px solid rgba(114,102,255,0.15)",
                    background: "rgba(255,255,255,0.02)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-3 px-4 py-3",
                        style: {
                          borderBottom: "1px solid rgba(114,102,255,0.15)",
                          background: "rgba(90,59,255,0.06)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: selectAll,
                              className: "flex items-center gap-2 text-xs font-medium",
                              style: { color: "#9B8ECF" },
                              "data-ocid": "owner.select_all_button",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-3.5 h-3.5" }),
                                selected.size === displayed.length && displayed.length > 0 ? "Deselect All" : "Select All"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs", style: { color: "#7B6FAA" }, children: [
                            displayed.length,
                            " comics"
                          ] })
                        ]
                      }
                    ),
                    displayed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "py-12 text-center",
                        "data-ocid": "owner.comics.empty_state",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Sparkles,
                            {
                              className: "w-8 h-8 mx-auto mb-3",
                              style: { color: "#5A3BFF" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#7B6FAA" }, children: "No comics yet. Upload your first!" })
                        ]
                      }
                    ) : displayed.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ComicRow,
                      {
                        comic,
                        index: i + 1,
                        selected: selected.has(comic.id),
                        onSelect: toggleSelect
                      },
                      comic.id
                    ))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "upload", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl p-6",
                style: {
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(114,102,255,0.15)"
                },
                "data-ocid": "owner.upload_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5", style: { color: "#A78BFA" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        className: "text-lg font-bold",
                        style: {
                          color: "#E8E0FF",
                          fontFamily: "var(--font-display)"
                        },
                        children: "Publish New Comic"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: "text-xs ml-1 border-0",
                        style: {
                          background: "rgba(90,59,255,0.3)",
                          color: "#C4B5FD"
                        },
                        children: "Owner · Instant"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerUploadForm, { onDone: () => {
                  } })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl p-6",
                style: {
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(114,102,255,0.15)"
                },
                "data-ocid": "owner.analytics_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-5 h-5", style: { color: "#A78BFA" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        className: "text-lg font-bold",
                        style: {
                          color: "#E8E0FF",
                          fontFamily: "var(--font-display)"
                        },
                        children: "Platform Analytics"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mb-4", style: { color: "#7B6FAA" }, children: "Top performing comics by views" }),
                    [...comics].sort((a, b) => b.views - a.views).slice(0, 8).map((comic, i) => {
                      var _a;
                      const pct = Math.round(
                        comic.views / (((_a = comics[0]) == null ? void 0 : _a.views) || 1) * 100
                      );
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "space-y-1",
                          "data-ocid": `owner.analytics.item.${i + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: "truncate max-w-[60%]",
                                  style: { color: "#C4B5FD" },
                                  children: [
                                    i + 1,
                                    ". ",
                                    comic.title
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#7B6FAA" }, children: [
                                formatNumber(comic.views),
                                " views"
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "h-1.5 rounded-full",
                                style: { background: "rgba(255,255,255,0.06)" },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: "h-full rounded-full",
                                    style: {
                                      width: `${pct}%`,
                                      background: "linear-gradient(90deg, #5A3BFF, #A855F7)",
                                      transition: "width 0.5s ease"
                                    }
                                  }
                                )
                              }
                            )
                          ]
                        },
                        comic.id
                      );
                    })
                  ] })
                ]
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function OwnerPage() {
  const [authenticated, setAuthenticated] = reactExports.useState(isOwnerAuthenticated);
  if (authenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginScreen, { onSuccess: () => setAuthenticated(true) });
}
export {
  OwnerPage as default
};
