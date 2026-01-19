"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Categorize referrer into traffic source
function categorizeReferrer(referrer: string): string {
    if (!referrer) return "direct"
    
    const lowerRef = referrer.toLowerCase()
    
    if (lowerRef.includes("facebook.com") || lowerRef.includes("fb.com") || lowerRef.includes("m.facebook.com")) {
        return "facebook"
    }
    if (lowerRef.includes("google.com") || lowerRef.includes("google.co")) {
        return "google"
    }
    if (lowerRef.includes("bing.com") || lowerRef.includes("yahoo.com") || lowerRef.includes("duckduckgo.com")) {
        return "organic"
    }
    if (lowerRef.includes("instagram.com") || lowerRef.includes("twitter.com") || lowerRef.includes("linkedin.com")) {
        return "social"
    }
    
    return "organic"
}

export function AnalyticsTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Don't track admin routes
        if (pathname?.startsWith("/admin")) {
            return
        }

        // Generate or retrieve a visitor ID
        let visitorId = localStorage.getItem("visitor_id")
        if (!visitorId) {
            visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
            localStorage.setItem("visitor_id", visitorId)
        }

        // Get or set referrer source (persist for session)
        let referrerSource = sessionStorage.getItem("referrer_source")
        const referrerUrl = document.referrer
        
        if (!referrerSource) {
            referrerSource = categorizeReferrer(referrerUrl)
            sessionStorage.setItem("referrer_source", referrerSource)
        }

        // Track the page view
        const trackPageView = async () => {
            try {
                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        visitorId,
                        eventType: "page_view",
                        referrerSource,
                        referrerUrl: referrerUrl || null,
                        metadata: {
                            search: searchParams.toString(),
                            userAgent: navigator.userAgent
                        }
                    }),
                })
            } catch (err) {
                // Ignore analytics errors to not disrupt UX
                console.error("Analytics failed", err)
            }
        }

        trackPageView()
    }, [pathname, searchParams])

    return null
}

// Utility function to track custom events
export async function trackEvent(eventType: string, metadata?: any) {
    // Don't track if on admin route
    if (window.location.pathname.startsWith("/admin")) {
        return
    }

    const visitorId = localStorage.getItem("visitor_id")
    if (!visitorId) return

    const referrerSource = sessionStorage.getItem("referrer_source") || "direct"

    try {
        await fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: window.location.pathname,
                visitorId,
                eventType,
                referrerSource,
                referrerUrl: null,
                metadata: metadata || {}
            }),
        })
    } catch (err) {
        console.error("Analytics event failed", err)
    }
}

