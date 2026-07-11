import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in - Veloce" }, { name: "robots", content: "noindex" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        // Redirect to homepage
        nav({ to: "/", replace: true });
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Failed to authenticate with Google");
      }
    }

    handleCallback();
  }, [nav]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-brand text-sm font-semibold uppercase tracking-wider">Authentication Error</div>
        <div className="text-sm text-muted-foreground max-w-md">{error}</div>
        <button
          onClick={() => nav({ to: "/login", replace: true })}
          className="mt-4 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:bg-brand hover:text-foreground transition cursor-pointer"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground animate-pulse">
      Completing Google sign in...
    </div>
  );
}
