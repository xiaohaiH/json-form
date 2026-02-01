import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { buttonProps, UploadFile, UploadHooks, UploadRequestOptions, UploadUserFile } from 'element-plus';
import { ElMessage, ElUpload } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elUploadProps = ElUpload.props as Obj2Props<ComponentProps<typeof ElUpload>>;
const elUploadEmits = emits2obj(ElUpload.emits);

let fileId = 1000;
export const genFileId = () => Date.now() + ++fileId;
/** 组件传参 - 私有 */
export function uploadPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elUploadProps; // & ReturnType<typeof emits2props<null, [NonNullable<typeof ElUpload.emits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<_Prop, UploadSlotOption<Query, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 重声明该字段并做优化, 内部处理 success 和 promise 结果只执行一次 */
        httpRequest: {
            type: Function as PropType<(option: UploadRequestOptions) => Promise<unknown> | XMLHttpRequest | void>,
        },
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
        /**
         * 当 onExceed 未传, 且超过文件数量时进行的提示
         * @param files 超出的文件集合
         * @param override 是否覆盖上传
         */
        onExceedToast: {
            type: Function as PropType<(files: File[], override: boolean | undefined) => void>,
            default: (files: File[], override?: boolean) => ElMessage.error(override ? `文件数量超过限制, 已替换现有文件` : '上传失败, 文件数量超过限制'),
        },
        /** 自动上传文件 - 需要与 element-plus 保持一致 */
        autoUpload: elUploadProps.autoUpload,
        /** 是否开启覆盖上传 */
        override: { type: Boolean as PropType<boolean> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            trigger: ComponentType<UploadSlotOption<Query, OptionQuery>>;
            default: ComponentType<UploadSlotOption<Query, OptionQuery>>;
            tip: ComponentType<UploadSlotOption<Query, OptionQuery>>;
            file: ComponentType<UploadSlotOption<Query, OptionQuery> & { file: UploadFile; index: number }>;
        }>> },
    } as const;
}
export interface UploadSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
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
