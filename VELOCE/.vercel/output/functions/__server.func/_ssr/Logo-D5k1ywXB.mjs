import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-D5k1ywXB.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ className = "", showWord = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: `group inline-flex items-center gap-2 ${className}`,
		"aria-label": "Veloce home",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: "28",
			height: "28",
			viewBox: "0 0 32 32",
			className: "transition-transform duration-500 group-hover:rotate-[8deg]",
			fill: "none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "vg-gold",
					x1: "0",
					y1: "0",
					x2: "32",
					y2: "32",
					gradientUnits: "userSpaceOnUse",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "oklch(0.68 0.14 80)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "45%",
							stopColor: "oklch(0.9 0.14 92)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "oklch(0.68 0.14 80)"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "vg-silver",
					x1: "0",
					y1: "0",
					x2: "32",
					y2: "32",
					gradientUnits: "userSpaceOnUse",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "oklch(0.62 0.01 260)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "50%",
							stopColor: "oklch(0.95 0.005 260)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "oklch(0.62 0.01 260)"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M4 5 L14 5 L16 22 L18 5 L28 5 L20 28 L12 28 Z",
					fill: "url(#vg-gold)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "16",
					cy: "16",
					r: "14.5",
					stroke: "url(#vg-silver)",
					strokeOpacity: "0.45"
				})
			]
		}), showWord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[15px] font-bold uppercase tracking-[0.28em] gold-text",
			children: "Veloce"
		})]
	});
}
//#endregion
export { Logo as t };
