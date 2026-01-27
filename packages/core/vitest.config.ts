import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

const alias = {
    'vue': resolve(fileURLToPath(new URL('./', import.meta.url)), './node_modules/vue/dist/vue.esm-bundler.js'),
    'vue-demi': resolve(fileURLToPath(new URL('./', import.meta.url)), './node_modules/vue-demi/lib/v3/index.mjs'),
};

export default defineConfig({
    plugins: [vue(), vueJsx()],
    test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        // alias,
    },
    // resolve: { alias },
});
