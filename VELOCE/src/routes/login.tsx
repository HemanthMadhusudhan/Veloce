import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import heroBg from "@/assets/hero-bg.jpg";
import { useShop } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Veloce" }] }),
  component: LoginPage,
});

type Mode = "in" | "up";

function LoginPage() {
  const nav = useNavigate();
  const { userEmail, isAdmin, authLoading } = useShop();

  useEffect(() => {
    if (!authLoading && userEmail) nav({ to: "/", replace: true });
  }, [userEmail, isAdmin, authLoading, nav]);

  const [mode, setMode] = useState<Mode>("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showMockModal, setShowMockModal] = useState(false);

  const clear = () => {
    setErr(null);
    setInfo(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    setLoading(true);
    try {
      if (mode === "in") {
        const mailVal = email.trim();
        const passVal = password;

        if (!mailVal || !passVal) {
          throw new Error("Please enter your email and password.");
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: mailVal,
          password: passVal,
        });
        if (error) throw error;
      } else if (mode === "up") {
        const nameVal = name.trim();
        const mailVal = email.trim();
        const passVal = password;
        const passConfVal = passwordConfirm;
        const phoneVal = phone.trim();

        if (!nameVal || !mailVal || !passVal || !passConfVal) {
          throw new Error("Please fill in all required fields.");
        }
        if (!mailVal.includes("@")) {
          throw new Error("Please enter a valid email address.");
        }
        if (passVal !== passConfVal) {
          throw new Error("Passwords do not match.");
        }

        // Check if email already exists in public.users table
        const { data: existingEmail } = await supabase
          .from("users")
          .select("id")
          .eq("email", mailVal)
          .maybeSingle();

        if (existingEmail) {
          throw new Error("A user with this email address already exists. Tap “Sign in” below instead.");
        }

        // Create user record in auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: mailVal,
          password: passVal,
          options: {
            data: {
              fullName: nameVal,
              phone: phoneVal || undefined,
            },
          },
        });
        if (signUpError) throw signUpError;

        // If email confirmation is required, show verification notice; otherwise log in
        if (signUpData.session) {
          setInfo("Registration successful! You are now logged in.");
        } else {
          setInfo("Registration successful! Check your email inbox for a confirmation link.");
        }
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider: "google") => {
    clear();
    setLoading(true);
    try {
      const redirectUrl = window.location.origin + "/auth/callback";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (error) {
      // Show mock modal for sandbox environments
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
        password: testerPassword,
      });

      if (error) {
        // Sign up first
        const { error: signUpError } = await supabase.auth.signUp({
          email: testerEmail,
          password: testerPassword,
          options: {
            data: {
              fullName: "Google Tester",
            },
          },
        });
        if (signUpError) throw signUpError;

        // Try signing in again
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: testerEmail,
          password: testerPassword,
        });
        if (signInError) throw signInError;
      }
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Mock Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/30 to-background/90" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="font-display font-black tracking-tighter text-2xl gold-text flex items-center gap-2">
            <span>VELOVE</span>
            <span className="text-red-500">❤️</span>
            <span>VELOCE</span>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brand">Members</div>
            <h2 className="mt-3 font-display text-5xl font-bold leading-tight">Cinematic detail.<br/>Delivered to you first.</h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">Early access to drops, private appointments, and lifetime authentication on every piece.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start lg:justify-center px-6 pt-12 pb-24 lg:py-16">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="lg:hidden mb-12 flex justify-center">
            <div className="font-display font-black tracking-tighter text-2xl gold-text flex items-center gap-2">
              <span>VELOVE</span>
              <span className="text-red-500">❤️</span>
              <span>VELOCE</span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.28em] text-brand">
            {mode === "in" ? "Welcome back" : "Create account"}
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            {mode === "in" ? "Sign in" : "Join Veloce"}
          </h1>

          <form onSubmit={submit} className="mt-10 space-y-5">
            {/* Signup fields */}
            {mode === "up" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both">
                <Field label="Full name">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-surface/30 px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
                    placeholder="e.g. Rahul Sharma"
                  />
                </Field>
              </div>
            )}

            {/* Email field */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both">
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/70 bg-surface/30 px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="name@example.com"
                />
              </Field>
            </div>

            {/* Password field */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both">
              <Field label="Password">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border/70 bg-surface/30 px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="••••••••"
                />
              </Field>
            </div>

            {/* Signup confirm fields */}
            {mode === "up" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both space-y-5">
                <Field label="Confirm Password">
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-surface/30 px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="Phone number (Optional)">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-surface/30 px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
                    placeholder="e.g. +91 98765 43210"
                  />
                </Field>
              </div>
            )}

            {err && <div className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-[11px] text-brand animate-in fade-in zoom-in-95">{err}</div>}
            {info && <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300 animate-in fade-in zoom-in-95">{info}</div>}

            <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both">
              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-full bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground disabled:opacity-60 cursor-pointer shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                {loading
                  ? "Please wait..."
                  : mode === "in"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </div>
          </form>

          <div className="my-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground animate-in fade-in duration-300 fill-mode-both">
            <div className="h-px flex-1 bg-border/60" /> or <div className="h-px flex-1 bg-border/60" />
          </div>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both">
            <button
              type="button"
              disabled={loading}
              onClick={() => oauth("google")}
              className="w-full rounded-full border border-border/70 bg-surface/20 py-3 text-xs hover:border-foreground hover:bg-surface/50 disabled:opacity-60 cursor-pointer transition-all duration-200 flex justify-center items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            {mode === "in" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                clear();
              }}
              className="font-semibold text-foreground underline-offset-4 hover:underline cursor-pointer"
            >
              {mode === "in" ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox/Mock Google Login Modal */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Google Auth Sandbox</div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight">Mock Google Login</h2>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Google OAuth has placeholder credentials (<code className="text-foreground font-mono">GOOGLE_CLIENT_ID</code>) in the database.
            </p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              To facilitate local testing, we can log you in instantly with a mock account, or you can cancel to configure real Google credentials.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleMockGoogleLogin}
                className="w-full rounded-full bg-foreground py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-brand hover:text-foreground cursor-pointer"
              >
                Use Mock Account
              </button>
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                className="w-full rounded-full border border-border/70 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-foreground cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block font-sans">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
