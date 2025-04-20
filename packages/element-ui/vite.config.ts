import { resolve } from 'node:path';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { createVuePlugin } from 'vite-plugin-vue2';
import pkgJson from './package.json';

const external = ['vue', 'vue-demi', 'element-ui'];
const globals = { 'vue': 'Vue', 'vue-demi': 'VueDemi', 'element-ui': 'ELEMENT' };
const pkg = pkgJson.publishConfig || pkgJson;

/**
 * 添加或删除名称中的 min
 * @param {string} name
 * @param {boolean} flag
 */
function retainMinSuffix(name: string, flag: boolean) {
    const _name = name.replace(/^dist\//, '').replace(/min/, '');
    return flag ? _name.replace(/(\.m?[j|t]s)$/, '.min$1') : _name;
}

/**
 * @file vite 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        createVuePlugin({
            jsx: true,
        }),
        dts({
            tsconfigPath: './tsconfig.app.json',
            // rollupTypes: true,
        }),
    ],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    build: {
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'JSONForm',
            fileName: 'index',
        },
        minify: true,
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            external,
            output: [
                { entryFileNames: retainMinSuffix(pkg.module, false), format: 'es' },
                {
                    entryFileNames: retainMinSuffix(pkg.module, true),
                    format: 'es',
                    // @ts-expect-error 兼容 rollup 插件
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.main, true),
                    format: 'cjs',
                    exports: 'named',
                    // @ts-expect-error 兼容 rollup 插件
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, false),
                    format: 'umd',
                    name: 'JSONForm',
                    globals,
                    // plugins: [terser({ compress: false })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, true),
                    format: 'umd',
                    name: 'JSONForm',
                    globals,
                    // @ts-expect-error 兼容 rollup 插件
                    plugins: [terser({ format: { comments: false } })],
                },
            ],
        },
    },
});
