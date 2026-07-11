import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DEHV6YAt.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Logo } from "./Logo-D5k1ywXB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-By6v5-bN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPage() {
	const nav = useNavigate();
	const [token, setToken] = (0, import_react.useState)("");
	const [pw, setPw] = (0, import_react.useState)("");
	const [pw2, setPw2] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [ok, setOk] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) setToken("valid");
		});
	}, []);
	const submit = async (e) => {
		e.preventDefault();
		setErr(null);
		if (pw.length < 8) return setErr("Password must be at least 8 characters.");
		if (pw !== pw2) return setErr("Passwords don't match.");
		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: pw });
			if (error) throw error;
			setOk(true);
			await supabase.auth.signOut();
			setTimeout(() => nav({ to: "/login" }), 1500);
		} catch (error) {
			setErr(error instanceof Error ? error.message : "Unable to reset password");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 text-[10px] uppercase tracking-[0.28em] text-brand",
					children: "Set a new password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-bold tracking-tight",
					children: "Reset password"
				}),
				!token && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: "This reset link is missing or invalid."
				}),
				token && !ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-8 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "New password",
							value: pw,
							onChange: (e) => setPw(e.target.value),
							className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "Confirm new password",
							value: pw2,
							onChange: (e) => setPw2(e.target.value),
							className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-[11px] text-brand",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: loading,
							className: "w-full rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background disabled:opacity-60",
							children: loading ? "..." : "Update password"
						})
					]
				}),
				ok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300",
					children: "Password updated. Redirecting to sign in..."
				})
			]
		})
	});
}
//#endregion
export { ResetPage as component };
