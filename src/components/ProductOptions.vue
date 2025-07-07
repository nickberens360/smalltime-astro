<template>
  <div class="product-options">
    <div class="variants">
      <h3>Variants</h3>
      <ul>
        <li
          v-for="variant in variants"
          :key="variant.id"
          class="variant-item"
          :class="{ selected: variant.id === selectedVariantId }"
          @click="selectVariant(variant)"
        >
          <div class="variant-info">
            <span>{{ getOptionLabels(variant.options) }}</span>
            <span class="price">${{ (variant.price / 100).toFixed(2) }}</span>
          </div>
        </li>
      </ul>
    </div>

    <button @click="addToCart" class="add-to-cart-button" :disabled="!selectedVariant">
      Add to Cart
    </button>

    <div class="tags" v-if="tags && tags.length">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </div>
</template>

<script>
// Import the action directly
import { addItem } from '../stores/cart';

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    shopId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      selectedVariant: null,
      optionsMap: new Map()
    }
  },
  computed: {
    variants() {
      return this.product.variants.filter(v => v.is_enabled);
    },
    tags() {
      return this.product.tags;
    },
    selectedVariantId() {
      return this.selectedVariant ? this.selectedVariant.id : null;
    }
  },
  created() {
    this.createOptionsMap();
    if (this.variants.length > 0) {
      this.selectVariant(this.variants[0]);
    }
  },
  methods: {
    createOptionsMap() {
      this.product.options.forEach(option => {
        option.values.forEach(value => {
          this.optionsMap.set(value.id, {
            type: option.name,
            value: value.title
          });
        });
      });
    },
    getOptionLabels(optionIds) {
      return optionIds.map(id => {
        const option = this.optionsMap.get(id);
        return option ? option.value : '';
      }).join(' / ');
    },
    selectVariant(variant) {
      this.selectedVariant = variant;
    },
    addToCart() {
      if (!this.selectedVariant) return;
      // Call the imported addItem function
      addItem(this.product, this.selectedVariant);
    }
  }
};
</script>

<style scoped>
.variants ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}
.variant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--header-border); /* Themed */
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.variant-item:hover {
  border-color: #ccc;
}
.variant-item.selected {
  border-color: var(--button-primary-background); /* Themed */
  box-shadow: 0 0 5px var(--button-primary-background); /* Themed */
}
.price {
  font-weight: bold;
  font-size: 1.1rem;
}
.add-to-cart-button {
  display: inline-block;
  background-color: var(--button-primary-background); /* Themed */
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  transition: background-color 0.2s;
  width: 100%;
  cursor: pointer;
}
.add-to-cart-button:hover {
  background-color: var(--button-primary-hover-background); /* Themed */
}
.add-to-cart-button:disabled {
  background-color: var(--button-disabled-background); /* Themed */
  cursor: not-allowed;
}
.tags {
  margin-top: 1.5rem;
}
.tag {
  display: inline-block;
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}
</style>