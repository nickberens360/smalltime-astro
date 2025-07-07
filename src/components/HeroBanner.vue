<template>
  <div class="hero-banner" :style="{ backgroundColor }">
    <div class="hero-content">
      <div class="hero-image">
        <slot name="image">
          <img v-if="isMounted" :src="finalImageSrc" alt="Hero image" />
        </slot>
      </div>
<!--      <div class="hero-text">-->
<!--        <h1 v-if="title">{{ title }}</h1>-->
<!--        <p v-if="description">{{ description }}</p>-->
<!--        <button class="cta-button" v-if="buttonText">{{ buttonText }}</button>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
// Import additional helpers from Vue for the full Composition API approach
import { computed, ref, onMounted } from 'vue';
import { useThemeStore } from '../stores/theme';

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
      default: 'transparent',
    },
    imageSrc: {
      type: [String, Object],
      default: null
    }
  },
  setup(props) {
    const themeStore = useThemeStore();
    const isMounted = ref(false);

    const finalImageSrc = computed(() => {
      // If a specific image is provided, always use it
      if (props.imageSrc) {
        if (typeof props.imageSrc === 'object' && props.imageSrc.src) {
          return props.imageSrc.src;
        }
        return props.imageSrc;
      }
      // Otherwise, fall back to the theme-dependent logo
      return themeStore.isDarkMode ? '/images/st-script-light.png' : '/images/st-script.png';
    });

    // onMounted is the Composition API equivalent of the mounted() hook
    onMounted(() => {
      isMounted.value = true;
      // The theme is initialized only on the client, ensuring reactivity
      themeStore.initTheme();
    });

    // Expose all necessary values to the template
    return {
      finalImageSrc,
      isMounted,
    };
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