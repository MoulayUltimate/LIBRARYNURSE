"use client"

import { Star } from "lucide-react"

const reviews = [
  {
    initials: "SH",
    name: "Sarah H.",
    role: "Veterinary Student",
    title: "Instant delivery, life saver!",
    text: "I needed this textbook for an exam tomorrow and the download was immediate. Super smooth process!",
  },
  {
    initials: "JM",
    name: "Dr. James Milton",
    role: "Veterinarian",
    title: "Excellent service",
    text: "Great selection of hard-to-find veterinary titles. The PDF quality is superior on my iPad.",
  },
  {
    initials: "EC",
    name: "Emily Chen",
    role: "Vet Nurse",
    title: "Smooth download experience",
    text: "The link worked instantly, no activation needed. Bookmarked for next semester!",
  },
  {
    initials: "MR",
    name: "Michael R.",
    role: "Verified Buyer",
    title: "Saved me so much money",
    text: "Textbooks are so expensive — this site is a godsend. Payment was secure and fast.",
  },
]

export function TrustReviews() {
  return (
    <section className="w-full bg-[#f2f4f6] py-20 border-t border-[#bdc9c8]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-[32px] font-semibold text-[#191c1e] mb-4"
            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
          >
            Trusted by Professionals
          </h2>
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <span className="text-sm font-bold text-green-600">Excellent</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="bg-[#00b67a] p-1 rounded-[2px]">
                  <Star size={13} className="text-white fill-white" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-[#6e7979]">4.9/5 based on 3,500+ verified reviews</p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-[#bdc9c8]/40 flex flex-col h-full"
              style={{ boxShadow: "0 4px 16px rgba(0, 128, 128, 0.05)" }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <h3
                className="font-semibold text-[#191c1e] text-sm mb-2"
                style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
              >
                {review.title}
              </h3>
              <p className="text-[#3e4949] text-sm leading-relaxed flex-grow italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 pt-4 border-t border-[#eceef0] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#008080] text-[#e3fffe] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#191c1e] flex items-center gap-1.5">
                    {review.name}
                    <span className="text-[10px] font-normal text-[#6e7979] bg-[#f2f4f6] px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </p>
                  <p className="text-xs text-[#6e7979]">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
