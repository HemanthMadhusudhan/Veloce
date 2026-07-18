import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DS8gFNjW.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-jffpmb-T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallback() {
	const nav = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function handleCallback() {
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) throw error;
				nav({
					to: "/",
					replace: true
				});
			} catch (err) {
				console.error("OAuth callback error:", err);
				setError(err instanceof Error ? err.message : "Failed to authenticate with Google");
			}
		}
		handleCallback();
	}, [nav]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-brand text-sm font-semibold uppercase tracking-wider",
				children: "Authentication Error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground max-w-md",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => nav({
					to: "/login",
					replace: true
				}),
				className: "mt-4 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:bg-brand hover:text-foreground transition cursor-pointer",
				children: "Back to sign in"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground animate-pulse",
		children: "Completing Google sign in..."
	});
}
//#endregion
export { AuthCallback as component };
