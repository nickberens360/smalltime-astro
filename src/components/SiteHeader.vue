<template>
  <header class="site-header">
    <div class="header-container">
      <a href="/" class="logo">
        <img :src="logoSrc" alt="Smalltime Logo" />
      </a>

      <nav class="main-nav desktop-only">
        <ul>
          <li
            v-for="shop in navigation"
            :key="shop.shopSlug"
            class="nav-item"
          >
            <a :href="`/category/${shop.shopSlug}`">{{ shop.shopName }}</a>
            <div v-if="shop.tags.length > 0" class="dropdown-menu">
              <ul>
                <li v-for="tag in shop.tags" :key="tag.tagSlug">
                  <a :href="`/category/${shop.shopSlug}/${tag.tagSlug}`">{{ tag.tagName }}</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <CartIndicator />
        <button @click="themeStore.toggleTheme" class="theme-toggle-button" aria-label="Toggle theme">
          🌓
        </button>
        <button @click="toggleMobileMenu" class="mobile-nav-toggle mobile-only" aria-label="Toggle navigation menu">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 6h18M3 18h18"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-if="isMobileMenuOpen" class="mobile-nav-menu">
        <nav>
          <ul>
            <li v-for="shop in navigation" :key="shop.shopSlug" class="mobile-nav-item">
              <div @click="toggleMobileSubmenu(shop.shopSlug)" class="mobile-nav-top-level">
                <span>{{ shop.shopName }}</span>
                <span class="submenu-arrow" :class="{ 'is-open': openMobileSubmenu === shop.shopSlug }">›</span>
              </div>
              <transition name="submenu-slide">
                <ul v-if="openMobileSubmenu === shop.shopSlug" class="mobile-submenu">
                  <li>
                    <a :href="`/category/${shop.shopSlug}`">All {{ shop.shopName }}</a>
                  </li>
                  <li v-for="tag in shop.tags" :key="tag.tagSlug">
                    <a :href="`/category/${shop.shopSlug}/${tag.tagSlug}`">{{ tag.tagName }}</a>
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script>
import { computed } from 'vue';
import CartIndicator from './CartIndicator.vue';
import { useThemeStore } from '../stores/theme';

export default {
  components: {
    CartIndicator
  },
  setup() {
    const themeStore = useThemeStore();

    const logoSrc = computed(() => {
      return themeStore.isDarkMode ? '/images/st-script-light.png' : '/images/st-script.png';
    });

    return {
      themeStore,
      logoSrc
    };
  },
  data() {
    return {
      navigation: [],
      openMobileSubmenu: null,
      isMobileMenuOpen: false,
    };
  },
  methods: {
    toggleMobileSubmenu(shopSlug) {
      this.openMobileSubmenu = this.openMobileSubmenu === shopSlug ? null : shopSlug;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    handleResize() {
      if (window.innerWidth > 768) {
        this.isMobileMenuOpen = false;
      }
    }
  },
  watch: {
    isMobileMenuOpen(newVal) {
      if (typeof window !== 'undefined' && window.document) {
        document.body.classList.toggle('no-scroll', newVal);
      }
    }
  },
  async mounted() {
    // Initialize the theme here, AFTER the component has mounted on the client.
    // This prevents a hydration mismatch between the server-rendered HTML
    // and the client-side Vue app.
    this.themeStore.initTheme();

    window.addEventListener('resize', this.handleResize);
    try {
      const response = await fetch('/api/navigation');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch navigation data');
      this.navigation = result.data;
    } catch (e) {
      console.error("Error fetching navigation:", e);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.body.classList.remove('no-scroll');
  }
};
</script>

<style scoped>
/* --- Base Header Styles (Updated with CSS Variables) --- */
.site-header {
  background-color: var(--header-background);
  border-bottom: 1px solid var(--header-border);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color 0.3s, border-color 0.3s;
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 64px;
}
.logo {
  display: flex;
  align-items: center;
  height: 40px;
  margin-right: auto;
}
.logo img {
  height: 100%;
  width: auto;
}

/* --- Desktop Nav (Updated with CSS Variables) --- */
.main-nav { display: none; }
@media (min-width: 768px) {
  .main-nav { display: flex; }
}
.main-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}
.nav-item { position: relative; }
.nav-item > a {
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: var(--link-color);
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;
  border-radius: 6px;
}
.nav-item > a:hover {
  color: var(--link-hover-color);
  background-color: var(--link-hover-background);
}
.dropdown-menu {
  position: absolute;
  top: 95%;
  left: 0;
  background-color: var(--card-background);
  border: 1px solid var(--header-border);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  padding: 0.5rem;
  min-width: 220px;
  opacity: 0;
  transform: translateY(10px);
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.3s, border-color 0.3s;
  z-index: 10;
}
.nav-item:hover .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}
.dropdown-menu ul { display: block; }
.dropdown-menu li a {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--link-color);
  border-radius: 4px;
  white-space: nowrap;
}
.dropdown-menu li a:hover {
  background-color: var(--link-hover-background);
  color: var(--link-hover-color);
}

/* --- Header Actions --- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--text-color)
}

.mobile-nav-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color)
}
@media (min-width: 768px) {
  .mobile-only { display: none; }
}

/* --- Mobile Menu Styles (Updated with CSS Variables) --- */
.mobile-nav-menu {
  position: fixed;
  top: 65px;
  left: 0;
  width: 100%;
  height: calc(100vh - 65px);
  background-color: var(--background-color);
  z-index: 99;
  padding: 0.5rem 0;
  box-sizing: border-box;
  overflow-y: auto;
  border-top: 1px solid var(--header-border);
  transition: background-color 0.3s, border-color 0.3s;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.mobile-nav-menu nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-item {
  /* No styles needed here now */
}

.mobile-nav-top-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  font-size: 1.125rem; /* 18px */
  font-weight: 500;
  color: var(--link-color);
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid var(--header-border);
  transition: background-color 0.2s;
}
.mobile-nav-top-level:hover {
  background-color: var(--link-hover-background);
}

.submenu-arrow {
  display: inline-block;
  transition: transform 0.3s ease, color 0.3s;
  font-size: 1.75rem; /* Larger for easier tapping */
  line-height: 1;
  color: #9ca3af;
}

.submenu-arrow.is-open {
  transform: rotate(90deg);
  color: var(--link-hover-color); /* Darken arrow when open */
}

/* Submenu animation */
.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition: all 0.4s ease-in-out;
  max-height: 600px; /* High value to allow for content */
  overflow: hidden;
}
.submenu-slide-enter-from,
.submenu-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-submenu {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  background-color: var(--card-background); /* White background to stand out from the gray */
  border-bottom: 1px solid var(--header-border);
}


.mobile-submenu li a {
  display: block;
  font-size: 1rem;
  color: var(--link-color);
  text-decoration: none;
  padding: 0.875rem 2.5rem; /* 14px 40px - for deep indent */
}

.mobile-submenu li a:hover {
  color: var(--link-hover-color);
  background-color: var(--link-hover-background);
}

/* Style for the 'All' link to make it stand out */
.mobile-submenu li:first-child a {
  color: var(--link-hover-color);
  font-weight: 500;
}
</style>