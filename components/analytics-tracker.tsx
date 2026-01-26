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

// Simple device detection
function getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown'
    const ua = navigator.userAgent.toLowerCase()
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet"
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile"
    }
    return "desktop"
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

        const deviceType = getDeviceType()

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
                        deviceType,
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
    if (typeof window !== 'undefined' && window.location.pathname.startsWith("/admin")) {
        return
    }

    // Facebook Pixel Tracking
    try {
        if (typeof window.fbq !== 'undefined') {
            if (eventType === 'purchase') {
                window.fbq('track', 'Purchase', {
                    value: metadata?.value || 0,
                    currency: metadata?.currency || 'USD',
                    transaction_id: metadata?.transaction_id
                })
            } else if (eventType === 'add_to_cart') {
                window.fbq('track', 'AddToCart', {
                    content_name: metadata?.productTitle,
                    content_ids: [metadata?.productId],
                    content_type: 'product',
                    value: metadata?.price,
                    currency: 'USD'
                })
            } else if (eventType === 'view_item') {
                window.fbq('track', 'ViewContent', {
                    content_name: metadata?.productTitle,
                    content_ids: [metadata?.productId],
                    content_category: 'books',
                    content_type: 'product',
                    value: metadata?.price,
                    currency: 'USD'
                })
            } else {
                // Track other custom events
                window.fbq('trackCustom', eventType, metadata)
            }
        }
    } catch (e) {
        console.error("FB Pixel Error", e)
    }

    const visitorId = localStorage.getItem("visitor_id")
    if (!visitorId) return

    const referrerSource = sessionStorage.getItem("referrer_source") || "direct"
    const deviceType = getDeviceType()

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
                deviceType,
                metadata: metadata || {}
            }),
        })
    } catch (err) {
        console.error("Analytics event failed", err)
    }
}
