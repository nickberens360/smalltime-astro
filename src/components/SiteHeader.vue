<template>
  <header class="site-header">
    <div class="header-container">
      <a href="/" class="logo">
        <img src="/images/st-script.png" alt="Smalltime Logo" />
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
import CartIndicator from './CartIndicator.vue';

export default {
  components: {
    CartIndicator
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
        if (newVal) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
      }
    }
  },
  async mounted() {
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
/* --- Base Header Styles (Unchanged) --- */
.site-header {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
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

/* --- Desktop Nav (Unchanged) --- */
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
  color: #374151;
  font-weight: 500;
  transition: color 0.2s;
  border-radius: 6px;
}
.nav-item > a:hover {
  color: #111827;
  background-color: #f3f4f6;
}
.dropdown-menu {
  position: absolute;
  top: 95%;
  left: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  padding: 0.5rem;
  min-width: 220px;
  opacity: 0;
  transform: translateY(10px);
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease;
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
  color: #374151;
  border-radius: 4px;
  white-space: nowrap;
}
.dropdown-menu li a:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* --- Header Actions (Unchanged) --- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.mobile-nav-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 768px) {
  .mobile-only { display: none; }
}

/* --- NEW / UPDATED Mobile Menu Styles --- */
.mobile-nav-menu {
  position: fixed;
  top: 65px;
  left: 0;
  width: 100%;
  height: calc(100vh - 65px);
  background-color: #f9fafb; /* Lighter background for the whole menu */
  z-index: 99;
  padding: 0.5rem 0; /* Vertical padding */
  box-sizing: border-box;
  overflow-y: auto;
  border-top: 1px solid #e5e7eb;
}

/* Main mobile menu container transition */
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
  color: #1f2937;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}
.mobile-nav-top-level:hover {
  background-color: #f3f4f6;
}

.submenu-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 1.75rem; /* Larger for easier tapping */
  line-height: 1;
  color: #9ca3af;
}

.submenu-arrow.is-open {
  transform: rotate(90deg);
  color: #1f2937; /* Darken arrow when open */
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
  background-color: #fff; /* White background to stand out from the gray */
  border-bottom: 1px solid #e5e7eb;
}

.mobile-submenu li a {
  display: block;
  font-size: 1rem;
  color: #374151;
  text-decoration: none;
  padding: 0.875rem 2.5rem; /* 14px 40px - for deep indent */
}

.mobile-submenu li a:hover {
  color: #111827;
  background-color: #f3f4f6;
}

/* Style for the 'All' link to make it stand out */
.mobile-submenu li:first-child a {
  color: #111827;
  font-weight: 500;
}
</style>