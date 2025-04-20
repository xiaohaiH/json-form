/**
 * @file 单选框组组件导出文件
 *
 * 导出HRadioGroup组件及其相关类型定义
 * 提供封装后的Element UI RadioGroup组件，为JSON表单系统提供单选框组功能
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HRadioGroup from './index.vue';

// 导出HRadioGroup组件
export { HRadioGroup };
// 导出HRadioGroup组件实例类型，用于TypeScript类型推断和组件引用
export type HRadioGroupInstance = ComponentExposed<typeof HRadioGroup>;
// 导出类型定义文件中的所有内容
export * from './types';
