"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { ArrowRight, AlertCircle, Eye, EyeOff, Lock, X,} from "lucide-react";

type SignInFormProps = {
  onClose?: () => void;
  onSwitchToSignUp?: () => void;
};

export default function SignInForm({ onClose, onSwitchToSignUp }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest<unknown>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      router.push("/home");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[450px] rounded-[24px] border border-white/10 bg-[#151310]/95 p-6 shadow-[0_0_45px_-5px_rgba(253,140,32,0.22),0_25px_50px_-12px_rgba(0,0,0,0.85)] sm:p-8">
      <button
        type="button"
        aria-label="Close sign in"
        onClick={handleClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#FD8C20]"
      >
        <X size={19} />
      </button>

      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-2.5 font-newsreader text-xl italic tracking-wide text-[#FFF5E1]/90">
          Reverie
        </div>

        <h1
          id="sign-in-heading"
          className="mb-1.5 font-newsreader text-[26px] font-normal leading-snug tracking-tight text-[#FFF5E1]"
        >
          Sign in to your account
        </h1>

        <p className="font-jakarta text-sm text-[#FFF5E1]/70">
        Welcome back! Pick up where you left off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email-input"
            className="block font-jakarta text-[11px] tracking-wider text-[#FFF5E1]/80"
          >
            Email
          </label>

          <input
            id="email-input"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            required
            className="w-full rounded-xl border border-white/15 bg-[#1e1c18] px-4 py-3 font-jakarta text-sm text-[#FFF5E1] outline-none transition-all duration-200 placeholder:text-[#FFF5E1]/30 focus:border-[#FD8C20] focus:ring-2 focus:ring-[#FD8C20]/25"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password-input"
            className="block font-jakarta text-[11px] tracking-wider text-[#FFF5E1]/80"
          >
            Password
          </label>

          <div className="flex items-center rounded-xl border border-white/15 bg-[#1e1c18] px-4 py-3 transition-all duration-200 focus-within:border-[#FD8C20] focus-within:ring-2 focus-within:ring-[#FD8C20]/25">
            <input
              id="password-input"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
              className="w-full border-0 bg-transparent p-0 pr-3 font-jakarta text-sm text-[#FFF5E1] outline-none placeholder:text-[#FFF5E1]/30 focus:ring-0"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="flex items-center justify-center text-white/50 transition-colors hover:text-white focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-1.5 pt-1 font-jakarta text-xs text-[#FFB4AB]"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFF5E1] px-6 py-3.5 font-jakarta text-sm font-medium text-[#121212] shadow-[0_4px_20px_rgba(253,140,32,0.3)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_4px_25px_rgba(253,140,32,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>

            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#121212]/25 border-t-[#121212]" />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </div>
      </form>

      <div className="mt-5 text-center font-jakarta text-xs text-[#FFF5E1]/90">
      Don't have an account?
      <button
    type="button"
    onClick={onSwitchToSignUp}
    className="ml-1 inline-block font-medium text-[#FD8C20] transition-colors hover:underline"
  >
    Sign up
  </button>
</div>

      <div className="mt-3.5 flex items-center justify-center gap-1.5 font-jakarta text-[11px] tracking-wide text-[#FFF5E1]/40">
        <Lock size={13} />
        Private to your account
      </div>
    </div>
  );
}
