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
          @click="selectVariant(variant.id)"
        >
          <div class="variant-info">
            <span>{{ getOptionLabels(variant.options) }}</span>
            <span class="price">${{ (variant.price / 100).toFixed(2) }}</span>
          </div>
        </li>
      </ul>
    </div>

    <BuyButton
      :shopId="shopId"
      :productId="productId"
      :selectedVariantId="selectedVariantId"
    />

    <div class="tags" v-if="tags && tags.length">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </div>
</template>

<script>
import BuyButton from './BuyButton.vue';

export default {
  components: {
    BuyButton
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    // This prop is now correctly defined to receive the shopId
    shopId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      selectedVariantId: null,
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
    productId() {
      return this.product.id;
    }
  },
  created() {
    this.createOptionsMap();
    if (this.variants.length > 0) {
      this.selectedVariantId = this.variants[0].id;
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
    selectVariant(variantId) {
      this.selectedVariantId = variantId;
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
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.variant-item:hover {
  border-color: #ccc;
}
.variant-item.selected {
  border-color: #2563eb;
  box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
}
.price {
  font-weight: bold;
  font-size: 1.1rem;
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