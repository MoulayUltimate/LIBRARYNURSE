"use client"

const benefits = [
  { icon: "📦", label: "Physical Book Shipped" },
  { icon: "📄", label: "Bonus Digital PDF" },
  { icon: "🚚", label: "$19.55 Flat US Shipping" },
  { icon: "🕓", label: "4–12 Day Delivery" },
  { icon: "↩️", label: "Free 30-Day Returns" },
  { icon: "🔒", label: "Secure Stripe Checkout" },
  { icon: "✅", label: "Verified Content" },
  { icon: "💬", label: "Real Human Support" },
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
