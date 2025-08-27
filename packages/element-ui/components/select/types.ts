/**
 * 选择器组件类型定义文件
 *
 * 定义选择器组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Select as ElSelect } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI选择器属性对象
 * 从Element UI Select组件中提取属性定义
 */
const elSelectProps = (ElSelect as any).props as ElObj2Props<ElSelect>;

/**
 * Element UI选择器事件对象
 * 定义选择器组件支持的原生事件
 */
const elSelectEmits = {
    change: (value: any) => true,
    visibleChange: (visible: boolean) => true,
    removeTag: (tagValue: any) => true,
    clear: () => true,
    blur: (event: FocusEvent) => true,
    focus: (event: FocusEvent) => true,
};

/**
 * 选择器属性生成函数 - 泛型版本
 * 生成选择器组件所需的所有属性定义
 *
 * @template T 选择器数据类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询类型
 * @returns 选择器属性定义对象
 */
export function selectPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSelectProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, SelectSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否将选项进行分组 */
        group: { type: Boolean as PropType<boolean>, default: undefined },
        /** 存在分组时的子级键 @default children */
        groupChildrenKey: { type: String as PropType<string>, default: 'children' },
        /** 展示的字段 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 是否将整个选项都作为值传递给 ElOption(相当于忽略 valueKey) */
        valueIsWhole: { type: Boolean as PropType<boolean>, default: undefined },
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 过滤方法 */
        filterMethod: { type: Function as unknown as PropType<(val: string, option: T) => boolean> },
        /** 选项禁用字段 */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            // default: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            /** 选择器头部内容 */
            prefix: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            /** 无选项时的内容 */
            empty: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 选择器插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface SelectSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性的方法 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取选择器组件属性的方法 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elSelectProps>>;
    /** 获取所有属性的方法 */
    getProps: () => SelectProps<T, Query, Option, OptionQuery>;
    /** 额外选项 */
    extra: {
        /** 当前绑定的值 */
        value: T;
        /** 可用选项列表 */
        options: Option[];
        /** 过滤值 */
        filterValue: string;
        /** 过滤方法 */
        filterMethod: ((val: string) => void) | undefined;
        /** 值变更处理函数 */
        onChange: (value: T) => void;
    };
    /** 组件扁平化数据对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 选择器组件内部使用的属性定义 */
export const selectPropsPrivate = selectPropsGeneric();

/**
 * 选择器组件对外暴露的属性定义
 * 将选择器属性和Element UI选择器属性合并
 */
export const selectProps = emits2props({
    ...elSelectProps,
    ...selectPropsPrivate,
});

/**
 * 选择器属性类型定义
 * 用于选择器组件属性的类型检查和提示
 */
export type SelectProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof selectPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 选择器事件生成函数 - 泛型版本
 * 生成选择器组件支持的所有事件定义
 *
 * @template T 选择器数据类型
 * @returns 选择器事件定义对象
 */
export function selectEmitsGeneric<T>() {
    return {
        // ...{} as typeof elSelectEmits,
    };
}

/** 选择器组件内部使用的事件定义 */
export const selectEmitsPrivate = selectEmitsGeneric();

/**
 * 选择器组件对外暴露的事件定义
 * 将选择器事件和Element UI选择器事件合并
 */
export const selectEmits = {
    change: (value: any) => true,
    visibleChange: (visible: boolean) => true,
    removeTag: (tagValue: any) => true,
    clear: () => true,
    blur: (event: FocusEvent) => true,
    focus: (event: FocusEvent) => true,
    ...selectEmitsPrivate,
};

/**
 * 选择器事件类型定义
 * 用于选择器组件事件的类型检查和提示
 */
export type SelectEmits<T> = ReturnType<typeof selectEmitsGeneric<T>>;

/**
 * 选择器插槽接口
 * 定义选择器组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface SelectSlots extends CommonSlots<Record<string, any>> {
    /** 下拉项插槽 */
    // option?: ((props: { item: any; disabled?: boolean; parent?: any }) => any);
}
