import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { useShop } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log In or Sign Up — Veloce Wear" }] }),
  component: LoginPage,
});

type Step = "email" | "password" | "signup" | "verify-otp";

function LoginPage() {
  const nav = useNavigate();
  const { userEmail, isAdmin, authLoading } = useShop();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpType, setOtpType] = useState<"signup" | "recovery">("signup");
  
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [showMockModal, setShowMockModal] = useState(false);

  const [termsChecked, setTermsChecked] = useState(false);
  const [offersChecked, setOffersChecked] = useState(false);
  const [keepLoggedChecked, setKeepLoggedChecked] = useState(false);

  useEffect(() => {
    // Prevent redirecting to home if the user just verified a recovery OTP
    // and is about to be redirected to the reset-password page.
    if (!authLoading && userEmail && otpType !== "recovery") {
      nav({ to: "/", replace: true });
    }
  }, [userEmail, isAdmin, authLoading, nav, otpType]);



  const handleContinueEmail = async () => {
    setEmailErr(null);
    if (!email.trim() || !email.includes("@")) {
      setEmailErr("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const { data: exists, error } = await supabase.rpc('check_user_exists', { lookup_email: email.trim() });
      
      if (error) {
        console.error("RPC Error:", error);
        setEmailErr("Please run the setup_check_email.sql script in your Supabase SQL editor to enable this feature.");
        return;
      }
      
      if (exists) {
        setStep("password"); // User exists
      } else {
        setStep("signup"); // New user
      }
    } catch (e) {
      setEmailErr("Something went wrong checking your email.");
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async () => {
    setPassErr(null);
    if (!password) {
      setPassErr("Please enter your password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (e: any) {
      setPassErr(e.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async () => {
    setNameErr(null);
    setPassErr(null);
    
    if (!name.trim()) {
      setNameErr("Please enter your name.");
      return;
    }
    if (!password) {
      setPassErr("Please enter a password.");
      return;
    }
    if (!termsChecked) {
      setNameErr("Please accept the Terms & Conditions to continue.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            fullName: name.trim(),
          },
        },
      });
      if (error) throw error;
      
      if (data.session) {
        setInfo("Registration successful! You are now logged in.");
      } else {
        setStep("verify-otp");
        setOtpType("signup");
        setInfo("We sent an 8-digit code to your email. Enter it below to verify your account.");
      }
    } catch (e: any) {
      console.error("Signup error:", e);
      let errMsg = "Signup failed.";
      if (e?.message) {
        errMsg = e.message;
      } else if (typeof e === 'string') {
        errMsg = e;
      } else if (e) {
        errMsg = JSON.stringify(e);
      }
      
      if (errMsg === "{}") {
        errMsg = "Too many requests or email configuration error. If using Resend, ensure your sender email is verified.";
      }
      setPassErr(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setPassErr(null);
    if (!email.trim() || !email.includes("@")) {
      setPassErr("Please enter a valid email address first.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setStep("verify-otp");
      setOtpType("recovery");
      setInfo("Password reset code sent! Check your email.");
    } catch (e: any) {
      console.error("Forgot password error:", e);
      let errMsg = "Failed to send reset email.";
      if (e?.message) {
        errMsg = e.message;
      } else if (typeof e === 'string') {
        errMsg = e;
      } else if (e) {
        errMsg = JSON.stringify(e);
      }
      
      if (errMsg === "{}") {
        errMsg = "Too many requests or email limit reached. Please check your Supabase rate limits.";
      }
      setPassErr(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setPassErr(null);
    if (!otp.trim()) {
      setPassErr("Please enter the verification code.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: otpType,
      });
      if (error) throw error;
      
      if (otpType === "signup") {
        setInfo("Verification successful! You are now logged in.");
      } else if (otpType === "recovery") {
        window.location.href = "/reset-password";
      }
    } catch (e: any) {
      setPassErr(e.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider: "google") => {
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
      setShowMockModal(true);
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
    setShowMockModal(false);
    setLoading(true);
    try {
      const testerEmail = "google.tester@example.com";
      const testerPassword = "google-tester-123456";

      const { error } = await supabase.auth.signInWithPassword({
        email: testerEmail,
        password: testerPassword,
      });

      if (error) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: testerEmail,
          password: testerPassword,
          options: { data: { fullName: "Google Tester" } },
        });
        if (signUpError) throw signUpError;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: testerEmail,
          password: testerPassword,
        });
        if (signInError) throw signInError;
      }
    } catch (error: any) {
      setEmailErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans relative overflow-x-hidden">
      {/* Top Bar with Close Button */}
      <div className="absolute top-0 right-0 p-4 sm:p-6 z-10">
        <button onClick={() => nav({ to: "/" })} className="text-black hover:opacity-70 transition p-2">
          <X className="h-8 w-8 stroke-[1.5]" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-[420px] px-6 pt-16 pb-24 sm:pt-20">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 mb-10">
          <div className="font-display font-black text-2xl tracking-tighter text-brand">VELOCE WEAR</div>
          <div className="w-px h-5 bg-brand/30" />
          <div className="text-sm font-semibold tracking-wide text-brand">veloceclub</div>
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl sm:text-[44px] font-bold uppercase tracking-tight leading-none mb-4">
          {step === "email" ? "Log in or sign up" : step === "password" ? "Log in" : "Create account"}
        </h1>
        <p className="text-[15px] leading-relaxed mb-8">
          {step === "email" 
            ? "Enjoy members-only access to exclusive products, experiences, offers and more." 
            : step === "password"
            ? "Welcome back. Please enter your password to continue."
            : "Looks like you're new here. Let's get your account set up."}
        </p>

        {/* Social Logins */}
        {step === "email" && (
          <div className="flex gap-4 mb-8">
          <button 
            type="button" 
            onClick={() => oauth("google")}
            className="flex h-12 w-16 items-center justify-center border border-black hover:bg-brand/10 transition"
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
          </button>
        </div>
        )}

        {info && (
          <div className="mb-6 rounded border border-brand/50 bg-brand/10 p-4 text-sm font-semibold text-brand">
            {info}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          if (step === "email") handleContinueEmail();
          else if (step === "password") submitLogin();
          else if (step === "signup") submitSignup();
          else if (step === "verify-otp") handleVerifyOtp();
        }} className="space-y-6">

          {/* Email Step */}
          {step === "email" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <FloatingInput 
                label="EMAIL ADDRESS *" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                error={emailErr} 
              />
              
              <div className="mt-8 space-y-5">
                <Checkbox 
                  checked={termsChecked} 
                  onChange={setTermsChecked}
                  label={
                    <>
                      I have read and accepted the <a href="#" className="underline font-semibold">Terms & Conditions</a>, the <a href="#" className="underline font-semibold">veloceclub Terms & Conditions</a> and the <a href="#" className="underline font-semibold">Privacy Policy</a>. *
                    </>
                  }
                />
              </div>

              <div className="mt-8">
                <Button loading={loading} disabled={!termsChecked}>Continue</Button>
              </div>
            </div>
          )}

          {/* Login Step */}
          {step === "password" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 flex items-center justify-between text-sm">
                <span className="font-semibold">{email}</span>
                <button type="button" onClick={() => setStep("email")} className="underline font-semibold text-brand hover:text-black">Edit</button>
              </div>
              <FloatingInput 
                label="PASSWORD *" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                error={passErr} 
              />
              <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold underline mt-3 block hover:opacity-70 transition">
                Forgot your password?
              </button>
              <div className="mt-8">
                <Button loading={loading}>Log In</Button>
              </div>
            </div>
          )}

          {/* Signup Step */}
          {step === "signup" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 flex items-center justify-between text-sm">
                <span className="font-semibold">{email}</span>
                <button type="button" onClick={() => setStep("email")} className="underline font-semibold text-brand hover:text-black">Edit</button>
              </div>
              
              <div className="space-y-4">
                <FloatingInput 
                  label="FULL NAME *" 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  error={nameErr} 
                />
                <FloatingInput 
                  label="CREATE PASSWORD *" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  error={passErr} 
                />
              </div>

              <div className="mt-6 text-xs text-brand mb-8">
                Password must be at least 8 characters.
              </div>

              <div className="mt-8 space-y-5">
                <Checkbox 
                  checked={termsChecked} 
                  onChange={setTermsChecked}
                  label={
                    <>
                      I have read and accepted the <a href="#" className="underline font-semibold text-black">Terms & Conditions</a> and <a href="#" className="underline font-semibold text-black">Privacy Policy</a>. *
                    </>
                  }
                />
              </div>

              <div className="mt-8">
                <Button loading={loading} disabled={!termsChecked}>Create Account</Button>
              </div>
            </div>
          )}

          {/* Verify OTP Step */}
          {step === "verify-otp" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 flex items-center justify-between text-sm">
                <span className="font-semibold">{email}</span>
                <button type="button" onClick={() => setStep("email")} className="underline font-semibold text-brand hover:text-black">Edit</button>
              </div>
              
              <div className="space-y-4">
                <FloatingInput 
                  label="8-DIGIT CODE *" 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  error={passErr} 
                />
              </div>

              <div className="mt-8">
                <Button loading={loading}>Verify Code</Button>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Sandbox/Mock Google Login Modal */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="w-full max-w-sm border border-brand/20 bg-black text-white p-8 shadow-2xl animate-in zoom-in-95">
            <div className="text-[10px] uppercase tracking-widest text-brand">Google Auth Sandbox</div>
            <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight text-brand">Mock Login</h2>
            <p className="mt-4 text-sm text-brand/80 leading-relaxed">
              Google OAuth has placeholder credentials. To facilitate local testing, we can log you in instantly with a mock account.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleMockGoogleLogin}
                className="w-full bg-brand text-black py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-brand/80 transition"
              >
                Use Mock Account
              </button>
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                className="w-full border border-brand/50 py-3.5 text-sm font-bold uppercase tracking-widest text-brand hover:border-brand transition"
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

function Checkbox({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: React.ReactNode }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <div className={`flex-shrink-0 mt-0.5 w-6 h-6 border flex items-center justify-center transition-colors ${checked ? 'border-black bg-black' : 'border-black bg-white group-hover:border-black'}`}>
        {checked && <Check className="h-4 w-4 text-white stroke-[3]" />}
      </div>
      <div className="text-[15px] leading-[1.6] text-black select-none">
        {label}
      </div>
    </label>
  );
}

function Button({ children, loading, disabled }: { children: React.ReactNode, loading?: boolean, disabled?: boolean }) {
  return (
    <button
      disabled={loading || disabled}
      type="submit"
      className="group flex w-full items-center justify-between bg-black text-white px-5 py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
    >
      <span>{loading ? "Please wait..." : children}</span>
      <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
