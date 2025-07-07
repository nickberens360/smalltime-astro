import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkMode: true, // Changed to true to make dark mode the default
    }),
    actions: {
        /**
         * Initializes the theme based on localStorage or system preference.
         * This is safely called from component `mounted` hooks.
         */
        initTheme() {
            if (typeof window === 'undefined') return;

            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            // The default state is now dark, but localStorage or system preference can override it.
            const newTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            this.setTheme(newTheme);
        },
        /**
         * Sets the theme and updates the DOM and localStorage.
         * @param {'light' | 'dark'} theme
         */
        setTheme(theme: 'light' | 'dark') {
            this.isDarkMode = theme === 'dark';
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            }
        },
        /**
         * Toggles the theme between light and dark.
         */
        toggleTheme() {
            const newTheme = this.isDarkMode ? 'light' : 'dark';
            this.setTheme(newTheme);
        },
    },
});