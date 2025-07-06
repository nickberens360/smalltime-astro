<template>
  <div class="buy-button-container">
    <a :href="checkoutUrl" class="buy-button" :class="{ disabled: !selectedVariantId }">
      Buy Now
    </a>
  </div>
</template>

<script>
export default {
  props: {
    shopId: {
      type: [String, Number],
      required: true
    },
    productId: {
      type: [String, Number],
      required: true
    },
    selectedVariantId: {
      type: [String, Number, null],
      required: true
    }
  },
  computed: {
    checkoutUrl() {
      if (!this.selectedVariantId) {
        return '#'; // Prevent navigation if no variant is selected
      }
      // Construct the URL for the checkout page with all necessary info
      return `/checkout?shopId=${this.shopId}&productId=${this.productId}&variantId=${this.selectedVariantId}`;
    }
  }
};
</script>

<style scoped>
.buy-button {
  display: inline-block;
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  transition: background-color 0.2s;
}

.buy-button:hover {
  background-color: #1d4ed8;
}

.buy-button.disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  pointer-events: none;
}
</style>