import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField, Signature as VanSignature } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function signaturePropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 是否渲染 VanField 组件 */
        renderField: { type: Boolean as PropType<boolean>, default: true },
        /** VanSignature 组件的属性 */
        signatureProps: { type: Object as PropType<Partial<ComponentProps<typeof VanSignature>>> },
        /** VanSignature 组件的事件 - 兼容 vue2 版本 */
        signatureOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanSignature.emits>>>>>, default: () => ({}) },
        /** VanSignature 组件的插槽 */
        signatureSlots: { type: Object as PropType<{
            /** 自定义提示文案 */
            tips?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
        /**
         * 是否在结束签名时触发一次提交事件
         * @tips 该属性需要 vant 版本大等于 4.8.6 才支持
         */
        submitAtEnd: { type: Boolean, default: true },
        /** 对提交的数据进行处理 - 与 format 配合使用 */
        valueFormat: { type: Function as PropType<(option: SubmitOption) => any | Promise<any>>, default: (v: SubmitOption) => v },
        /** 当需要作为图片回显时的处理函数 - 与 format 配合使用 */
        format: { type: Function as PropType<(option: unknown) => string>, default: signatureFormat },
    } as const;
}
/** 组件传参 - 私有 */
export const signaturePropsPrivate = signaturePropsGeneric();
/** 组件传参 - 外部调用 */
export const signatureProps = {
    ...VanField.props as unknown as {},
    ...signaturePropsPrivate,
};
export type SignatureProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof signaturePropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function signatureEmitsGeneric<T>() {
    return {
        /** 组件加载后触发 - 供可选渲染 VanField 使用 */
        load: (params: any) => true,
    };
}
/** 组件事件 - 私有 */
export const signatureEmitsPrivate = signatureEmitsGeneric();
/** 组件事件 - 外部调用 */
export const signatureEmits = {
    ...VanField.emits,
    ...signatureEmitsPrivate,
};

export type SignatureEmits<T> = ReturnType<typeof signatureEmitsGeneric<T>>;

export interface SignatureSlots extends CommonSlots<any> {
}

/** 提交时的参数 */
export interface SubmitOption {
    /** base64 */
    image: string;
    /**  */
    canvas: string;
}

/** 格式化回显图片时的参数 */
export function signatureFormat(option: SubmitOption | string | Blob) {
    if (!option) return '';
    if (typeof option === 'string') return option;
    if (option instanceof Blob) return URL.createObjectURL(option);
    return option.image;
}
