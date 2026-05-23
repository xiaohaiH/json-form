import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import terser from '@rollup/plugin-terser';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'unplugin-dts/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import pkgJson from './package.json';

const external = ['vue', 'vant'];
const globals = { vue: 'Vue', vant: 'vant' };
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
export default defineConfig((env) => {
    return {
        define: {
            'process.env.NODE_ENV': env.command === 'build' ? JSON.stringify('production') : JSON.stringify('development'),
        },
        plugins: [
            vue(),
            vueJsx(),
            dts({
                tsconfigPath: './tsconfig.app.json',
                // insertTypesEntry: true,
                // rollupTypes: true,
                // 由于 vant3 比 vant4 多一个组件, 打包时会自动检索所有文件
                // 而处于高版本没法打包 vant3 的组件, 所以这里手动排除
                exclude: [
                    'components/component-definition/definition.ts',
                    'components/datetime-picker/index.vue',
                    'components/datetime-picker/index.ts',
                    'components/datetime-picker/types.ts',
                ],
            }),
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
            rolldownOptions: {
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
    } as UserConfig;
});
