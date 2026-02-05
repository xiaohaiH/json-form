/**
 * 上传组件类型定义文件
 *
 * 定义上传组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Button as ElButton } from 'element-ui';
import { Message as ElMessage, Upload as ElUpload } from 'element-ui';
import type { ElUploadInternalFileDetail as UploadFile, ElUploadInternalRawFile as UploadRawFile, HttpRequestOptions as UploadRequestOptions } from 'element-ui/types/upload.d';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI按钮属性类型
 * 用于上传组件内部的按钮配置
 */
type ButtonProps = ElObj2Props<ElButton>;

/**
 * Element UI上传属性对象
 * 从Element UI Upload组件中提取属性定义
 */
const elUploadProps = (ElUpload as any).props as ElObj2Props<ElUpload>;

/**
 * Element UI上传事件对象
 * 定义上传组件支持的原生事件
 */
const elUploadEmits = {
};

/**
 * 文件ID生成器, 用于生成唯一的文件标识符
 * 人有生老三千疾, 唯有相思不可医
 */
let fileId = 3000;
export const genFileId = () => Date.now() + ++fileId;

/**
 * 上传属性生成函数 - 泛型版本
 * 生成上传组件所需的所有属性定义
 *
 * @template T 上传数据类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询类型
 * @returns 上传属性定义对象
 */
export function uploadPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elUploadProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elUploadEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, UploadSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 重声明该字段并做优化, 内部处理 success 和 promise 结果只执行一次 */
        httpRequest: {
            type: Function as PropType<(option: UploadRequestOptions) => Promise<unknown> | XMLHttpRequest | void>,
        },
        /** 重写声明, 内部的值和声明不一致 */
        onExceed: { type: Function as PropType<(file: File[], fileList: UploadFile[]) => void> },
        /** 上传按钮显示的文字 */
        buttonText: { type: String, default: '上传图片' },
        /** 上传按钮属性配置 */
        buttonAttrs: { type: Object as PropType<Partial<ExtractPropTypes<ButtonProps>>> },
        /** 上传文件的最大大小(字节) */
        fileMaxSize: { type: Number },
        /**
         * 超过限制的文件大小时的提示语
         * @param file 上传的文件
         * @param size 限制的大小
         */
        fileMaxSizeToast: {
            type: Function as PropType<(file: File, size: number) => void>,
            default: (file: File, size: number) =>
                ElMessage.error(`上传文件(${file.name})大小不能超过${~~((size / 1024 / 1024) * 100) / 100}M`),
        },
        /**
         * 上传相同文件时的提示语
         * @param file 上传的文件
         */
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
            /** 自定义触发按钮 */
            trigger: ComponentType<UploadSlotOption<Query, OptionQuery>>;
            default: ComponentType<UploadSlotOption<Query, OptionQuery>>;
            /** 自定义提示说明 */
            tip: ComponentType<UploadSlotOption<Query, OptionQuery>>;
            // file: ComponentType<UploadSlotOption<Query, OptionQuery> & { file: UploadFile; index: number }>;
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 上传插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface UploadSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 上传组件内部使用的属性定义 */
export const uploadPropsPrivate = uploadPropsGeneric();

/**
 * 上传组件对外暴露的属性定义
 * 将上传属性和Element UI上传属性合并
 */
export const uploadProps = emits2props({
    ...elUploadProps,
    ...uploadPropsPrivate,
});

/**
 * 上传属性类型定义
 * 用于上传组件属性的类型检查和提示
 */
export type UploadProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof uploadPropsGeneric<Query, OptionQuery>>>>;

/**
 * 上传事件生成函数 - 泛型版本
 * 生成上传组件支持的所有事件定义
 *
 * @template T 上传数据类型
 * @returns 上传事件定义对象
 */
export function uploadEmitsGeneric<T>() {
    return {
        // ...{} as typeof elUploadEmits,
    };
}

/** 上传组件内部使用的事件定义 */
export const uploadEmitsPrivate = uploadEmitsGeneric();

/**
 * 上传组件对外暴露的事件定义
 * 将上传事件和Element UI上传事件合并
 */
export const uploadEmits = {
    ...uploadEmitsPrivate,
} as ReturnType<typeof uploadEmitsGeneric<any>>;

/**
 * 上传事件类型定义
 * 用于上传组件事件的类型检查和提示
 */
export type UploadEmits<T> = ReturnType<typeof uploadEmitsGeneric<T>>;

/**
 * 上传插槽接口
 * 定义上传组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface UploadSlots extends CommonSlots<Record<string, any>> {
}
