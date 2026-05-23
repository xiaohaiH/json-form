import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField, Slider as VanSlider } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function sliderPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanSlider 组件的属性 */
        sliderProps: { type: Object as PropType<Partial<ComponentProps<typeof VanSlider>>> },
        /** VanSlider 组件的事件 - 兼容 vue2 版本 */
        sliderOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanSlider.emits>>>>>, default: () => ({}) },
        /** VanSlider 组件的插槽 */
        sliderSlots: { type: Object as PropType<{
            /** 自定义滑块按钮 */
            button?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义左侧滑块按钮(双滑块模式下) */
            leftButton?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义右侧滑块按钮(双滑块模式下) */
            rightButton?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const sliderPropsPrivate = sliderPropsGeneric();
/** 组件传参 - 外部调用 */
export const sliderProps = {
    ...VanField.props as unknown as {},
    ...sliderPropsPrivate,
};
export type SliderProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof sliderPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function sliderEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const sliderEmitsPrivate = sliderEmitsGeneric();
/** 组件事件 - 外部调用 */
export const sliderEmits = {
    ...VanField.emits,
    ...sliderEmitsPrivate,
};

export type SliderEmits<T> = ReturnType<typeof sliderEmitsGeneric<T>>;

export interface SliderSlots extends CommonSlots<any> {
}
