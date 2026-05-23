import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { PopupProps, UploaderFileListItem } from 'vant';
import { Field as VanField, Uploader as VanUploader } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function uploadPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanUploader 组件的属性 */
        uploadProps: { type: Object as PropType<Partial<ComponentProps<typeof VanUploader>>> },
        /** VanUploader 组件的事件 - 兼容 vue2 版本 */
        uploadOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanUploader.emits>>>>>, default: () => ({}) },
        /** VanUploader 组件的插槽 */
        uploadSlots: { type: Object as PropType<{
            /** 自定义上传区域 */
            default?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义删除按钮 */
            previewDelete?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义覆盖在预览区域上方的内容 */
            previewCover?: ComponentType<{ item: UploaderFileListItem } & CommonSlotsProps<any, any>>;
        }> },
        /** 文件读取完毕后执行的回调 */
        afterRead: { type: Function as PropType<(file: FileInfo | FileInfo[], detail: UploadDetail, option: UploadOption) => void> },
        /** 文件上传方法 */
        uploadRequest: { type: Function as PropType<(option: UploadOption) => Promise<any> | void> },
        /** 上传中的提示 */
        uploadingMessage: { type: [String, Function] as PropType<string | ((fileInfo: FileInfo) => string)>, default: '上传中' },
        /** 失败的提示 */
        failedMessage: { type: [String, Function] as PropType<string | ((fileInfo: FileInfo, response: any) => string)> },
    } as const;
}
/** 组件传参 - 私有 */
export const uploadPropsPrivate = uploadPropsGeneric();
/** 组件传参 - 外部调用 */
export const uploadProps = {
    ...VanField.props as unknown as {},
    ...uploadPropsPrivate,
};
export type UploadProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof uploadPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function uploadEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const uploadEmitsPrivate = uploadEmitsGeneric();
/** 组件事件 - 外部调用 */
export const uploadEmits = {
    ...VanField.emits,
    ...uploadEmitsPrivate,
};

export type UploadEmits<T> = ReturnType<typeof uploadEmitsGeneric<T>>;

export interface UploadSlots extends CommonSlots<any> {
}

/** 上传文件信息 */
export interface FileInfo extends UploaderFileListItem {
    /** 服务器返回的信息 */
    response?: any;
}
/**  */
export interface UploadDetail {
    name: number | string;
    index: number;
}

/** 文件上传提供的参数 */
export interface UploadOption {
    /** 当前选中的第一个文件 */
    file: FileInfo;
    /** 多选时所有文件 */
    files: FileInfo[];
    /** 成功回调 */
    success: (file: FileInfo | FileInfo[], res: any) => void;
    /** 失败回调 */
    fail: (file: FileInfo | FileInfo[], res: any) => void;
}
