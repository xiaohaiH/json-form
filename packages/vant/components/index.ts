// 在 pnpm 中, 由于打包时引用的 @vue/shared 路径实际被解析为'.pnpm/@vue+shared@3.5.26/node_modules/@vue/shared'
// 导致无法生成声明文件, 因此需要单独引入 @vue/shared, 避免报错(不确定是否是 vant 导致的)
// 报错原因可参考下方链接
// https://blog.gitcode.com/8425e0ada8aa47b422a780f6e0b1ae0f.html
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#consulting-packagejson-dependencies-for-declaration-file-generation
import type {} from '@vue/shared';

export * from './component-definition/index';
export * from './share';
export * from './wrapper/index';
