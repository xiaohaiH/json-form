import * as fs from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MagicString from 'magic-string';
import type { UserConfig } from 'tsdown';
import { defineConfig, mergeConfig } from 'tsdown';
import pkgJson from './package.json' with { type: 'json' };

const VUE_DEMI_IIFE = fs.readFileSync(resolve(fileURLToPath(new URL('./', import.meta.url)), './node_modules/vue-demi/lib/index.iife.js'), 'utf-8');

const pkg = pkgJson.publishConfig || pkgJson;

const shareOptions: UserConfig = {
    entry: ['./index.ts'],
    clean: true,
    outputOptions: {
        name: 'JSONFormCore',
        minify: true,
        globals: { 'vue': 'Vue', 'vue-demi': 'VueDemi' },
    },
    deps: { neverBundle: ['vue', 'vue-demi'] },
    tsconfig: './tsconfig.json',
};

export default defineConfig([
    mergeConfig({ ...shareOptions }, {
        format: ['esm'],
    }),
    mergeConfig({ ...shareOptions }, {
        format: ['cjs'],
    }),
    mergeConfig({ ...shareOptions }, {
        format: ['umd'],
        outputOptions: {
            plugins: [{
                name: 'inject-vue-demi',
                renderChunk(code) {
                    const s = new MagicString(code);
                    s.prepend(`${VUE_DEMI_IIFE};\n`);
                    return { code: s.toString(), map: s.generateMap({ hires: true }) };
                },
            }],
        },
    }),
    // mergeConfig({ ...shareOptions }, {
    //     outDir: 'dist/types',
    //     dts: { emitDtsOnly: true },
    // }),
]);
