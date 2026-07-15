import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset password - Veloce" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPage,
});

function ResetPage() {
  const nav = useNavigate();
  const [token, setToken] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase automatically logs the user in when clicking a recovery link.
    // Check if a session exists to allow them to reset their password.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken("valid");
      }
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
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

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Logo />
        <div className="mt-8 text-[10px] uppercase tracking-[0.28em] text-brand">
          Set a new password
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Reset password</h1>
        {!token && (
          <p className="mt-6 text-sm text-muted-foreground">
            This reset link is missing or invalid.
          </p>
        )}
        {token && !ok && (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Confirm new password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
            />
            {err && (
              <div className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-[11px] text-brand">
                {err}
              </div>
            )}
            <button
              disabled={loading}
              className="w-full rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background disabled:opacity-60"
            >
              {loading ? "..." : "Update password"}
            </button>
          </form>
        )}
        {ok && (
          <p className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            Password updated. Redirecting to sign in...
          </p>
        )}
      </div>
    </div>
  );
}
