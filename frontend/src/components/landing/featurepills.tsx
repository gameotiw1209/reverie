
import { LockKeyhole, Sparkles, PenLine } from "lucide-react";

const features = [
  { label: "Write freely", Icon: PenLine, color: "text-[#FFB781]" },
  { label: "Think together with AI", Icon: Sparkles, color: "text-[#FFB781]" },
  { label: "Private to your account", Icon: LockKeyhole, color: "text-[#AEC9EB]" },
];

export default function FeaturePills() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5">
      {features.map(({ label, Icon, color }) => (
        <div
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-[#FFF6E8]/90 backdrop-blur-sm transition hover:bg-white/[0.1]"
          style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
        >
          <Icon size={14} className={color} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
