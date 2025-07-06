import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// The netlify adapter is no longer needed for a static site
// import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  // Change output from 'server' to 'static'
  output: 'static',
  // The adapter is removed
});