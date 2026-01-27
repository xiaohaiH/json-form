import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import { registerComponent } from '../group/index';
import HDynamicGroup from './index.vue';
// 为防止循环依赖(dynamic-group -> group -> assist -> dynamic-group),
// 异步注册组件
registerComponent('dynamic-group', HDynamicGroup);

export { HDynamicGroup };
export type HDynamicGroupInstance = ComponentExposed<typeof HDynamicGroup>;
export * from './types';
