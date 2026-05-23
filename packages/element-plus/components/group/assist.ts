import { markRaw } from 'vue';
import {
    HAutocomplete,
    HCascader,
    HCheckbox,
    HCheckboxGroup,
    HColorPicker,
    HCustomRender,
    HDatePicker,
    HInput,
    HInputNumber,
    HInputOtp,
    HInputTag,
    HMention,
    HRadio,
    HRadioGroup,
    HRate,
    HSegmented,
    HSelect,
    HSelectV2,
    HSlider,
    HSwitch,
    HTimePicker,
    HTimeSelect,
    HTreeSelect,
    HUpload,
} from '../component-definition/components';

/* eslint-disable ts/no-unnecessary-type-assertion */
// 不重新 as 一下会发生👇下方的错误
// https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but
const compMap = {
    'autocomplete': markRaw(HAutocomplete) as typeof HAutocomplete,
    'cascader': markRaw(HCascader) as typeof HCascader,
    'checkbox': markRaw(HCheckbox) as typeof HCheckbox,
    'checkbox-group': markRaw(HCheckboxGroup) as typeof HCheckboxGroup,
    'color-picker': markRaw(HColorPicker) as typeof HColorPicker,
    'custom-render': markRaw(HCustomRender) as typeof HCustomRender,
    'date-picker': markRaw(HDatePicker) as typeof HDatePicker,
    'input': markRaw(HInput) as typeof HInput,
    'input-number': markRaw(HInputNumber) as typeof HInputNumber,
    'input-otp': markRaw(HInputOtp) as typeof HInputOtp,
    'input-tag': markRaw(HInputTag) as typeof HInputTag,
    'mention': markRaw(HMention) as typeof HMention,
    'radio': markRaw(HRadio) as typeof HRadio,
    'radio-group': markRaw(HRadioGroup) as typeof HRadioGroup,
    'rate': markRaw(HRate) as typeof HRate,
    'segmented': markRaw(HSegmented) as typeof HSegmented,
    'select': markRaw(HSelect) as typeof HSelect,
    'select-v2': markRaw(HSelectV2) as typeof HSelectV2,
    'slider': markRaw(HSlider) as typeof HSlider,
    'switch': markRaw(HSwitch) as typeof HSwitch,
    'time-picker': markRaw(HTimePicker) as typeof HTimePicker,
    'time-select': markRaw(HTimeSelect) as typeof HTimeSelect,
    'tree-select': markRaw(HTreeSelect) as typeof HTreeSelect,
    'upload': markRaw(HUpload) as typeof HUpload,
};
/* eslint-enable ts/no-unnecessary-type-assertion */
const userCompMap: Record<string, any> = {};

/** 默认定义组件的类型 */
export type ComponentTypeDef = (typeof compMap)[keyof typeof compMap];

/**
 * 注册自定义组件
 * @param {string} name 类型
 * @param {} comp 可渲染的组件
 */
export function registerComponent(name: string, comp: any) {
    userCompMap[name] = markRaw(comp);
}

/**
 * 删除自定义组件
 * @param {string} name 定义的类型
 */
export function unregisterComponent(name: string) {
    delete userCompMap[name];
}

/**
 * 获取指定组件
 * 根据组件类型名称获取对应的组件实例，优先从用户自定义组件中查找
 *
 * @param {string} name - 组件类型名称
 * @returns {ComponentTypeDef | null} - 返回指定的组件
 */
export function getComponent(name: string): ComponentTypeDef | null {
    return userCompMap[name] || compMap[name as keyof typeof compMap] || (console.warn('未找到该组件类型: ', name), null);
}

/**
 * 获取指定类型/所有组件
 *
 * @param {string} [type] 内置组件(builtIn)
 *
 * @returns {Record<string, ComponentTypeDef>} - 返回指定的组件或所有组件的映射表
 */
export function getAllComponent(type?: 'builtIn' | 'user'): Record<string, ComponentTypeDef> {
    if (!type) return { ...compMap, ...userCompMap };
    else return type === 'user' ? { ...userCompMap } : { ...compMap };
}
