import type { Obj2Props, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField } from 'vant';
import type { AsyncComponentOptions, Component, ComponentOptions, ComponentPublicInstance, DefineComponent, ExtractPropTypes, PropType, Raw, VNode } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';

export interface SlotQuery {
    /** 是否禁用 */
    disabled: boolean;
    /** 绑定的值 */
    modelValue: any;
    /** 内部设置的类名 */
    class: string;
    /** 组件内部信息 */
    extraOption: {
        /** 表单信息值 */
        query: Record<string, any>;
        /** 触发外部搜索事件 */
        search: () => void;
        /** 触发内部搜索事件 */
        insideSearch: () => void;
    };
    [index: string]: string | number | boolean | ((...args: any[]) => any) | Record<string, any> | any[];
}

const vantFieldProps = VanField.props as unknown as Obj2Props<ComponentProps<typeof VanField>>;
/** 公共属性 - 泛型 */
export function commonPropsGeneric<Query extends Record<string, any>, OptionQuery = Record<string, any>>() {
    return {
        /** field 组件属性 */
        ...{} as typeof vantFieldProps,
        /** 是否禁用 */
        disabled: { type: Boolean as PropType<boolean>, default: undefined },
        /** 是否只读 */
        readonly: { type: Boolean as PropType<boolean>, default: undefined },
        /** 是否隐藏表单项 */
        hide: { type: Boolean as PropType<boolean>, default: undefined },
        /** field 组件自身的插槽 */
        slots: { type: Object as PropType<CommonSlots> },
    } as const;
}
/** 公共属性 */
export const commonProps = commonPropsGeneric();
export type CommonProps<Query extends Record<string, any>, OptionQuery> = ReturnType<typeof commonPropsGeneric<Query, OptionQuery>>;

/** 通用插槽 */
export interface CommonSlots<T = Record<string, any>> {
    /** 自定义输入框左侧文本 */
    label?: ComponentType<CommonSlotsProps<any, any> & T>;
    /** 自定义输入框，使用此插槽后，与输入框相关的属性和事件将失效 */
    input?: ComponentType<CommonSlotsProps<any, any> & T>;
    /** 自定义输入框头部图标 */
    leftIcon?: ComponentType<CommonSlotsProps<any, any> & T>;
    /** 自定义输入框尾部图标 */
    rightIcon?: ComponentType<CommonSlotsProps<any, any> & T>;
    /** 自定义输入框尾部按钮 */
    button?: ComponentType<CommonSlotsProps<any, any> & T>;
    /** 自定义底部错误提示文案 */
    errorMessage?: ComponentType<{ message: string } & CommonSlotsProps<any, any> & T>;
    /** 自定义输入框最右侧的额外内容 */
    extra?: ComponentType<CommonSlotsProps<any, any> & T>;
}

/** 插槽通用参数 */
export interface CommonSlotsProps<Query extends Record<string, any>, Options extends Record<string, any>> {
    props: Record<string, any>;
    plain: ReturnType<typeof usePlain<Query, Options>>;
}

/** 支持的组件格式 */
export type ComponentType<Props = Record<string, any>, Context = any>
    = | DefineComponent | Raw<DefineComponent>
        | ((props: Props, ctx?: Context) => any)
        | ComponentOptions
        | ComponentPublicInstance
        | (() => Promise<Component | { default: Component }>)
        | AsyncComponentOptions
        | string | number
        | { [key: string]: any };
