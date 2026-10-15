
import Grassfield from "@/src/components/landing/grassfield";
import SignInForm from "@/src/components/auth/signinForm";

export default function SignInPage() {
  return (
    <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#131313] px-4 py-8">
      <div className="absolute inset-0 z-0">
        <Grassfield />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#131313]/35" />

      <div className="relative z-10 flex w-full items-center justify-center">
        <SignInForm />
      </div>
    </main>
  );
}
