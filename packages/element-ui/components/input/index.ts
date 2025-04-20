/**
 * 输入框组件入口文件
 *
 * 导出HInput组件及其相关类型定义
 * 提供封装后的Element UI Input组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HInput from './index.vue';

export { HInput };
export type HInputInstance = ComponentExposed<typeof HInput>;
export * from './types';
