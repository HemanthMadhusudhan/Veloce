import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DS8gFNjW.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-CiUyHq21.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Logo } from "./Logo-D5k1ywXB.mjs";
import { t as hero_bg_default } from "./hero-bg-DrT25Tbf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-AeKBIKqN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const nav = useNavigate();
	const { userEmail, isAdmin, authLoading } = useShop();
	(0, import_react.useEffect)(() => {
		if (!authLoading && userEmail) nav({
			to: "/",
			replace: true
		});
	}, [
		userEmail,
		isAdmin,
		authLoading,
		nav
	]);
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [passwordConfirm, setPasswordConfirm] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [info, setInfo] = (0, import_react.useState)(null);
	const [showMockModal, setShowMockModal] = (0, import_react.useState)(false);
	const clear = () => {
		setErr(null);
		setInfo(null);
	};
	const submit = async (e) => {
		e.preventDefault();
		clear();
		setLoading(true);
		try {
			if (mode === "in") {
				const mailVal = email.trim();
				const passVal = password;
				if (!mailVal || !passVal) throw new Error("Please enter your email and password.");
				const { error } = await supabase.auth.signInWithPassword({
					email: mailVal,
					password: passVal
				});
				if (error) throw error;
			} else if (mode === "up") {
				const nameVal = name.trim();
				const mailVal = email.trim();
				const passVal = password;
				const passConfVal = passwordConfirm;
				const phoneVal = phone.trim();
				if (!nameVal || !mailVal || !passVal || !passConfVal) throw new Error("Please fill in all required fields.");
				if (!mailVal.includes("@")) throw new Error("Please enter a valid email address.");
				if (passVal !== passConfVal) throw new Error("Passwords do not match.");
				const { data: existingEmail } = await supabase.from("users").select("id").eq("email", mailVal).maybeSingle();
				if (existingEmail) throw new Error("A user with this email address already exists. Tap “Sign in” below instead.");
				const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
					email: mailVal,
					password: passVal,
					options: { data: {
						fullName: nameVal,
						phone: phoneVal || void 0
					} }
				});
				if (signUpError) throw signUpError;
				if (signUpData.session) setInfo("Registration successful! You are now logged in.");
				else setInfo("Registration successful! Check your email inbox for a confirmation link.");
			}
		} catch (e2) {
			setErr(e2 instanceof Error ? e2.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};
	const oauth = async (provider) => {
		clear();
		setLoading(true);
		try {
			const redirectUrl = window.location.origin + "/auth/callback";
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: redirectUrl }
			});
			if (error) throw error;
		} catch (error) {
			setShowMockModal(true);
			setLoading(false);
		}
	};
	const handleMockGoogleLogin = async () => {
		setShowMockModal(false);
		setLoading(true);
		clear();
		try {
			const testerEmail = "google.tester@example.com";
			const testerPassword = "google-tester-123456";
			const { error } = await supabase.auth.signInWithPassword({
				email: testerEmail,
				password: testerPassword
			});
			if (error) {
				const { error: signUpError } = await supabase.auth.signUp({
					email: testerEmail,
					password: testerPassword,
					options: { data: { fullName: "Google Tester" } }
				});
				if (signUpError) throw signUpError;
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email: testerEmail,
					password: testerPassword
				});
				if (signInError) throw signInError;
			}
		} catch (error) {
			setErr(error instanceof Error ? error.message : "Mock Google Login failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden overflow-hidden lg:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_bg_default,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover animate-slow-zoom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-background/70 via-background/30 to-background/90" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-full flex-col justify-between p-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.3em] text-brand",
								children: "Members"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-3 font-display text-5xl font-bold leading-tight",
								children: [
									"Cinematic detail.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Delivered to you first."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-sm text-muted-foreground",
								children: "Early access to drops, private appointments, and lifetime authentication on every piece."
							})
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center px-6 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 text-[10px] uppercase tracking-[0.28em] text-brand",
							children: mode === "in" ? "Welcome back" : "Create account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-bold tracking-tight",
							children: mode === "in" ? "Sign in" : "Join Veloce"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submit,
							className: "mt-8 space-y-4",
							children: [
								mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Full name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: name,
										onChange: (e) => setName(e.target.value),
										className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground",
										placeholder: "e.g. Rahul Sharma"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground",
										placeholder: "name@example.com"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground",
										placeholder: "••••••••"
									})
								}),
								mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Confirm Password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: passwordConfirm,
										onChange: (e) => setPasswordConfirm(e.target.value),
										className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground",
										placeholder: "••••••••"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone number (Optional)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										className: "w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground",
										placeholder: "e.g. +91 98765 43210"
									})
								})] }),
								err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-[11px] text-brand",
									children: err
								}),
								info && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300",
									children: info
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: loading,
									type: "submit",
									className: "w-full rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground disabled:opacity-60 cursor-pointer",
									children: loading ? "Please wait..." : mode === "in" ? "Sign In" : "Create Account"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border/60" }),
								" or",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border/60" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: loading,
							onClick: () => oauth("google"),
							className: "w-full rounded-full border border-border/70 py-2.5 text-xs hover:border-foreground disabled:opacity-60 cursor-pointer transition",
							children: "Continue with Google"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 text-center text-xs text-muted-foreground",
							children: [
								mode === "in" ? "New here?" : "Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setMode(mode === "in" ? "up" : "in");
										clear();
									},
									className: "font-semibold text-foreground underline-offset-4 hover:underline cursor-pointer",
									children: mode === "in" ? "Create an account" : "Sign in"
								})
							]
						})
					]
				})
			}),
			showMockModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl border border-border/60 bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.28em] text-brand",
							children: "Google Auth Sandbox"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-xl font-bold tracking-tight",
							children: "Mock Google Login"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground leading-relaxed",
							children: [
								"Google OAuth has placeholder credentials (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-foreground font-mono",
									children: "GOOGLE_CLIENT_ID"
								}),
								") in the database."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground leading-relaxed",
							children: "To facilitate local testing, we can log you in instantly with a mock account, or you can cancel to configure real Google credentials."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleMockGoogleLogin,
								className: "w-full rounded-full bg-foreground py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-brand hover:text-foreground cursor-pointer",
								children: "Use Mock Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowMockModal(false),
								className: "w-full rounded-full border border-border/70 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-foreground cursor-pointer",
								children: "Cancel"
							})]
						})
					]
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { LoginPage as component };
