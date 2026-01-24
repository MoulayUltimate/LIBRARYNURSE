import { NextResponse } from "next/server";

export const runtime = "edge";

const PAYPAL_API_BASE = process.env.NEXT_PUBLIC_PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

// Helper to get access token (Duplicated for now, can extract to lib/paypal.ts)
async function getAccessToken() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Missing PayPal credentials");
    }

    // Use btoa for Edge runtime compatibility instead of Buffer
    const auth = btoa(clientId + ":" + clientSecret);
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const data = await response.json();
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const { orderID } = await req.json();

        if (!orderID) {
            return new NextResponse("Missing orderID", { status: 400 });
        }

        const accessToken = await getAccessToken();

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const capturedData = await response.json();

        if (capturedData.status === "COMPLETED") {
            // Update Order in D1
            const db = process.env.DB as any;
            if (db) {
                const customerEmail = capturedData.payer?.email_address;

                await db.prepare(
                    "UPDATE Orders SET status = 'succeeded', customer_email = ?, updated_at = CURRENT_TIMESTAMP WHERE paypal_order_id = ?"
                ).bind(customerEmail, orderID).run();
            }
        }

        return NextResponse.json(capturedData);
    } catch (error: any) {
        console.error("Error capturing PayPal order:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message || String(error) },
            { status: 500 }
        );
    }
}
