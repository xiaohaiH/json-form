/**
 * @file 颜色选择器组件导出文件
 *
 * 导出HColorPicker组件及其相关类型定义
 * 提供封装后的Element UI ColorPicker组件，为JSON表单系统提供颜色选择功能
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HColorPicker from './index.vue';

// 导出HColorPicker组件
export { HColorPicker };
// 导出HColorPicker组件实例类型，用于TypeScript类型推断和组件引用
export type HColorPickerInstance = ComponentExposed<typeof HColorPicker>;
// 导出类型定义文件中的所有内容
export * from './types';
