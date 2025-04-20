import process from 'node:process';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @file vue3 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === 'development' ? '/' : '/json-form/example-el-vue2',
    plugins: [
        createVuePlugin({
            jsx: true,
        }),
        UnoCSS({ hmrTopLevelAwait: false }),
        tsconfigPaths({ configNames: ['tsconfig.app.json'] }),
    ],
    define: {
        'process.env': { BABEL_TYPES_8_BREAKING: false },
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.runtime.esm.js',
            'vue-demi': 'vue-demi/lib/v2.7/index.mjs',
        },
    },
    preview: {
        open: true,
        port: 2021,
    },
    server: {
        port: 2001,
    },
});
