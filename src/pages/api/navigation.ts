import type { APIRoute } from 'astro';
import { fetchAllPrintifyData } from '../../lib/printify';
import { toSlug } from '../../lib/utils';

// This is the key change:
// We tell Astro to run this at build time instead of on every request.
export const prerender = true;

export const GET: APIRoute = async () => {
    try {
        const { shops, productsByShop } = await fetchAllPrintifyData();

        const navigationData = shops.map(shop => {
            const products = productsByShop.get(shop.id) || [];
            const visibleProducts = products.filter(p => p.visible);

            const uniqueTags = new Set<string>();
            visibleProducts.forEach(product => {
                product.tags.forEach(tag => uniqueTags.add(tag));
            });

            return {
                shopName: shop.title,
                shopSlug: toSlug(shop.title),
                tags: Array.from(uniqueTags).map(tag => ({
                    tagName: tag,
                    tagSlug: toSlug(tag)
                }))
            };
        })
            .filter(shop => shop.tags.length > 0);

        return new Response(JSON.stringify({ success: true, data: navigationData }), { status: 200 });

    } catch (e) {
        // Log the detailed error to your Netlify function logs
        console.error("Error in /api/navigation:", e);

        // Return a specific error message as a JSON response
        const error = e instanceof Error ? e.message : 'An unknown error occurred in the navigation API.';
        return new Response(JSON.stringify({ success: false, error }), { status: 500 });
    }
};