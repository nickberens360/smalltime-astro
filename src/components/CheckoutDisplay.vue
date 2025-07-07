<template>
  <div class="checkout-container">
    <h1>Checkout</h1>

    <div v-if="isLoading" class="loading-state">Loading...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="displayItems.length > 0" class="checkout-layout">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayItems: [],
      error: null,
      isLoading: true,
    };
  },
  computed: {
    cartTotal() {
      return this.displayItems.reduce((total, item) => total + item.totalPrice, 0);
    }
  },
  async mounted() {
    try {
      const params = new URLSearchParams(window.location.search);
      const cartItems = [];
      let i = 0;
      while (params.has(`variantId[${i}]`)) {
        cartItems.push({
          shopId: params.get(`shopId[${i}]`),
          productId: params.get(`productId[${i}]`),
          variantId: params.get(`variantId[${i}]`),
          quantity: parseInt(params.get(`quantity[${i}]`) || '1', 10),
        });
        i++;
      }

      if (cartItems.length === 0) {
        throw new Error("No items provided for checkout.");
      }

      // Fetch details for all products concurrently
      const productPromises = cartItems.map(item =>
        fetch(`/api/product-details?shopId=${item.shopId}&productId=${item.productId}`)
          .then(res => res.json())
      );

      const productResponses = await Promise.all(productPromises);

      this.displayItems = cartItems.map((item, index) => {
        const response = productResponses[index];
        if (!response.success) throw new Error(`Could not load details for item #${index + 1}`);

        const product = response.product;
        const variant = product.variants.find(v => v.id.toString() === item.variantId);
        if (!variant) throw new Error(`Could not find variant for item #${index + 1}`);

        return {
          product,
          variant,
          quantity: item.quantity,
          totalPrice: (variant.price / 100) * item.quantity,
        };
      });

    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    getOptionLabels(options, productOptions) {
      const map = new Map();
      productOptions.forEach(opt => {
        opt.values.forEach(val => { map.set(val.id, val.title); });
      });
      return options.map(id => map.get(id)).join(' / ');
    }
  }
};
</script>

<style scoped>
/* All the styles from the previous checkout page version go here */
.checkout-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 2rem;
}
.loading-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr 1fr;
  }
}
.order-summary, .shipping-form {
  border: 1px solid #eee;
  padding: 2rem;
  border-radius: 8px;
}
.product-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.product-card:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}
.product-card img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.product-info {
  flex-grow: 1;
}
.product-info h3 {
  margin: 0;
  font-size: 1rem;
}
.price {
  font-weight: bold;
  font-size: 1rem;
  text-align: right;
}
.total-summary {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 2px solid #333;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: not-allowed;
}
.error-message {
  color: red;
  text-align: center;
  padding: 2rem;
}
</style>