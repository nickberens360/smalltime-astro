import type { APIRoute } from 'astro';
import { getPrintifyProduct } from '../../lib/printify';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    try {
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
            // Throw the error to be caught by the catch block
            throw new Error(result.error || 'Failed to get product details from Printify.');
        }
    } catch (e) {
        // Log the detailed error to your Netlify function logs
        console.error("Error in /api/product-details:", e);

        // Return a specific error message as a JSON response
        const error = e instanceof Error ? e.message : 'An unknown error occurred in the product details API.';
        return new Response(JSON.stringify({ success: false, error }), { status: 500 });
    }
};