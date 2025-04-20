/**
 * @file 数字输入框组件导出文件
 *
 * 导出HInputNumber组件及其相关类型定义
 * 提供封装后的Element UI InputNumber组件，为JSON表单系统提供数字输入功能
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HInputNumber from './index.vue';

// 导出HInputNumber组件
export { HInputNumber };
// 导出HInputNumber组件实例类型，用于TypeScript类型推断和组件引用
export type HInputNumberInstance = ComponentExposed<typeof HInputNumber>;
// 导出类型定义文件中的所有内容
export * from './types';
