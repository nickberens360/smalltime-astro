<template>
  <a :href="href" class="product-card-link">
    <div class="product-card">
      <div class="product-image">
        <img v-if="imageSrc" :src="imageSrc" :alt="title" />
      </div>
      <div class="product-content">
        <h3 class="product-title">{{ title }}</h3>
        <div v-if="description" class="product-description" v-html="description"></div>
        <p v-if="price" class="product-price">${{ price.toFixed(2) }}</p>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false, // Description is now optional
      default: ''
    },
    imageSrc: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: false,
      default: null
    }
  }
}
</script>

<style scoped>
.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.product-description :global(p) {
  margin: 0;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-top: auto;
}
</style>