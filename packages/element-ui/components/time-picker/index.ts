/**
 * @file 时间选择器组件导出文件
 *
 * 导出HTimePicker组件及其相关类型定义
 * 提供封装后的Element UI TimePicker组件，为JSON表单系统提供时间选择功能
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HTimePicker from './index.vue';

// 导出HTimePicker组件
export { HTimePicker };
// 导出HTimePicker组件实例类型，用于TypeScript类型推断和组件引用
export type HTimePickerInstance = ComponentExposed<typeof HTimePicker>;
// 导出类型定义文件中的所有内容
export * from './types';
