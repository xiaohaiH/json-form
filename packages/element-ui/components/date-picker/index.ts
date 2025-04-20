/**
 * 日期选择器组件入口文件
 *
 * 导出HDatePicker组件及其相关类型定义
 * 提供封装后的Element UI DatePicker组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HDatePicker from './index.vue';

export { HDatePicker };
export type HDatePickerInstance = ComponentExposed<typeof HDatePicker>;
export * from './types';
