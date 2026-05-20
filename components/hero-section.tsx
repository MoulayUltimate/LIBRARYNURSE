"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[680px] overflow-hidden flex items-center">
      {/* Background image */}
      <Image
        src="/small-animal-banner.png"
        alt="Veterinary professional with a dog and cat in a clinic"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Gradient overlay — darker on the left for headline legibility, soft on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-16 py-20">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#008080]/80 backdrop-blur-sm text-[#e3fffe] border border-[#76d6d5]/40 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            #1 Clinical Reference Library
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-[52px] font-bold text-white mb-5 leading-tight drop-shadow-lg"
            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif", letterSpacing: "-0.02em" }}
          >
            Empowering{" "}
            <span className="text-[#76d6d5]">Veterinary</span>{" "}
            &amp;{" "}
            <span className="text-[#76d6d5]">Medical</span>{" "}
            Professionals
          </h1>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-xl"
            style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
          >
            Real, printed veterinary and medical reference books shipped to your door — with a complimentary digital PDF copy so you can start reading the day you order.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={() => document.querySelector("#categories")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 bg-[#008080] hover:brightness-110 text-[#e3fffe] font-semibold px-10 py-4 rounded-xl shadow-lg transition-all active:scale-95"
              style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
            >
              Browse Library
            </button>
            <button
              onClick={() => document.querySelector("#new-arrivals")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md font-semibold px-10 py-4 rounded-xl transition-all"
              style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
            >
              View New Arrivals
            </button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 text-white/75 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#76d6d5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Clinical Content
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#76d6d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Physical Book + Digital PDF
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#76d6d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              24/7 Support
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
