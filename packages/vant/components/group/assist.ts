import { markRaw } from 'vue';
import {
    HArea,
    HCascader,
    HCheckbox,
    HCheckboxGroup,
    HCustomRender,
    HDatePicker,
    HDatetimePicker,
    HDateTimePickerGroup,
    HInput,
    HNumberKeyboard,
    HPasswordInput,
    HPicker,
    HRadio,
    HRadioGroup,
    HRate,
    HSignature,
    HSlider,
    HStepper,
    HSwitch,
    HTimePicker,
    HTreeSelect,
    HUpload,
} from '../component-definition/components';

/* eslint-disable ts/no-unnecessary-type-assertion */
const compMap = {
    'area': markRaw(HArea) as typeof HArea,
    'cascader': markRaw(HCascader) as typeof HCascader,
    'checkbox': markRaw(HCheckbox) as typeof HCheckbox,
    'checkbox-group': markRaw(HCheckboxGroup) as typeof HCheckboxGroup,
    'custom-render': markRaw(HCustomRender) as typeof HCustomRender,
    'datepicker': markRaw(HDatePicker) as typeof HDatePicker,
    'date-picker': markRaw(HDatePicker) as typeof HDatePicker,
    'date-time-picker-group': markRaw(HDateTimePickerGroup) as typeof HDateTimePickerGroup,
    'datetime-picker': markRaw(HDatetimePicker) as typeof HDatetimePicker,
    'input': markRaw(HInput) as typeof HInput,
    'number-keyboard': markRaw(HNumberKeyboard) as typeof HNumberKeyboard,
    'password-input': markRaw(HPasswordInput) as typeof HPasswordInput,
    'picker': markRaw(HPicker) as typeof HPicker,
    'select': markRaw(HPicker) as typeof HPicker,
    'radio': markRaw(HRadio) as typeof HRadio,
    'radio-group': markRaw(HRadioGroup) as typeof HRadioGroup,
    'rate': markRaw(HRate) as typeof HRate,
    'signature': markRaw(HSignature) as typeof HSignature,
    'slider': markRaw(HSlider) as typeof HSlider,
    'stepper': markRaw(HStepper) as typeof HStepper,
    'switch': markRaw(HSwitch) as typeof HSwitch,
    'time-picker': markRaw(HTimePicker) as typeof HTimePicker,
    'timepicker': markRaw(HTimePicker) as typeof HTimePicker,
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
