/**
 * 单选框组件入口文件
 *
 * 导出HRadio组件及其相关类型定义
 * 提供封装后的Element UI Radio组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HRadio from './index.vue';

export { HRadio };
export type HRadioInstance = ComponentExposed<typeof HRadio>;
export * from './types';
