"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function AnalyticsTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Generate or retrieve a visitor ID
        let visitorId = localStorage.getItem("visitor_id")
        if (!visitorId) {
            visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
            localStorage.setItem("visitor_id", visitorId)
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
                        metadata: {
                            search: searchParams.toString(),
                            referrer: document.referrer,
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
