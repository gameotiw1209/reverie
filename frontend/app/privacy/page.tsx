import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "What Reverie is",
    paragraphs: [
      "Reverie is a quiet space to write your thoughts, and an AI right there to think through them with you. Whenever you need help putting an idea into words, working through something on your mind, or simply understanding yourself a little better, Reverie gives you a page to write on and a companion to talk it through with. This policy explains what that means for your privacy, in plain terms.",
    ],
  },
  {
    number: "02",
    title: "What we collect",
    paragraphs: [
      "To create your account, we ask for your name, email address, and a password. Your password is never stored directly, it’s transformed into a secure hash the moment you create it, so not even we ever see or store it in readable form.",
      "Beyond your account, we store what you write, your notes, and the conversations you have with Reverie’s companion about them. That’s the whole of it. We don’t collect anything beyond what’s needed to let you write, reflect, and come back to it later.",
    ],
  },
  {
    number: "03",
    title: "How your notes are stored",
    paragraphs: [
      "Your notes and conversations are encrypted in our database. In practical terms, this means that if our database were ever compromised, what sat inside it would be unreadable, not your actual words, but scrambled data with no meaning on its own.",
      "Our server holds the key needed to turn that back into your notes, but only uses it to show you your own writing, or to let the companion read a note you’ve chosen to discuss. We don’t read your notes for any other reason, and we never will.",
    ],
  },
  {
    number: "04",
    title: "How the companion works",
    paragraphs: [
      "When you open a conversation about a note, that note’s content and your messages are sent to the AI service that powers Reverie’s responses, so it can understand what you’re working through and respond to it thoughtfully.",
      "This only happens for the specific note you’re actively discussing, never your whole journal at once, and never without you starting that conversation yourself.",
    ],
  },
  {
    number: "05",
    title: "Who can see your data",
    paragraphs: [
      "Your notes and conversations belong to you alone. Every account on Reverie is kept completely separate from every other, there is no way for another person using Reverie to see, search, or access what you’ve written. Nothing you write is shared, published, or made visible to anyone else.",
    ],
  },
  {
    number: "06",
    title: "Staying signed in",
    paragraphs: [
      "When you sign in, we place a small, secure cookie in your browser that keeps you logged in, so you don’t have to sign in every time you come back to write. This cookie identifies your session, it doesn’t contain your notes or anything you’ve written.",
    ],
  },
  {
    number: "07",
    title: "Deleting your notes",
    paragraphs: [
      "When you delete a note, it’s removed, along with any conversation you had about it. Deletion is permanent, there’s no recovery once it’s gone, so we’d rather be upfront about that than promise something we can’t take back.",
    ],
  },
  {
    number: "08",
    title: "Changes to this policy",
    paragraphs: [
      "As Reverie grows, this policy may need to change with it. If anything meaningful changes in how your data is handled, we’ll update this page and note when it was last revised.",
    ],
  },
  {
    number: "09",
    title: "Questions",
    paragraphs: [
      "If anything here isn’t clear, or you’d simply like to ask, reach out to us directly at",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#121212_0%,#171413_35%,#221811_75%,#2A1D12_100%)] font-newsreader text-[#FFF6E8]/[0.86] antialiased selection:bg-amber-500/30 selection:text-amber-100">
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#121212]/80 px-6 py-5 backdrop-blur-sm sm:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            aria-label="Back to Reverie Sanctuary"
            className="group inline-flex items-center gap-2 transition-transform duration-200 active:scale-95"
          >
            <span className="font-serif text-2xl italic tracking-wide text-[#FFF6E8] transition-colors duration-200 group-hover:text-[#FD8C20]">
              Reverie
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FD8C20] shadow-[0_0_8px_#FD8C20]" />
          </Link>

          <div className="flex items-center gap-6 font-sans text-xs text-neutral-400 sm:text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-neutral-400 transition-colors duration-200 hover:text-[#FD8C20]"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Sanctuary</span>
            </Link>
            <span className="hidden h-3.5 w-px bg-white/10 sm:inline-block" />
            <span className="hidden font-normal text-neutral-500 sm:inline-block">
              <br />
            </span>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 px-6 py-14 sm:px-8 sm:py-20">
        <article className="mx-auto max-w-[700px]">
          <div className="mb-4 flex items-center gap-3 font-sans text-xs uppercase tracking-wide text-[#FD8C20]">
            <span className="inline-block rounded-full border border-[#FD8C20]/25 bg-[#FD8C20]/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wider">
              Privacy &amp; Trust
            </span>

          </div>

          <header className="mb-14">
            <h1 className="mb-4 text-5xl font-normal leading-[1.08] tracking-tight text-[#FFF6E8] sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="font-newsreader text-xl font-light italic leading-relaxed text-neutral-300 sm:text-2xl">
              How Reverie handles your notes, your conversations, and your
              account.
            </p>
          </header>

          {sections.map((section) => (
            <section
              key={section.number}
              className={`border-t border-white/[0.12] py-8 ${
                section.number === "09" ? "mb-12 border-b" : ""
              }`}
            >
              <div className="mb-3.5 flex items-baseline gap-3">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FD8C20]">
                  {section.number}
                </span>
                <h2 className="font-serif text-2xl font-normal tracking-normal text-[#FFF6E8] sm:text-3xl">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4 font-newsreader text-[17px] font-normal leading-[1.8] text-[#FFF6E8]/85">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                    {section.number === "09" && index === 0 && (
                      <>
                        {" "}
                        <a
                          href="mailto:omtiw1209@gmail.com"
                          className="font-medium text-[#FD8C20] underline-offset-4 transition-colors hover:underline"
                        >
                          omtiw1209@gmail.com
                        </a>
                        .
                      </>
                    )}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="mb-1 font-serif text-xl font-normal text-[#FFF6E8]">
                Ready to return to your thoughts?
              </h3>
              <p className="font-newsreader text-sm italic text-neutral-400">
                Your private journal sanctuary is open whenever you are.
              </p>
            </div>

            <Link
              href="/signin"
              className="shrink-0 rounded-full bg-[#FD8C20] px-5 py-2.5 font-sans text-xs font-medium tracking-wide text-neutral-950 shadow-[0_2px_12px_rgba(253,140,32,0.25)] transition-all hover:bg-[#e07b1a] hover:shadow-[0_4px_16px_rgba(253,140,32,0.4)] active:scale-95"
            >
              Open Journal
            </Link>
          </div>
        </article>
      </main>

      <footer className="mt-12 w-full border-t border-white/[0.07] px-6 py-8 sm:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 font-sans text-xs text-neutral-500 sm:flex-row">
          <div>
            <span>© 2026 Reverie. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="transition-colors hover:text-neutral-300">
              Return to Home
            </Link>
            <span className="h-1 w-1 rounded-full bg-neutral-700" />
            <span className="text-neutral-400">Built with ❤️ aum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}