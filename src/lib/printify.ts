// src/lib/printify.ts

// This function contains the logic we want to share.
export async function getPrintifyData() {
    try {
        const apiKey = import.meta.env.PRINTIFY_API_TOKEN;
        if (!apiKey) {
            throw new Error("Printify API token is not configured in .env file.");
        }

        const response = await fetch('https://api.printify.com/v1/shops.json', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            // Provide more context on fetch errors
            const errorText = await response.text();
            throw new Error(`Failed to fetch from Printify: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const data = await response.json();

        // Return a structured success object
        return {
            success: true,
            message: "Successfully connected to Printify API.",
            shops: data.length,
            firstShopName: data.length > 0 ? data[0].title : "No shops found",
            data: data // The full response
        };

    } catch (e: any) {
        // Return a structured error object
        return {
            success: false,
            error: e.message
        };
    }
}