import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
// Re-import the netlify adapter
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  // Set the output to 'server' to enable server-side capabilities
  output: 'server',
  // Re-add the Netlify adapter to handle the deployment correctly
  adapter: netlify(),
});