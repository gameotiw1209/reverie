
import JournalCard from "./notecard";
import FeaturePills from "./featurepills";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="w-full px-5 pb-12 pt-28 md:px-12 md:pb-14 md:pt-28"
    >
      <div className="flex w-full max-w-xl flex-col items-start">
        <h1
          className="text-4xl font-normal leading-[1.15] tracking-tight text-[#E5E2E1] md:text-[56px] md:leading-[1.14]"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
        >
          A quieter space for your{" "}
          <span className="italic text-[#FFB781]">thoughts.</span>
        </h1>

        <p
          className="mt-3 mb-5 max-w-md text-sm font-light leading-relaxed text-[#DDC1AF]/90 sm:text-base sm:leading-[26px]"
          style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
        >
          Reverie is an AI-powered journaling application that helps you
          organise your notes and reflect on your thoughts through AI
          conversations.
        </p>

        <JournalCard />
        <FeaturePills />
      </div>
    </section>
  );
}
