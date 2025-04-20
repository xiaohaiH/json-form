/**
 * 选择器组件入口文件
 *
 * 导出HSelect组件及其相关类型定义
 * 提供封装后的Element UI Select组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HSelect from './index.vue';

export { HSelect };
export type HSelectInstance = ComponentExposed<typeof HSelect>;
export * from './types';
