/**
 * @file 级联选择器组``件导出文件
 *
 * 导出HCascader组件及其相关类型定义
 * 提供封装后的Element UI Cascader组件
 */
import type { ComponentExposed } from 'vue-component-type-helpers';
import HCascader from './index.vue';

export * from './types';
export { HCascader };
export type HCascaderInstance = ComponentExposed<typeof HCascader>;
