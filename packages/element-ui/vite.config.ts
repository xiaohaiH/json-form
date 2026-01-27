import { resolve } from 'node:path';
import terser from '@rollup/plugin-terser';
import type { PluginOption } from 'vite';
import { defineConfig, version } from 'vite';
import dts from 'vite-plugin-dts';
import ViteInspect from 'vite-plugin-inspect';
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
    return flag ? _name.replace(/\.(m?)[j|t]s$/, '.min.$1js') : _name.replace(/\.(m?)ts$/, '.$1js');
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
            aliasesExclude: ['vue-demi'],
            // rollupTypes: true,
        }),
        // ViteInspect({ build: true, outputDir: '.vite-inspect' }),
    ],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'JSONForm',
            fileName: 'index',
        },
        outDir: 'dist',
        sourcemap: true,
        minify: false,
        rollupOptions: {
            external,
            output: [
                { entryFileNames: retainMinSuffix(pkg.module, false), format: 'es' },
                {
                    entryFileNames: retainMinSuffix(pkg.module, true),
                    format: 'es',
                    plugins: [terser({ format: { comments: false } })],
                },
                { entryFileNames: retainMinSuffix(pkg.main, false), format: 'cjs', exports: 'named' },
                {
                    entryFileNames: retainMinSuffix(pkg.main, true),
                    format: 'cjs',
                    exports: 'named',
                    plugins: [terser({ format: { comments: false } })],
                },
                { entryFileNames: retainMinSuffix(pkg.unpkg, false), format: 'umd', name: 'JSONForm', globals },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, true),
                    format: 'umd',
                    name: 'JSONForm',
                    globals,
                    plugins: [terser({ format: { comments: false } })],
                },
            ],
        },
    },
});
