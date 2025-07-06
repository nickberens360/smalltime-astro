<template>
  <div class="hero-banner" :style="{ backgroundColor }">
    <div class="hero-content">
      <div class="hero-image">
        <slot name="image">
          <img v-if="imageSrc" :src="imageSrc" alt="Hero image" />
        </slot>
      </div>
      <div class="hero-text">
        <h1 v-if="title">{{ title }}</h1>
        <p v-if="description">{{ description }}</p>
        <button class="cta-button" v-if="buttonText">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroBanner',
  props: {
    title: {
      type: String,
      required: false,
      default: undefined,
    },
    description: {
      type: String,
      required: false,
      default: undefined,
    },
    buttonText: {
      type: String,
      required: false,
      default: undefined,
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    imageSrc: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.hero-banner {
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-image {
  margin-bottom: 1rem;
  max-width: 100%;
}

.hero-image img {
  max-width: 100%;
}

.hero-text {
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: white;
  color: #3498db;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.cta-button:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}
</style>
