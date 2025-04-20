/**
 * @file 自定义渲染组件导出文件
 *
 * 导出HCustomRender组件及其相关类型定义
 * 提供灵活的自定义渲染能力，允许在JSON表单系统中插入任意自定义内容
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HCustomRender from './index.vue';

// 导出HCustomRender组件
export { HCustomRender };
// 导出HCustomRender组件实例类型，用于TypeScript类型推断和组件引用
export type HCustomRenderInstance = ComponentExposed<typeof HCustomRender>;
// 导出类型定义文件中的所有内容
export * from './types';
