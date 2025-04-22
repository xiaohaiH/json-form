import { resolve } from 'node:path';
import process from 'node:process';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @file vue2 环境配置
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
            // 由于 monorepo 依赖的工作空间包, 不显示设置版本会导致打包使用的版本发生错误
            'vue': resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
            'vue-demi': resolve(__dirname, './node_modules/@xiaohaih/json-form-el/node_modules/vue-demi/lib/v2.7/index.mjs'),
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
