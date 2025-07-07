import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      // Tell the Vue integration to use our app entrypoint.
      // This will install Pinia for every Vue component.
      appEntrypoint: '/src/app.ts'
    })
  ],
  output: 'server',
  adapter: netlify(),
});