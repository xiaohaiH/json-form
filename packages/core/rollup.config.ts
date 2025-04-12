import * as fs from 'node:fs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import MagicString from 'magic-string';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import pkgJson from './package.json';

const external = ['vue', 'vue-demi'];
const globals = { 'vue': 'Vue', 'vue-demi': 'VueDemi' };
const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8');
const injectVueDemi: Plugin = {
    name: 'inject-vue-demi',
    renderChunk(code) {
        // return `${VUE_DEMI_IIFE};\n${code}`;
        const s = new MagicString(code);
        s.prepend(`${VUE_DEMI_IIFE};\n`);
        return { code: s.toString(), map: s.generateMap({ hires: true }) };
    },
};
const pkg = pkgJson.publishConfig || pkgJson;

/**
 * 添加获删除名称中的 min
 * @param {string} name
 * @param {boolean} flag
 */
function retainMinSuffix(name: string, flag: boolean) {
    const _name = name.replace(/min/, '');
    return flag ? _name.replace(/(\.m?[j|t]s)$/, '.min$1') : _name;
}

/** @type {import('rollup').RollupOptions[]} */
const options: RollupOptions[] = [
    {
        input: 'index.ts',
        plugins: [
            commonjs(),
            resolve(),
            typescript({ tsconfig: './tsconfig.json' }),
            babel({
                babelHelpers: 'bundled',
                presets: [['@vue/babel-preset-jsx', { compositionAPI: 'vue-demi' }]],
                extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx'],
            })
        ],
        external,
        output: [
            { file: retainMinSuffix(pkg.module, false), format: 'es', sourcemap: true },
            {
                file: retainMinSuffix(pkg.module, true),
                format: 'es',
                sourcemap: true,
                plugins: [terser({ format: { comments: false } })],
            },
            {
                file: retainMinSuffix(pkg.main, false),
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
            },
            {
                file: retainMinSuffix(pkg.main, true),
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
                plugins: [terser({ format: { comments: false } })],
            },
            {
                file: retainMinSuffix(pkg.unpkg, false),
                format: 'umd',
                name: 'JSONFormCore',
                exports: 'named',
                sourcemap: true,
                globals,
                plugins: [injectVueDemi],
            },
            {
                file: retainMinSuffix(pkg.unpkg, true),
                format: 'umd',
                name: 'JSONFormCore',
                exports: 'named',
                sourcemap: true,
                globals,
                plugins: [injectVueDemi, terser({ format: { comments: false } })],
            },
        ],
    },
    {
        input: 'index.ts',
        plugins: [dts()],
        output: { file: pkg.types, format: 'es' },
    },
];

export default options;
