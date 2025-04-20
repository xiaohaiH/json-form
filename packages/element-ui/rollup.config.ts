import fs from 'node:fs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import vuePlugin from 'rollup-plugin-vue';
import { createVuePlugin as vue } from 'vite-plugin-vue2';

const external = ['vue', 'vue-demi', 'element-ui', 'core-condition'];
const globals = {
    'vue': 'Vue',
    // 'vue-composition-api': 'VueCompositionAPI',
    'vue-demi': 'VueDemi',
    'core-condition': 'CoreCondition',
    'element-ui': 'ELEMENT',
};

/** @type {import('rollup').RollupOptions[]} */
const options: RollupOptions[] = [
    // {
    //     input: './index.ts',
    //     plugins: [
    //         typescript(),
    //         // @ts-ignore
    //         vue({
    //             jsx: true,
    //         }),
    //         // vuePlugin({
    //         //     // target: 'browser',
    //         //     compilerOptions: {
    //         //         compatConfig: {
    //         //             COMPILER_V_ON_NATIVE: false,
    //         //             COMPILER_V_BIND_OBJECT_ORDER: false,
    //         //             MODE: 2,
    //         //         },
    //         //     },
    //         // }),
    //         // commonjs(),
    //         // resolve(),
    //         // babel({
    //         //     presets: ['@vue/babel-preset-jsx'],
    //         //     extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx', 'vue'],
    //         // }),
    //         // @ts-ignore
    //         // buble({ transforms: { forOf: false, asyncAwait: false } }),
    //     ],
    //     external,
    //     output: [
    //         { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
    //         {
    //             file: 'dist/index.esm.min.js',
    //             format: 'es',
    //             sourcemap: true,
    //             plugins: [terser({ format: { comments: false } })],
    //         },
    //         { file: 'dist/index.cjs.js', format: 'cjs', exports: 'named', sourcemap: true },
    //         {
    //             file: 'dist/index.cjs.min.js',
    //             format: 'cjs',
    //             exports: 'named',
    //             sourcemap: true,
    //             plugins: [terser({ format: { comments: false } })],
    //         },
    //         {
    //             file: 'dist/index.umd.js',
    //             format: 'umd',
    //             name: 'JSONForm',
    //             exports: 'named',
    //             sourcemap: true,
    //             globals: globals,
    //         },
    //         {
    //             file: 'dist/index.umd.min.js',
    //             format: 'umd',
    //             name: 'JSONForm',
    //             exports: 'named',
    //             sourcemap: true,
    //             globals: globals,
    //         },
    //     ],
    // },
    {
        input: 'index.ts',
        external: [/\.vue$/],
        plugins: [
            // typescript(),
            // // @ts-ignore
            // vue({
            //     jsx: true,
            // }),
            dts(),
        ],
        output: { file: 'dist/index.d.ts', format: 'es' },
    },
];

export default options;
