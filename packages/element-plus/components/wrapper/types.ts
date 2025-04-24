import type { CamelCase, WrapperProps as CoreWrapperProps, Obj2Props, useWrapper } from '@xiaohaih/json-form-core';
import { wrapperProps as coreWrapperProps, emits2obj, emits2props } from '@xiaohaih/json-form-core';
import { ElForm, ElMessage } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { defineOption } from '../../src/assist';

const elFormProps = ElForm.props as Obj2Props<ComponentProps<typeof ElForm>>;
const elFormEmits = emits2obj(ElForm.emits);

/** 由于 formPropsGeneric 需要重载, 所以需要一个辅助函数 */
function formAssist() {
    type _Prop = typeof elFormProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elFormEmits>]>> & {
        class: { type: PropType<string | Record<string, any> | any[]> };
        style: { type: PropType<string | Record<string, any> | any[]> };
    };
    return {
        ...{} as Omit<_Prop, 'model'>,
        ...coreWrapperProps,
        // /** 是否启用排序 */
        // sortable: { type: Boolean as PropType<boolean> },
        /** 初始是否触发一次事件来返回当前的 query */
        immediateSearch: { type: Boolean as PropType<boolean> },
        /** 是否渲染搜索重置按钮 */
        renderBtn: { type: Boolean as PropType<boolean>, default: true },
        /** 重置时触发搜索事件 */
        triggerSearchAtReset: { type: Boolean as PropType<boolean> },
        /** 搜索按钮文字 */
        searchText: { type: String as PropType<string>, default: '搜索' },
        /** 重置按钮文字 */
        resetText: { type: String as PropType<string>, default: '重置' },
    } as const;
}
/** 组件传参 - 私有 */
export function formPropsGeneric<T extends Record<string, any>, O extends Record<keyof T, any>>(): ReturnType<typeof formAssist> & { datum: { type: PropType<() => ReturnType<typeof defineOption<T, O>>>, default: () => ({}) } }
export function formPropsGeneric<T extends Record<string, Record<'value' | 'options', any>>>(): ReturnType<typeof formAssist> & { datum: { type: PropType<() => ReturnType<typeof defineOption<T>>>, default: () => ({}) } }
export function formPropsGeneric<T, O>() {
    return {
        ...formAssist(),
        /** 数据源 - 表单项配置对象 */
        datum: { type: [Object, Function] as any, default: () => ({}) },
    } as const;
}
/** 组件传参 - 私有 */
export const formPropsPrivate = formPropsGeneric();
/** 组件传参 - 外部调用 */
export const formProps = emits2props({
    ...elFormProps,
    ...formPropsPrivate,
});

/** 组件事件 - 私有 */
export function formEmitsGeneric<T>() {
    return {
        ...{} as typeof elFormEmits,
        /** query 已初始化 */
        ready: (query: Record<string, any>) => true,
        /** 搜索事件 - 触发内部 query 对象更新 */
        search: (query: Record<string, any>) => true,
        /** 重置事件 */
        reset: (query: Record<string, any>) => true,
        /**
         * 字段值发生改变时触发
         * @param {object} option 提供的
         * @param {string} option.field 实际改变的键
         * @param {*} option.value
         * @param {object} option.query
         * @param {string} option.nativeField 原始健(不受 as, fields 等属性影响)
         */
        fieldChange: (option: { field: string; value: any; query: Record<string, any>; nativeField: string }) => true,
    };
}
/** 组件事件 - 私有 */
export const formEmitsPrivate = formEmitsGeneric();
/** 组件事件 - 外部调用 */
export const formEmits = {
    ...elFormEmits,
    ...formEmitsPrivate,
};
export type FormEmits<T> = ReturnType<typeof formEmitsGeneric<T>>;

export interface FormSlots<T> {
    /** 取代默认组件 */
    default?: ((props: FormSlotProps<T>) => any);
    /** 取代默认组件 */
    prepend?: ((props: FormSlotProps<T>) => any);
    /** 取代默认组件 */
    btn?: ((props: Record<'search' | 'reset' | 'resetAndSearch', string>) => any);
}
export interface FormSlotProps<T> {
    getProps: () => ExtractPublicPropTypes<ReturnType<typeof formPropsGeneric<any>>>;
    plain: ReturnType<typeof useWrapper>;

}
