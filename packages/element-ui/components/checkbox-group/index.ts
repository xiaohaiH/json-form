/**
 * @file 复选框组组件导出文件
 *
 * 导出HCheckboxGroup组件及其相关类型定义
 * 提供封装后的Element UI CheckboxGroup组件，为JSON表单系统提供复选框组功能
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HCheckboxGroup from './index.vue';

// 导出HCheckboxGroup组件
export { HCheckboxGroup };
// 导出HCheckboxGroup组件实例类型，用于TypeScript类型推断和组件引用
export type HCheckboxGroupInstance = ComponentExposed<typeof HCheckboxGroup>;
// 导出类型定义文件中的所有内容
export * from './types';
