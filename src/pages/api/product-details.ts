import type { APIRoute } from 'astro';
import { getPrintifyProduct } from '../../lib/printify';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const shopId = url.searchParams.get('shopId');
    const productId = url.searchParams.get('productId');

    if (!shopId || !productId) {
        return new Response(JSON.stringify({ error: 'shopId and productId are required' }), { status: 400 });
    }

    const result = await getPrintifyProduct(shopId, productId);

    if (result.success) {
        return new Response(JSON.stringify(result), { status: 200 });
    } else {
        return new Response(JSON.stringify(result), { status: 500 });
    }
};