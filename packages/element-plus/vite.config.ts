import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import terser from '@rollup/plugin-terser';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkgJson from './package.json';

const external = ['vue', 'element-plus'];
const globals = { 'vue': 'Vue', 'element-plus': 'ElementPlus' };
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

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @file vite 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        dts({
            tsconfigPath: './tsconfig.app.json',
            // insertTypesEntry: true,
            // rollupTypes: true,
        }),
    ],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    // resolve: {
    //     alias: {
    //         'element-plus': fileURLToPath(new URL('./node_modules/element-plus/es/packages/element-plus', import.meta.url)),
    //     },
    // },
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
                    // @ts-expect-error 兼容 rollup 插件
                    plugins: [terser({ format: { comments: false } })],
                },
                { entryFileNames: retainMinSuffix(pkg.main, false), format: 'cjs', exports: 'named' },
                {
                    entryFileNames: retainMinSuffix(pkg.main, true),
                    format: 'cjs',
                    exports: 'named',
                    // @ts-expect-error 兼容 rollup 插件
                    plugins: [terser({ format: { comments: false } })],
                },
                { entryFileNames: retainMinSuffix(pkg.unpkg, false), format: 'umd', name: 'JSONForm', globals },
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
