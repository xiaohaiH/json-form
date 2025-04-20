/**
 * 评分组件入口文件
 *
 * 导出HRate组件及其相关类型定义
 * 提供封装后的Element UI Rate组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HRate from './index.vue';

export { HRate };
export type HRateInstance = ComponentExposed<typeof HRate>;
export * from './types';
