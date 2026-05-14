"use client"

const benefits = [
  { icon: "💬", label: "24/7 Support" },
  { icon: "⚡", label: "Instant Delivery" },
  { icon: "⭐", label: "Largest Selection" },
  { icon: "🏷️", label: "Unbeatable Prices" },
  { icon: "🔒", label: "Secure Payment" },
  { icon: "📥", label: "Instant Download" },
  { icon: "✅", label: "Verified Content" },
  { icon: "🌍", label: "Global Community" },
]

export function BenefitsTicker() {
  return (
    <div className="w-full bg-white border-y border-[#bdc9c8] py-3.5 overflow-hidden">
      <div className="flex gap-10 animate-ticker">
        {[...benefits, ...benefits].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 whitespace-nowrap min-w-max px-3"
          >
            <span className="text-base">{item.icon}</span>
            <span
              className="text-sm font-medium text-[#3e4949]"
              style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
