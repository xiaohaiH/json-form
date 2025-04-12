import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function customRenderPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    return {
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, CustomRenderSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 是否渲染 form-item @default true */
        renderFormItem: { type: Boolean as PropType<boolean>, default: true },
        /** 渲染节点 */
        render: {
            type: Function as PropType<(option: CustomRenderSlotOption<T, Query, Option, OptionQuery>) => () => any>,
            required: true,
        },
    } as const;
}
export interface CustomRenderSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => ExtractPublicPropTypes<FormItemProps<Query, Option>>;
    getProps: () => CustomRenderProps<T, Query, Option, OptionQuery>;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const customRenderPropsPrivate = customRenderPropsGeneric();
/** 组件传参 - 外部调用 */

export const customRenderProps = customRenderPropsPrivate;
export type CustomRenderProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof customRenderPropsGeneric<T, Query, Option, OptionQuery>>>;

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
