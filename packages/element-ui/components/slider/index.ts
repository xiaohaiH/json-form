/**
 * @file 滑块组件导出文件
 *
 * 导出HSlider组件及其相关类型定义
 * 提供封装后的Element UI Slider组件，为JSON表单系统提供滑块功能
 */

import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HSlider from './index.vue';

// 导出HSlider组件
export { HSlider };
// 导出HSlider组件实例类型，用于TypeScript类型推断和组件引用
export type HSliderInstance = ComponentExposed<typeof HSlider>;
// 导出类型定义文件中的所有内容
export * from './types';
