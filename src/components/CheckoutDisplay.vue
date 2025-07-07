<template>
  <div class="checkout-container">
    <h1>Checkout</h1>

    <template v-if="isMounted">
      <div v-if="isLoading" class="loading-state">Loading...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="displayItems.length === 0" class="cart-empty">Your cart is empty.</div>

      <div v-else class="checkout-layout">
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div v-for="item in displayItems" :key="item.variant.id" class="product-card">
            <img :src="item.product.images[0].src" :alt="item.product.title" />
            <div class="product-info">
              <h3>{{ item.product.title }}</h3>
              <p>{{ getOptionLabels(item.variant.options, item.product.options) }}</p>
              <p>Quantity: {{ item.quantity }}</p>
            </div>
            <p class="price">${{ item.totalPrice.toFixed(2) }}</p>
          </div>
          <div class="total-summary">
            <strong>Total:</strong>
            <strong>${{ cartTotal.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="shipping-form">
          <h2>Shipping Information</h2>
          <p><em>(Placeholder for Stripe/PayPal and shipping form)</em></p>
          <form>
            <button type="submit" class="submit-button" disabled>
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </template>
    <div v-else class="loading-state"></div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { cartState, cartTotal } from '../stores/cart';

export default {
  setup() {
    const displayItems = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const isMounted = ref(false); // Flag to control client-side rendering

    const getOptionLabels = (options, productOptions) => {
      const map = new Map();
      productOptions.forEach(opt => {
        opt.values.forEach(val => { map.set(val.id, val.title); });
      });
      return options.map(id => map.get(id)).join(' / ');
    };

    // Use watchEffect to react to changes in the cart state
    watchEffect(async () => {
      // Only run the fetching logic if the component is mounted in the browser
      if (!isMounted.value) return;

      isLoading.value = true;
      error.value = null;

      const itemsInCart = cartState.items;
      if (itemsInCart.length === 0) {
        displayItems.value = [];
        isLoading.value = false;
        return;
      }

      try {
        const productsToFetch = new Map();
        itemsInCart.forEach(item => {
          if (!productsToFetch.has(item.productId)) {
            productsToFetch.set(item.productId, { shopId: item.shopId });
          }
        });

        const productPromises = Array.from(productsToFetch.keys()).map(productId => {
          const { shopId } = productsToFetch.get(productId);
          return fetch(`/api/product-details?shopId=${shopId}&productId=${productId}`).then(res => res.json());
        });

        const productResponses = await Promise.all(productPromises);
        const fetchedProductsMap = new Map();
        productResponses.forEach(res => {
          if (res.success) {
            fetchedProductsMap.set(res.product.id, res.product);
          }
        });

        displayItems.value = itemsInCart.map(item => {
          const product = fetchedProductsMap.get(item.productId);
          if (!product) return null;

          const variant = product.variants.find(v => v.id === item.variantId);
          if (!variant) return null;

          return {
            product,
            variant,
            quantity: item.quantity,
            totalPrice: (variant.price / 100) * item.quantity
          };
        }).filter(Boolean);

      } catch (e) {
        error.value = e.message;
      } finally {
        isLoading.value = false;
      }
    });

    return {
      displayItems,
      isLoading,
      error,
      getOptionLabels,
      cartTotal,
      isMounted
    };
  },
  // Set the flag to true once the component is mounted on the client
  mounted() {
    this.isMounted = true;
  }
};
</script>

<style scoped>
.checkout-container { max-width: 900px; margin: 2rem auto; padding: 0 2rem; }
.loading-state, .cart-empty { text-align: center; padding: 4rem; font-size: 1.2rem; color: #666; min-height: 300px; }
.checkout-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 768px) { .checkout-layout { grid-template-columns: 1fr 1fr; } }
.order-summary, .shipping-form { border: 1px solid var(--header-border); padding: 2rem; border-radius: 8px; }
.product-card { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--header-border); }
.product-card:last-of-type { border-bottom: none; margin-bottom: 0; }
.product-card img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
.product-info { flex-grow: 1; }
.product-info h3 { margin: 0; font-size: 1rem; }
.price { font-weight: bold; font-size: 1rem; text-align: right; }
.total-summary { display: flex; justify-content: space-between; font-size: 1.2rem; padding-top: 1rem; margin-top: 1rem; border-top: 2px solid var(--text-color); }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; }
.form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
.submit-button { width: 100%; padding: 1rem; background-color: var(--button-disabled-background); color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: not-allowed; }
.error-message { color: red; text-align: center; padding: 2rem; }
</style>