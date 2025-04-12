import process from 'node:process';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @file vue3 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === 'development' ? '/' : '/json-form/example-plus-vue3',
    plugins: [
        vue(),
        vueJsx(),
        UnoCSS({ hmrTopLevelAwait: false }),
        tsconfigPaths({ configNames: ['tsconfig.app.json'] }),
    ],
    define: {
        'process.env': { BABEL_TYPES_8_BREAKING: false },
    },
    // resolve: {
    //     alias: {
    //         vue: 'vue/dist/vue.esm-bundler.js',
    //     },
    // },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: `import { h } from 'vue';`,
    },
    preview: {
        open: true,
        port: 2020,
    },
    server: {
        port: 2000,
    },
});
