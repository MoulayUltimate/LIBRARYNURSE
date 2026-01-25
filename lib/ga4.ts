import { type NextRequest } from 'next/server'

const GA_PROPERTY_ID = "521341043"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_ANALYTICS_URL = `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`

// Helper to array buffer
function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
    }
    return buf
}

// Base64 Url Encode
function base64Url(str: string) {
    return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string | null> {
    try {
        const header = {
            alg: "RS256",
            typ: "JWT",
        }

        const now = Math.floor(Date.now() / 1000)
        const claim = {
            iss: clientEmail,
            scope: "https://www.googleapis.com/auth/analytics.readonly",
            aud: GOOGLE_TOKEN_URL,
            exp: now + 3600,
            iat: now,
        }

        const encodedHeader = base64Url(JSON.stringify(header))
        const encodedClaim = base64Url(JSON.stringify(claim))
        const data = `${encodedHeader}.${encodedClaim}`

        // Clean private key
        const pemHeader = "-----BEGIN PRIVATE KEY-----"
        const pemFooter = "-----END PRIVATE KEY-----"
        const pemContents = privateKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "")
        const binaryKey = str2ab(atob(pemContents))

        const key = await crypto.subtle.importKey(
            "pkcs8",
            binaryKey,
            {
                name: "RSASSA-PKCS1-v1_5",
                hash: { name: "SHA-256" },
            },
            false,
            ["sign"]
        )

        const signature = await crypto.subtle.sign(
            "RSASSA-PKCS1-v1_5",
            key,
            str2ab(data)
        )

        const signedJwt = `${data}.${base64Url(String.fromCharCode(...new Uint8Array(signature)))}`

        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`,
        })

        const json = await response.json()
        if (json.error) {
            console.error("Token Exchange Error:", json)
            return null
        }
        return json.access_token
    } catch (error) {
        console.error("Error creating GA4 access token:", error)
        return null
    }
}

// Basic stats fetcher
export async function getGA4Report(
    dateRanges: { startDate: string; endDate: string }[],
    dimensions: { name: string }[] = [],
    metrics: { name: string }[] = [],
    limit = 10
) {
    const clientEmail = process.env.GA_CLIENT_EMAIL
    const privateKey = process.env.GA_PRIVATE_KEY

    // In dev mode/without keys, return fallback for UI testing if needed
    // But better to return null so UI knows it's disconnected
    if (!clientEmail || !privateKey) return null

    const accessToken = await getAccessToken(clientEmail, privateKey)
    if (!accessToken) return null

    try {
        const response = await fetch(GOOGLE_ANALYTICS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dateRanges,
                dimensions,
                metrics,
                limit
            }),
        })

        if (!response.ok) {
            console.error("GA4 Error", await response.text())
            return null
        }

        return await response.json()
    } catch (e) {
        console.error("GA4 Network Error", e)
        return null
    }
}
