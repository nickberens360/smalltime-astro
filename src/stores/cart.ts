import { reactive, computed, watchEffect } from 'vue';

// --- Helper function to get initial state from localStorage ---
function getInitialState() {
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('smalltime-cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                parsedCart.isDrawerOpen = false;
                return parsedCart;
            } catch (e) {
                console.error("Could not parse saved cart state.", e);
            }
        }
    }
    return {
        items: [],
        isDrawerOpen: false,
    };
}

// --- The Reactive Store ---
export const cartState = reactive(getInitialState());

if (typeof window !== 'undefined') {
    watchEffect(() => {
        localStorage.setItem('smalltime-cart', JSON.stringify(cartState));
    });
}

// --- Getters (Computed Properties) ---
export const cartItemCount = computed(() => {
    return cartState.items.reduce((count, item) => count + item.quantity, 0);
});

export const cartTotal = computed(() => {
    return cartState.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});

// --- Actions (Functions that mutate state) ---
export function openDrawer() {
    cartState.isDrawerOpen = true;
}

export function closeDrawer() {
    cartState.isDrawerOpen = false;
}

export function addItem(product, variant, quantity = 1) {
    const existingItem = cartState.items.find(item => item.variantId === variant.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartState.items.push({
            productId: product.id,
            variantId: variant.id,
            shopId: product.shop_id,
            name: product.title,
            variantOptions: variant.options,
            productOptions: product.options,
            price: variant.price / 100,
            image: product.images.find(img => img.is_default)?.src || product.images[0]?.src,
            quantity,
        });
    }
    openDrawer();
}

export function removeItem(variantId) {
    cartState.items = cartState.items.filter(item => item.variantId !== variantId);
}

// This is the corrected function
export function getCheckoutUrl() {
    const params = new URLSearchParams();
    cartState.items.forEach((item, index) => {
        params.append(`shopId[${index}]`, item.shopId);
        params.append(`productId[${index}]`, item.productId);
        params.append(`variantId[${index}]`, item.variantId);
        params.append(`quantity[${index}]`, item.quantity);
    });
    return `/checkout?${params.toString()}`;
}