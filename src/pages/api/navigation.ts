import type { APIRoute } from 'astro';
import { fetchAllPrintifyData } from '../../lib/printify';
import { toSlug } from '../../lib/utils';

// This ensures the route is rendered on-demand
export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        // We use our cached data fetcher for efficiency
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
            // We only want to show shops that have tagged products to create sub-menus
            .filter(shop => shop.tags.length > 0);

        return new Response(JSON.stringify({ success: true, data: navigationData }), { status: 200 });

    } catch (e) {
        const error = e instanceof Error ? e.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ success: false, error }), { status: 500 });
    }
};