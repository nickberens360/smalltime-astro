import { toSlug } from "./utils";
// Import the list of shop IDs from our new config file
import { SHOPS_TO_INCLUDE } from '../config/shops.config';

const API_KEY = import.meta.env.PRINTIFY_API_TOKEN;
const API_URL = 'https://api.printify.com/v1';

let allDataCache = null;

export async function fetchAllPrintifyData() {
    if (allDataCache) {
        return allDataCache;
    }

    console.log("--- Starting Printify data fetch ---");

    const shopsResponse = await getPrintifyData();
    if (!shopsResponse.success) {
        console.error("Failed to fetch shops.");
        return { shops: [], productsByShop: new Map() };
    }

    // Filter the shops to only include those specified in the config file
    const allowedShops = shopsResponse.data.filter(shop => SHOPS_TO_INCLUDE.includes(shop.id));
    console.log(`Found ${allowedShops.length} allowed shops to process based on your config.`);

    const productsByShop = new Map();

    for (const shop of allowedShops) {
        let currentPage = 1;
        let lastPage = 1;
        const allProductsForShop = [];

        do {
            const productsResponse = await getPrintifyProducts(shop.id, currentPage);
            if (productsResponse.success) {
                allProductsForShop.push(...productsResponse.products);
                lastPage = productsResponse.lastPage;
            }
            currentPage++;
        } while (currentPage <= lastPage);

        productsByShop.set(shop.id, allProductsForShop);
        console.log(`Fetched ${allProductsForShop.length} products for shop: ${shop.title}`);
    }

    console.log("--- Printify data fetch complete ---");

    // The cache will now only contain data for the allowed shops
    allDataCache = { shops: allowedShops, productsByShop };
    return allDataCache;
}

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
            data: data
        };
    } catch (e: any) {
        return { success: false, error: e.message, data: [] };
    }
}

export async function getPrintifyProducts(shopId: string | number, page: number = 1) {
    try {
        if (!API_KEY) throw new Error("Printify API token is not configured.");
        if (!shopId) throw new Error("A valid shopId is required to fetch products.");

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