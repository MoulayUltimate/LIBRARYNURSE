import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export const runtime = "edge";

const PAYPAL_API_BASE = process.env.NEXT_PUBLIC_PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

// Helper to get access token
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

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const { items, amount, email } = await req.json();

        if (!items || !amount) {
            return new NextResponse("Missing items or amount", { status: 400 });
        }

        // Ideally, recalculate amount from server-side product data to prevent tampering
        // For now, we will trust the amount passed but in production verify against DB

        let accessToken;
        try {
            accessToken = await getAccessToken();
        } catch (authError) {
            console.error("PayPal Auth Error:", authError);
            return NextResponse.json({ error: "PayPal Authentication Failed. Check server logs." }, { status: 401 });
        }

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: amount.toFixed(2),
                        },
                        description: "NursLibrary eBooks",
                    },
                ],
            }),
        });

        const order = await response.json();

        // Save pending order to D1
        const db = process.env.DB as any;
        if (db && order.id) {
            const orderId = crypto.randomUUID();
            const itemsJson = JSON.stringify(items);

            // Insert into Orders with paypal_order_id
            await db.prepare(
                "INSERT INTO Orders (id, paypal_order_id, customer_email, amount, status, items) VALUES (?, ?, ?, ?, 'pending', ?)"
            ).bind(orderId, order.id, email || null, amount, itemsJson).run();

            // Send Telegram Notification (Fire and forget, don't block)
            const message = `🚀 *New Checkout Started!*\n\n📧 *Email:* \`${email || "Unknown"}\`\n💰 *Amount:* $${amount.toFixed(2)}\n📦 *Items:* ${items.length}\n\n_Waiting for payment..._`

            // We await it here to ensure it sends before the Edge function typically terminates
            // (Standard fetch without waitUntil can be cancelled if response returns early)
            try {
                await sendTelegramMessage(message)
            } catch (err) {
                console.error("Telegram Error", err)
            }
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Error creating PayPal order:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message || String(error) },
            { status: 500 }
        );
    }
}
