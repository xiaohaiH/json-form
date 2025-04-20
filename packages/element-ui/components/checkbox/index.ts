/**
 * 复选框组件入口文件
 *
 * 导出HCheckbox组件及其相关类型定义
 * 提供封装后的Element UI Checkbox组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HCheckbox from './index.vue';

export { HCheckbox };
export type HCheckboxInstance = ComponentExposed<typeof HCheckbox>;
export * from './types';
