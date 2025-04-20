/**
 * 组件辅助工具
 *
 * 用于管理和注册表单组件，提供组件的映射、注册和获取功能。
 * 支持内置Element UI封装组件和用户自定义组件的管理。
 */
import { markRaw } from 'vue-demi';
import {
    HCascader,
    HCheckbox,
    HCheckboxGroup,
    HColorPicker,
    HCustomRender,
    HDatePicker,
    HInput,
    HInputNumber,
    HRadio,
    HRadioGroup,
    HRate,
    HSelect,
    HSlider,
    HSwitch,
    HTimePicker,
    HUpload,
} from '../components';

/* eslint-disable ts/no-unnecessary-type-assertion */
// 不重新 as 一下会发生👇下方的错误
// https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but
/**
 * 内置组件映射表
 * 所有框架预定义的表单组件集合，使用markRaw标记为不需要被Vue响应式系统追踪
 */
const compMap = {
    'select': markRaw(HSelect) as typeof HSelect,
    'input': markRaw(HInput) as typeof HInput,
    'date-picker': markRaw(HDatePicker) as typeof HDatePicker,
    'cascader': markRaw(HCascader) as typeof HCascader,
    'radio': markRaw(HRadio) as typeof HRadio,
    'radio-group': markRaw(HRadioGroup) as typeof HRadioGroup,
    'checkbox': markRaw(HCheckbox) as typeof HCheckbox,
    'checkbox-group': markRaw(HCheckboxGroup) as typeof HCheckboxGroup,
    'color-picker': markRaw(HColorPicker) as typeof HColorPicker,
    'custom-render': markRaw(HCustomRender) as typeof HCustomRender,
    'input-number': markRaw(HInputNumber) as typeof HInputNumber,
    'rate': markRaw(HRate) as typeof HRate,
    'slider': markRaw(HSlider) as typeof HSlider,
    'switch': markRaw(HSwitch) as typeof HSwitch,
    'time-picker': markRaw(HTimePicker) as typeof HTimePicker,
    'upload': markRaw(HUpload) as typeof HUpload,
};

/**
 * 用户自定义组件映射表
 * 存储通过registerComponent注册的自定义组件
 */
const userCompMap: Record<string, any> = {};

/**
 * 默认定义组件的类型
 * 表单组件的类型定义，用于类型检查和提示
 */
export type ComponentType = (typeof compMap)[keyof typeof compMap];

/**
 * 注册自定义组件
 * 将用户自定义组件添加到组件映射表中，可在表单中使用
 *
 * @param {string} name - 组件类型名称，用于在表单配置中引用该组件
 * @param {any} comp - 可渲染的Vue组件实例
 */
export function registerComponent(name: string, comp: any) {
    userCompMap[name] = markRaw(comp);
}

/**
 * 删除自定义组件
 * 从组件映射表中移除指定的自定义组件
 *
 * @param {string} name - 要删除的组件类型名称
 */
export function unregisterComponent(name: string) {
    delete userCompMap[name];
}

/**
 * 获取指定组件
 * 根据组件类型名称获取对应的组件实例，优先从用户自定义组件中查找
 *
 * @param {string} [name] - 可选的组件类型名称
 * @returns {ComponentType | undefined | Record<string, ComponentType>} - 返回指定的组件或所有组件的映射表
 */
export function getComponent(name: string): ComponentType | undefined;
export function getComponent(): Record<string, ComponentType>;
export function getComponent(name?: string) {
    return name ? userCompMap[name] || compMap[name as keyof typeof compMap] : { ...compMap, ...userCompMap };
}
