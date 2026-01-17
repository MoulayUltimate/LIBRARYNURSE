"use client"

import { MessageCircle, Zap, Star, Tag, Shield } from "lucide-react"

export function BenefitsTicker() {
  const benefits = [
    {
      icon: MessageCircle,
      title: "24/7 Support Always Be There for You",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
    },
    {
      icon: Star,
      title: "Largest Selection",
    },
    {
      icon: Tag,
      title: "Unbeatable Prices",
    },
    {
      icon: Shield,
      title: "Safe Payment With Any Bank",
    },
  ]

  return (
    <div className="w-full bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-y border-border py-4 overflow-hidden">
      <div className="flex gap-8 animate-scroll">
        {/* Show benefits twice for seamless loop */}
        {[...benefits, ...benefits].map((benefit, idx) => {
          const Icon = benefit.icon
          return (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap min-w-max px-4">
              <Icon className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-sm md:text-base font-medium text-foreground">{benefit.title}</span>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 16px));
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
