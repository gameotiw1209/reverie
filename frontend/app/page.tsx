
"use client";

import { useEffect, useState } from "react";
import GrassField from "../src/components/landing/grassfield";
import Navbar from "../src/components/landing/navbar";
import HeroSection from "../src/components/landing/herosection";
import SiteFooter from "../src/components/landing/footer";
import SignInForm from "../src/components/auth/signinForm";

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (!showSignIn) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSignIn(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showSignIn]);

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-[#131313] text-[#E5E2E1]">
      <div
        className={
          showSignIn
            ? "pointer-events-none relative flex min-h-dvh flex-col blur-[5px] transition-[filter] duration-300"
            : "relative flex min-h-dvh flex-col transition-[filter] duration-300"
        }
        aria-hidden={showSignIn}
      >
        <div className="absolute inset-0 z-0">
          <GrassField
            style={{
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
            }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.78) 34%, rgba(18,18,18,0.35) 58%, transparent 78%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(19,19,19,0.2) 0%, transparent 45%, rgba(19,19,19,0.2) 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <Navbar onGetStarted={() => setShowSignIn(true)} />
          <main className="flex flex-1 items-center">
            <HeroSection />
          </main>
          <SiteFooter />
        </div>
      </div>
      {showSignIn && (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8 backdrop-blur-[5px]"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setShowSignIn(false);
           }
          }}>
            <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-in-heading"
            className="relative my-auto w-full max-w-[450px]" >
            <SignInForm onClose={() => setShowSignIn(false)} />
             </div>
             </div>
            )}
            </div>
            );
}
