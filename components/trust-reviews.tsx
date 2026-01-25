"use client"

import { Star, CheckCircle } from "lucide-react"

export function TrustReviews() {
    const reviews = [
        {
            name: "Sarah M.",
            role: "Veterinary Student",
            rating: 5,
            title: "Instant delivery, life saver!",
            text: "I needed this textbook for an exam tomorrow and the download was immediate. Super smooth process.",
            date: "2 days ago"
        },
        {
            name: "Dr. James Wilson",
            role: "Veterinarian",
            rating: 5,
            title: "Excellent service",
            text: "Great selection of hard-to-find veterinary titles. The PDF quality is perfect on my iPad.",
            date: "1 week ago"
        },
        {
            name: "Emily Chen",
            role: "Vet Nurse",
            rating: 5,
            title: "Smooth download experience",
            text: "Was a bit skeptical at first but the download link arrived instantly. Bookmarked for next semester!",
            date: "3 weeks ago"
        },
        {
            name: "Michael R.",
            role: "Verified Buyer",
            rating: 5,
            title: "Saved me so much money",
            text: "Textbooks are so expensive, this site is a goldmine. Payment was secure and easy.",
            date: "1 month ago"
        }
    ]

    return (
        <section className="bg-slate-50 py-16 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Professionals</h2>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                            ExamplePilot <Star size={12} fill="currentColor" />
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} className="bg-green-500 p-1 rounded-sm">
                                    <Star size={16} className="text-white fill-white" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Rated 4.9/5 based on 1200+ reviews</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col h-full">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-green-500 p-0.5 rounded-[1px]">
                                        <Star size={12} className="text-white fill-white" />
                                    </div>
                                ))}
                            </div>
                            <h3 className="font-bold text-foreground text-sm mb-2">{review.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed">"{review.text}"</p>
                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <p className="font-bold text-sm text-foreground flex items-center gap-2">
                                    {review.name}
                                    <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle size={10} className="text-green-600" />
                                        Verified
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{review.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
