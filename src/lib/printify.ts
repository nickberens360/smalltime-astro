// src/lib/printify.ts

const API_KEY = import.meta.env.PRINTIFY_API_TOKEN;
const API_URL = 'https://api.printify.com/v1';

// getPrintifyData() remains the same...
export async function getPrintifyData() {
    try {
        if (!API_KEY) {
            throw new Error("Printify API token is not configured in .env file.");
        }
        const response = await fetch(`${API_URL}/shops.json`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch shops: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }
        const data = await response.json();
        return {
            success: true,
            message: "Successfully connected to Printify API.",
            shops: data.length,
            firstShopName: data.length > 0 ? data[0].title : "No shops found",
            data: data
        };
    } catch (e: any) {
        return { success: false, error: e.message, data: [] };
    }
}

// getPrintifyProduct() remains the same...
export async function getPrintifyProduct(shopId: string | number, productId: string) {
    try {
        if (!API_KEY) throw new Error("Printify API token is not configured.");
        if (!shopId || !productId) throw new Error("Shop ID and Product ID are required.");

        const response = await fetch(`${API_URL}/shops/${shopId}/products/${productId}.json`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch product ${productId}: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const data = await response.json();
        return { success: true, product: data };

    } catch (e: any) {
        return { success: false, error: e.message, product: null };
    }
}


/**
 * Fetches a paginated list of products for a specific shop.
 * @param shopId The ID of the shop to fetch products from.
 * @param page The page number to fetch.
 */
export async function getPrintifyProducts(shopId: string | number, page: number = 1) {
    try {
        if (!API_KEY) {
            throw new Error("Printify API token is not configured.");
        }
        if (!shopId) {
            throw new Error("A valid shopId is required to fetch products.");
        }

        // The Printify API uses a `page` query parameter for pagination
        const response = await fetch(`${API_URL}/shops/${shopId}/products.json?page=${page}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch products for shop ${shopId}: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const { data, current_page, last_page } = await response.json();
        return { success: true, products: data, currentPage: current_page, lastPage: last_page };

    } catch (e: any) {
        return { success: false, error: e.message, products: [], currentPage: 1, lastPage: 1 };
    }
}