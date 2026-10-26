
export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto flex w-full flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-[#FFF6E8]/85 md:px-12">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>© 2026 Reverie. All rights reserved.</span>
        <span className="hidden opacity-40 sm:inline">•</span>
        <a
          href="/privacy"
          className="underline-offset-4 transition-colors hover:text-[#FFB781] hover:underline"
        >
          Privacy Policy
        </a>
      </div>

      <span className="transition-colors hover:text-[#FFB781]">
        built with ❤️ aum
      </span>
    </footer>
  );
}
