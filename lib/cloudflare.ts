/**
 * Helper to get Cloudflare bindings in edge runtime
 * For use with @cloudflare/next-on-pages
 */
export function getCloudflareContext() {
    try {
        // @ts-ignore - Cloudflare specific
        return process.env?.DB || null
    } catch {
        return null
    }
}
