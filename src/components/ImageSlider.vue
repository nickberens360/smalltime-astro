<template>
  <div class="image-slider" v-if="images && images.length">
    <div class="main-image-container">
      <img :src="currentImage.src" :alt="`Product image ${currentIndex + 1}`" class="main-image" />
      <button @click="prevImage" class="nav-button prev" v-if="images.length > 1">
        &#10094;
      </button>
      <button @click="nextImage" class="nav-button next" v-if="images.length > 1">
        &#10095;
      </button>
    </div>
    <div class="thumbnails" v-if="images.length > 1">
      <div
        v-for="(image, index) in images"
        :key="image.id"
        class="thumbnail"
        :class="{ active: index === currentIndex }"
        @click="setCurrentImage(index)"
      >
        <img :src="image.src" :alt="`Thumbnail ${index + 1}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || {};
    },
  },
  methods: {
    setCurrentImage(index) {
      this.currentIndex = index;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
  },
};
</script>

<style scoped>
.image-slider {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.main-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  user-select: none;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 1);
}

.nav-button.prev {
  left: 10px;
}

.nav-button.next {
  right: 10px;
}

.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.thumbnail {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.thumbnail:hover {
  border-color: #ddd;
}

.thumbnail.active {
  border-color: #2563eb;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>