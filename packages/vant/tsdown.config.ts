import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';

export default defineConfig({
    entry: ['./src/index.ts'],
    clean: false,
    external: ['vue', /^vant/],
    tsconfig: './tsconfig.app.json',
    platform: 'browser',
    // plugins: [Vue({  })],
    dts: { vue: true, emitDtsOnly: true },
});
