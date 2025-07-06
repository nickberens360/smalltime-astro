<template>
  <div class="checkout-container">
    <h1>Checkout</h1>

    <div v-if="isLoading" class="loading-state">Loading...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="product && variant" class="checkout-layout">
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="product-card">
          <img :src="product.images[0].src" :alt="product.title" />
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p>{{ getOptionLabels(variant.options, product.options) }}</p>
            <p class="price">${{ (variant.price / 100).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="shipping-form">
        <h2>Shipping Information</h2>
        <p><em>(Placeholder for Stripe/PayPal and shipping form)</em></p>
        <form>
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" disabled />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" name="address" disabled />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" disabled />
          </div>
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
      product: null,
      variant: null,
      error: null,
      isLoading: true,
    };
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const shopId = urlParams.get('shopId');
    const productId = urlParams.get('productId');
    const variantId = urlParams.get('variantId');

    if (!shopId || !productId || !variantId) {
      this.error = "Incomplete product information provided for checkout.";
      this.isLoading = false;
      return;
    }

    try {
      const response = await fetch(`/api/product-details?shopId=${shopId}&productId=${productId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not retrieve product details.");
      }

      this.product = result.product;
      this.variant = this.product.variants.find(v => v.id.toString() === variantId);

      if (!this.variant) {
        throw new Error("Selected variant could not be found for this product.");
      }

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
}
.product-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.product-info h3 {
  margin: 0;
}
.price {
  font-weight: bold;
  font-size: 1.2rem;
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