import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-password")({
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
  const okRef = useRef(false);

  useEffect(() => {
    okRef.current = ok;
  }, [ok]);

  useEffect(() => {
    // Supabase automatically logs the user in when clicking a recovery link.
    // Check if a session exists to allow them to reset their password.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken("valid");
      }
    });

    const handleBeforeUnload = () => {
      if (!okRef.current) {
        supabase.auth.signOut();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!okRef.current) {
        supabase.auth.signOut();
      }
    };
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
    <div className="flex min-h-screen bg-white text-black font-sans relative">
      {/* Top Header matching login */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center bg-white border-b border-border/20 z-50">
        <Link to="/" className="flex items-center gap-4">
          <Logo className="h-6 sm:h-8 w-auto text-black" />
          <span className="text-sm tracking-[0.2em] uppercase font-bold text-black border-l border-black/20 pl-4">
            veloceclub
          </span>
        </Link>
        <button onClick={() => { supabase.auth.signOut(); nav({to: "/login"}); }} className="p-2 hover:bg-gray-100 transition rounded-full">
          <X className="h-6 w-6 text-black" />
        </button>
      </div>

      <div className="w-full max-w-md mx-auto pt-32 pb-16 px-6">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold uppercase tracking-tight text-black leading-[1.1] mb-2">
          RESET PASSWORD
        </h1>
        
        {!token && (
          <p className="mt-6 text-sm text-black/70">
            This reset link is missing or invalid. Please request a new link.
          </p>
        )}
        {token && !ok && (
          <form onSubmit={submit} className="mt-8 space-y-6">
            <p className="text-[15px] leading-relaxed text-black mb-8">
              Please enter your new password below.
            </p>

            <FloatingInput
              label="NEW PASSWORD *"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              error={err?.includes("Password") && err !== "Passwords don't match." ? err : null}
            />
            <FloatingInput
              label="CONFIRM PASSWORD *"
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              error={err === "Passwords don't match." ? err : null}
            />

            {err && !err.includes("Password") && (
              <div className="text-red-600 text-sm">{err}</div>
            )}

            <div className="mt-8">
              <Button loading={loading}>UPDATE PASSWORD</Button>
            </div>
          </form>
        )}
        {ok && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black mb-4">SUCCESS</h2>
            <p className="text-[15px] leading-relaxed text-black">
              Your password has been updated successfully. Redirecting you to sign in...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Custom UI Components to match Adidas styling
// ------------------------------------------------------------------

function FloatingInput({ label, type, value, onChange, error }: { label: string, type: string, value: string, onChange: (e: any) => void, error?: string | null }) {
  const [focus, setFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const active = focus || value.length > 0;
  
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full relative">
      <div className={`relative border ${error ? 'border-red-600' : 'border-black'} bg-white flex items-center px-4 h-14 focus-within:border-brand transition-colors`}>
         <label 
           className={`absolute left-4 transition-all duration-200 pointer-events-none text-brand tracking-wide ${active ? 'text-[10px] top-1.5 font-semibold' : 'text-sm top-1/2 -translate-y-1/2'}`}
         >
           {label}
         </label>
         <input 
           type={currentType} 
           value={value}
           onChange={onChange}
           onFocus={() => setFocus(true)}
           onBlur={() => setFocus(false)}
           className="w-full h-full pt-4 pb-1 outline-none bg-transparent text-[15px] text-black pr-16"
         />
         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
           {isPassword && (
             <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-black transition-colors">
               {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
             </button>
           )}
           {error && (
              <button type="button" onClick={() => onChange({target: {value: ""}})}>
                <X className="text-red-600 h-5 w-5 cursor-pointer" />
              </button>
           )}
         </div>
      </div>
      {error && <div className="text-red-600 text-sm mt-1.5">{error}</div>}
    </div>
  );
}

function Button({ children, loading, disabled }: { children: React.ReactNode, loading?: boolean, disabled?: boolean }) {
  return (
    <button
      disabled={loading || disabled}
      type="submit"
      className="group flex w-full items-center justify-between bg-black text-white px-5 py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
    >
      <span>{loading ? "PLEASE WAIT..." : children}</span>
      <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
