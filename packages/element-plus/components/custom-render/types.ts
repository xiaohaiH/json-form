import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function customRenderPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as Omit<CommonProps<{}, CustomRenderSlotOption<Query, OptionQuery>, Query, OptionQuery>, 'contentProps'>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 是否渲染 form-item @default true */
        renderFormItem: { type: Boolean as PropType<boolean>, default: true },
        /** 渲染节点 */
        render: {
            type: [Function, Object] as PropType<((option: CustomRenderSlotOption<Query, OptionQuery>) => () => any) | Record<string, any>>,
            required: true,
        },
    } as const;
}
export interface CustomRenderSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
    /** 获取表单项属性 */
    formItemProps: Record<string, any>;
}
/** 组件传参 - 私有 */
export const customRenderPropsPrivate = customRenderPropsGeneric();
/** 组件传参 - 外部调用 */

export const customRenderProps = customRenderPropsPrivate;
export type CustomRenderProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof customRenderPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function customRenderEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const customRenderEmitsPrivate = customRenderEmitsGeneric();
/** 组件事件 - 外部调用 */
export const customRenderEmits = customRenderEmitsPrivate;
export type CustomRenderEmits<T> = ReturnType<typeof customRenderEmitsGeneric<T>>;

// export interface CustomRenderSlots extends CommonSlots<Record<string, any>> {
// }
