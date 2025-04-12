import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { buttonProps, UploadFile, UploadHooks, UploadRequestOptions } from 'element-plus';
import { ElMessage, ElUpload } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elUploadProps = ElUpload.props as Obj2Props<ComponentProps<typeof ElUpload>>;
const elUploadEmits = emits2obj(ElUpload.emits);

let fileId = 1000;
export const genFileId = () => Date.now() + ++fileId;
/** 组件传参 - 私有 */
export function uploadPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elUploadProps & ReturnType<typeof emits2props<null, [NonNullable<typeof ElUpload.emits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, UploadSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 重声明该字段并做优化, 内部处理 success 和 promise 结果只执行一次 */
        httpRequest: {
            type: Function as PropType<(option: UploadRequestOptions) => Promise<unknown> | XMLHttpRequest | void>,
        },
        beforeUpload: { type: Function as PropType<UploadHooks['beforeUpload']> },
        /** 上传按钮显示的文字 */
        buttonText: { type: String, default: '上传图片' },
        /** 上传按钮显示的文字 */
        buttonAttrs: { type: Object as PropType<Partial<ExtractPublicPropTypes<typeof buttonProps>>> },
        /** 上传文件的最大大小 */
        fileMaxSize: { type: Number },
        /** 超过限制的文件大小时的提示语 */
        fileMaxSizeToast: {
            type: Function as PropType<(file: File, size: number) => void>,
            default: (file: File, size: number) =>
                ElMessage.error(`上传文件(${file.name})大小不能超过${~~((size / 1024 / 1024) * 100) / 100}M`),
        },
        /** 上传相同文件时的提示语 */
        fileRepeatToast: {
            type: Function as PropType<(file: File) => void>,
            default: (file: File) => ElMessage.error(`不能重复上传文件(${file.name})`),
        },
        /** 是否开启覆盖上传 - 当 limit 为 1 时生效 */
        override: { type: Boolean as PropType<boolean> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            trigger: ((props: UploadSlotOption<T, Query, Option, OptionQuery>) => any);
            default: ((props: UploadSlotOption<T, Query, Option, OptionQuery>) => any);
            tip: ((props: UploadSlotOption<T, Query, Option, OptionQuery>) => any);
            file: ((props: UploadSlotOption<T, Query, Option, OptionQuery> & { file: UploadFile; index: number }) => any);
        }>> },
    } as const;
}
export interface UploadSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elUploadProps>>;
    getProps: () => UploadProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const uploadPropsPrivate = uploadPropsGeneric();
/** 组件传参 - 外部调用 */
export const uploadProps = emits2props({
    ...elUploadProps,
    ...uploadPropsPrivate,
});
export type UploadProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof uploadPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function uploadEmitsGeneric<T>() {
    return {
        // ...{} as typeof elUploadEmits,
    };
}
/** 组件事件 - 私有 */
export const uploadEmitsPrivate = uploadEmitsGeneric();
/** 组件事件 - 外部调用 */
export const uploadEmits = {
    ...uploadEmitsPrivate,
} as ReturnType<typeof uploadEmitsGeneric<any>>;
export type UploadEmits<T> = ReturnType<typeof uploadEmitsGeneric<T>>;

export interface UploadSlots extends CommonSlots<Record<string, any>> {
}
