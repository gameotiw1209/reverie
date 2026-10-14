
import GrassField from "../src/components/landing/grassfield";
import Navbar from "../src/components/landing/navbar";
import HeroSection from "../src/components/landing/herosection";
import SiteFooter from "../src/components/landing/footer";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-[#131313] text-[#E5E2E1]">
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
        <Navbar />

        <main className="flex flex-1 items-center">
          <HeroSection />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
