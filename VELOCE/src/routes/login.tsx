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
          throw new Error(
            "A user with this email address already exists. Tap “Sign in” below instead.",
          );
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
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/30 to-background/90" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brand">Members</div>
            <h2 className="mt-3 font-display text-5xl font-bold leading-tight">
              Cinematic detail.
              <br />
              Delivered to you first.
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Early access to drops, private appointments, and lifetime authentication on every
              piece.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="mt-8 text-[10px] uppercase tracking-[0.28em] text-brand">
            {mode === "in" ? "Welcome back" : "Create account"}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {mode === "in" ? "Sign in" : "Join Veloce"}
          </h1>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {/* Signup fields */}
            {mode === "up" && (
              <Field label="Full name">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
                  placeholder="e.g. Rahul Sharma"
                />
              </Field>
            )}

            {/* Email field */}
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
                placeholder="name@example.com"
              />
            </Field>

            {/* Password field */}
            <Field label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
                placeholder="••••••••"
              />
            </Field>

            {/* Signup confirm fields */}
            {mode === "up" && (
              <>
                <Field label="Confirm Password">
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="Phone number (Optional)">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
                    placeholder="e.g. +91 98765 43210"
                  />
                </Field>
              </>
            )}

            {err && (
              <div className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-[11px] text-brand">
                {err}
              </div>
            )}
            {info && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300">
                {info}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Please wait..." : mode === "in" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <div className="h-px flex-1 bg-border/60" /> or{" "}
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => oauth("google")}
            className="w-full rounded-full border border-border/70 py-2.5 text-xs hover:border-foreground disabled:opacity-60 cursor-pointer transition"
          >
            Continue with Google
          </button>

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
            <div className="text-[10px] uppercase tracking-[0.28em] text-brand">
              Google Auth Sandbox
            </div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight">
              Mock Google Login
            </h2>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Google OAuth has placeholder credentials (
              <code className="text-foreground font-mono">GOOGLE_CLIENT_ID</code>) in the database.
            </p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              To facilitate local testing, we can log you in instantly with a mock account, or you
              can cancel to configure real Google credentials.
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
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
