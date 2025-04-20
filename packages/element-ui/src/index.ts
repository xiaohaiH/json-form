// 防止符号链接导致的报错
// https://github.com/microsoft/TypeScript/issues/42873
// https://juejin.cn/post/7282606413842415675
import { ref } from '@vue/composition-api';

export * from '../components/index';
export * from './assist';
export * as JSONFormTs from './interface';
export { provideKey, type ProvideValue } from '@xiaohaih/json-form-core';
