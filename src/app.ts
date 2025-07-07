import type { App } from 'vue';
import { createPinia } from 'pinia';

const pinia = createPinia();

export default (app: App) => {
    // This file's only responsibility is to install the Pinia plugin for every component.
    app.use(pinia);

    // DO NOT initialize the theme here, as that causes the hydration mismatch.
    // The theme will be initialized inside the component's mounted hook instead.
};