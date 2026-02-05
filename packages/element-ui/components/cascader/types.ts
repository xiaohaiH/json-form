/**
 * @file 级联选择器类型定义文件
 *
 * 包含级联选择器组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Cascader as ElCascader, Checkbox as ElCheckbox } from 'element-ui';
import type { CascaderNode } from 'element-ui/types/cascader.d';
import type { ElementUIComponent } from 'element-ui/types/component.d';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * 获取Element UI级联选择器属性定义
 */
const elCascaderProps = (ElCascader as any).props as ElObj2Props<ElCascader>;

/**
 * Element UI级联选择器事件定义
 */
const elCascaderEmits = {
    /** 选中值发生变化时触发 */
    change: (value: any) => true,
    /** 展开节点发生变化时触发 */
    expandChange: (value: any[]) => true,
    /** 失去焦点时触发 */
    blur: (ev: FocusEvent) => true,
    /** 获得焦点时触发 */
    focus: (ev: FocusEvent) => true,
    /** 下拉框出现/隐藏时触发 */
    visibleChange: (val: boolean) => true,
    /** 多选模式下移除标签时触发 */
    removeTag: (val: any) => true,
};

/**
 * 级联选择器属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的级联选择器
 * @returns 级联选择器属性配置对象
 */
export function cascaderPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCascaderProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCascaderEmits>]>>;
    return {
        // 继承Element UI级联选择器属性
        ...{} as _Prop,
        // 继承核心库的平台属性
        ...plainProps as PlainProps<Query, OptionQuery>,
        // 继承通用属性
        ...commonProps as CommonProps<_Prop, CascaderSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        // 继承表单项属性
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 是否可过滤，支持搜索级联选项 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除，显示清除按钮 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给级联选择器组件的插槽 */
        itemSlots: {
            type: Object as PropType<Partial<{
                /** 自定义备选项的内容，参数为 { node, data } */
                default: ComponentType<CascaderSlotOption<Query, OptionQuery> & { node: any; data: any }>;
                /** 无匹配选项时的内容 */
                empty: ComponentType<CascaderSlotOption<Query, OptionQuery>>;
                /** 自定义前缀图标 */
                prefix: ComponentType<CascaderSlotOption<Query, OptionQuery>>;
                /** 自定义建议项，参数为 { item } */
                suggestionItem: ComponentType<CascaderSlotOption<Query, OptionQuery> & { item: CascaderNode<any, any> }>;
            }>>,
            default: () => ({}),
        },
    } as const;
}

/**
 * 级联选择器插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 */
export interface CascaderSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 组件属性配置 - 私有 */
export const cascaderPropsPrivate = cascaderPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const cascaderProps = emits2props({
    ...elCascaderProps,
    ...cascaderPropsPrivate,
}, elCascaderEmits);

/**
 * 级联选择器属性类型
 * 提供类型推断支持
 */
export type CascaderProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof cascaderPropsGeneric<Query, OptionQuery>>>>;

/**
 * 级联选择器事件生成函数 - 通用版本
 *
 * @template T 选中值类型
 * @returns 级联选择器事件配置对象
 */
export function cascaderEmitsGeneric<T>() {
    return {
        ...{} as typeof elCascaderEmits,
    };
}

/** 组件事件配置 - 私有 */
export const cascaderEmitsPrivate = cascaderEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const cascaderEmits = {
    ...elCascaderEmits,
    ...cascaderEmitsPrivate,
};

/**
 * 级联选择器事件类型
 * 提供类型推断支持
 */
export type CascaderEmits<T> = ReturnType<typeof cascaderEmitsGeneric<T>>;

/**
 * 级联选择器插槽定义接口
 * 继承通用插槽定义
 */
export interface CascaderSlots extends CommonSlots<Record<string, any>> {
}
