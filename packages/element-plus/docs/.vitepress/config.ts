import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import {
    presetAttributify,
    presetIcons,
    presetUno,
    transformerDirectives,
} from 'unocss';
import UnoCSS from 'unocss/vite';
import { createContentLoader, defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress/theme';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async () => {
    const components = readdirSync(resolve(__dirname, '../options/components'))
        .map((v) => {
            if (v.slice(-3) !== '.md') return null;
            return { text: v.slice(0, -3), link: `/options/components/${v.slice(0, -3)}` };
        })
        .filter(Boolean) as DefaultTheme.SidebarItem[];

    // https://vitepress.dev/reference/site-config
    return defineConfig({
        title: 'json-form-plus',
        description: '基于 json 驱动的表单',
        lang: 'zh-CN',
        themeConfig: {
            // https://vitepress.dev/reference/default-theme-config
            nav: [
                { text: '首页', link: '/' },
                { text: '配置项', link: '/options/shares/share-props' },
                { text: '友情链接', link: '/friendly-links' },
                { text: '更新日志', link: 'https://github.com/xiaohaiH/json-form/blob/master/packages/element-plus/CHANGELOG.md' },
            ],
            sidebar: {
                '/options': [
                    {
                        text: '共享属性',
                        items: [
                            { text: '共享 props', link: '/options/shares/share-props' },
                            { text: '共享 slots', link: '/options/shares/share-slots' },
                        ],
                    },
                    {
                        text: '配置项',
                        items: components,
                    },
                ],
                // '/friendly-links': [],
            },
            socialLinks: [
                { icon: 'github', link: 'https://github.com/xiaohaiH/json-form/tree/master/packages/element-plus' },
            ],
        },
        vite: {
            server: { port: 2012 },
            plugins: [
                UnoCSS({
                    presets: [
                        presetUno(),
                        presetIcons({
                            extraProperties: {
                                'display': 'inline-block',
                                'vertical-align': 'middle',
                            },
                        }),
                        presetAttributify(),
                    ],
                    transformers: [transformerDirectives()],
                }),
            ],
        },
    });
};
