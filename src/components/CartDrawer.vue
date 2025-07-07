<template>
  <div class="cart-container" :class="{ 'is-open': cartState.isDrawerOpen }">
    <div class="cart-overlay" @click="closeDrawer"></div>
    <div class="cart-drawer">
      <template v-if="isMounted">
        <div class="cart-header">
          <h2>Your Cart</h2>
          <button class="close-button" @click="closeDrawer">&times;</button>
        </div>
        <div v-if="cartState.items.length === 0" class="cart-empty">
          <p>Your cart is empty.</p>
        </div>
        <div v-else class="cart-content">
          <ul class="cart-items">
            <li v-for="item in cartState.items" :key="item.variantId" class="cart-item">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-details">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-options">{{ getOptionLabels(item) }}</p>
                <div class="item-quantity">
                  <p>Qty: {{ item.quantity }}</p>
                  <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
              <button @click="removeItem(item.variantId)" class="remove-item-button" title="Remove item">&times;</button>
            </li>
          </ul>
          <div class="cart-footer">
            <div class="cart-total">
              <span>Subtotal</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
            <a href="/checkout" class="checkout-button" :class="{ 'disabled': cartState.items.length === 0 }">
              Proceed to Checkout
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { cartState, cartTotal, closeDrawer, removeItem } from '../stores/cart';

export default {
  data() {
    return {
      isMounted: false,
    };
  },
  setup() {
    const optionsMaps = new Map();

    const getOptionLabels = (item) => {
      if (!optionsMaps.has(item.productId)) {
        const map = new Map();
        item.productOptions.forEach(opt => {
          opt.values.forEach(val => map.set(val.id, val.title));
        });
        optionsMaps.set(item.productId, map);
      }

      const map = optionsMaps.get(item.productId);
      return item.variantOptions.map(id => map.get(id)).join(' / ');
    };

    return {
      cartState,
      cartTotal,
      closeDrawer,
      removeItem,
      getOptionLabels,
    };
  },
  mounted() {
    this.isMounted = true;
  }
};
</script>

<style scoped>
.cart-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}
.cart-container.is-open {
  pointer-events: all;
}
.cart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.cart-container.is-open .cart-overlay {
  opacity: 1;
}
.cart-drawer {
  position: absolute;
  top: 0;
  right: 0; /* Changed from left to right for conventional cart placement */
  width: 90%;
  max-width: 400px;
  height: 100%;
  background-color: var(--card-background); /* Themed */
  color: var(--text-color); /* Themed */
  transform: translateX(100%); /* Changed for right-side drawer */
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}
.cart-container.is-open .cart-drawer {
  transform: translateX(0);
}
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--header-border); /* Themed */
}
.cart-header h2 {
  margin: 0;
}
.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-color); /* Themed */
}
.cart-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.cart-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--product-description-color); /* Themed */
}
.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--header-border); /* Themed */
}
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.item-details {
  flex-grow: 1;
}
.item-name {
  font-weight: bold;
  margin: 0 0 0.25rem;
}
.item-options {
  font-size: 0.8rem;
  color: var(--product-description-color); /* Themed */
  margin: 0;
}
.item-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.item-price {
  font-weight: bold;
}
.remove-item-button {
  background: var(--link-hover-background); /* Themed */
  color: var(--text-color); /* Themed */
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  cursor: pointer;
  line-height: 24px;
  padding: 0;
}
.cart-footer {
  margin-top: auto;
  border-top: 1px solid var(--header-border); /* Themed */
  padding-top: 1.5rem;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.checkout-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: var(--button-primary-background); /* Themed */
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}
.checkout-button:hover {
  background-color: var(--button-primary-hover-background); /* Themed */
}
.checkout-button.disabled {
  background-color: var(--button-disabled-background); /* Themed */
  cursor: not-allowed;
  pointer-events: none;
}
</style>