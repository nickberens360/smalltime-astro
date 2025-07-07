<template>
  <button @click="openDrawer" class="cart-indicator">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
    <span v-if="isMounted && cartItemCount > 0" class="item-count">{{ cartItemCount }}</span>
  </button>
</template>

<script>
import { cartItemCount, openDrawer } from '../stores/cart';

export default {
  data() {
    return {
      isMounted: false,
    };
  },
  setup() {
    return {
      cartItemCount,
      openDrawer
    };
  },
  mounted() {
    // This ensures that the component only renders its state-dependent parts on the client
    this.isMounted = true;
  }
};
</script>

<style scoped>
.cart-indicator {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}
.item-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(30%, -30%);
}
</style>