"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
    return (
        <div className="relative w-full min-h-[600px] md:h-[650px] bg-cover bg-center overflow-hidden flex items-center">
            <Image
                src="/nurse-hero-banner.png"
                alt="Professional nursing healthcare professionals"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

            <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="max-w-2xl text-left">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-medium backdrop-blur-sm">
                            #1 Medical Resource Library
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Empowering <span className="text-accent">Veterinary</span> & <span className="text-blue-400">Medical</span> Professionals
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 font-light leading-relaxed max-w-xl">
                        Access the world's most comprehensive collection of evidence-based veterinary and medical eBooks. Instant download, anywhere, anytime.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-4 md:px-8 md:py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all"
                            onClick={() => document.querySelector("#categories")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            Browse Library
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/50 px-6 py-4 md:px-8 md:py-6 text-base md:text-lg backdrop-blur-md"
                            onClick={() => document.querySelector("#new-arrivals")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            View New Arrivals
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
