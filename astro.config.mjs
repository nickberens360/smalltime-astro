import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
// Re-import the netlify adapter
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  // Change output from 'static' to 'hybrid' to support both static pages and server routes
  output: 'hybrid',
  // Re-add the Netlify adapter
  adapter: netlify(),
});