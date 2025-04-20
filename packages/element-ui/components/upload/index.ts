/**
 * 上传组件入口文件
 *
 * 导出HUpload组件及其相关类型定义
 * 提供封装后的Element UI Upload组件
 */
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import HUpload from './index.vue';

export { HUpload };
export type HUploadInstance = ComponentExposed<typeof HUpload>;
export * from './types';
