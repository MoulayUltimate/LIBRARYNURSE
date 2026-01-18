/**
 * Helper functions for Meta Pixel event tracking
 * Call these functions when users perform key actions
 */

declare global {
    interface Window {
        fbq?: (action: string, event: string, params?: Record<string, any>) => void
    }
}

/**
 * Track when user views a product
 */
export function trackViewContent(productId: string, productName: string, price: number) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
            value: price,
            currency: 'USD'
        })
    }
}

/**
 * Track when user adds item to cart
 */
export function trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
            content_ids: [productId],
            content_name: productName,
            content_type: 'product',
            value: price * quantity,
            currency: 'USD'
        })
    }
}

/**
 * Track when user initiates checkout
 */
export function trackInitiateCheckout(items: Array<{ id: string; price: number; quantity: number }>, totalValue: number) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
            content_ids: items.map(item => item.id),
            num_items: items.reduce((sum, item) => sum + item.quantity, 0),
            value: totalValue,
            currency: 'USD'
        })
    }
}

/**
 * Track successful purchase
 */
export function trackPurchase(orderId: string, items: Array<{ id: string; price: number; quantity: number }>, totalValue: number) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
            content_ids: items.map(item => item.id),
            content_type: 'product',
            value: totalValue,
            currency: 'USD',
            order_id: orderId
        })
    }
}

/**
 * Track when user starts searching
 */
export function trackSearch(searchQuery: string) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Search', {
            search_string: searchQuery
        })
    }
}
