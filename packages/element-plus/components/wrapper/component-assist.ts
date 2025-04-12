import { markRaw } from 'vue';
import {
    HCascader,
    HCheckbox,
    HCheckboxGroup,
    HColorPicker,
    HCustomRender,
    HDatePicker,
    HInput,
    HInputNumber,
    HMention,
    HRadio,
    HRadioGroup,
    HRate,
    HSelect,
    HSelectV2,
    HSlider,
    HSwitch,
    HTimePicker,
    HTimeSelect,
    HTreeSelect,
    HUpload,
} from '../components';

/* eslint-disable ts/no-unnecessary-type-assertion */
// 不重新 as 一下会发生👇下方的错误
// https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but
const compMap = {
    'select': markRaw(HSelect) as typeof HSelect,
    'tree-select': markRaw(HTreeSelect) as typeof HTreeSelect,
    'input': markRaw(HInput) as typeof HInput,
    'date-picker': markRaw(HDatePicker) as typeof HDatePicker,
    'cascader': markRaw(HCascader) as typeof HCascader,
    'radio': markRaw(HRadio) as typeof HRadio,
    'radio-group': markRaw(HRadioGroup) as typeof HRadioGroup,
    'checkbox': markRaw(HCheckbox) as typeof HCheckbox,
    'checkbox-group': markRaw(HCheckboxGroup) as typeof HCheckboxGroup,
    'color-picker': markRaw(HColorPicker) as typeof HColorPicker,
    'input-number': markRaw(HInputNumber) as typeof HInputNumber,
    'rate': markRaw(HRate) as typeof HRate,
    'slider': markRaw(HSlider) as typeof HSlider,
    'switch': markRaw(HSwitch) as typeof HSwitch,
    'time-picker': markRaw(HTimePicker) as typeof HTimePicker,
    'time-select': markRaw(HTimeSelect) as typeof HTimeSelect,
    'upload': markRaw(HUpload) as typeof HUpload,
    'select-v2': markRaw(HSelectV2) as typeof HSelectV2,
    'mention': markRaw(HMention) as typeof HMention,
    'custom-render': markRaw(HCustomRender) as typeof HCustomRender,
};
/* eslint-enable ts/no-unnecessary-type-assertion */
const userCompMap: Record<string, any> = {};

/** 默认定义组件的类型 */
export type ComponentType = (typeof compMap)[keyof typeof compMap];

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
 * @param {string} [name] 组件类型
 */
export function getComponent(name: string): ComponentType | undefined;
export function getComponent(): Record<string, ComponentType>;
export function getComponent(name?: string) {
    return name ? userCompMap[name] || compMap[name as keyof typeof compMap] : { ...compMap, ...userCompMap };
}
