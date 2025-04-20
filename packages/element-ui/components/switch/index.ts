/**
 * 开关组件入口文件
 *
 * 导出HSwitch组件及其相关类型定义
 * 提供封装后的Element UI Switch组件
 * 该组件用于创建可切换的开关控件，常用于表示开/关两种状态
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HSwitch from './index.vue';

export { HSwitch };
export type HSwitchInstance = ComponentExposed<typeof HSwitch>;
export * from './types';
