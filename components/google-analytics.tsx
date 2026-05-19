"use client"

import Script from "next/script"

// Single gtag.js loader for both Google Analytics (GA4) and Google Ads.
// Google requires only ONE gtag script per page; multiple `config` calls
// route events to each destination.
const GA4_ID = "G-9MBBSE1825"
const ADS_ID = "AW-18117687691"

export const GoogleAnalytics = () => {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA4_ID}');
            gtag('config', '${ADS_ID}');
          `,
                }}
            />
        </>
    )
}
