import type { CamelCase, hyphenate, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { mentionEmits as elMentionEmits, mentionProps as elMentionProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function mentionPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elMentionProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elMentionEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, MentionSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否实时触发搜索事件(当 wrapper.realtime 为 true 时, 可将该值设为 false 并设置抖动时间) */
        realtime: { type: Boolean as PropType<boolean>, default: true },
        /** 实时触发时防抖动的时间 */
        waitTime: { type: Number as PropType<number>, default: 300 },
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            label: ((props: MentionSlotOption<T, Query, Option, OptionQuery> & { item: Option; index: number }) => any);
            loading: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
            header: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
            footer: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
            prefix: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
            suffix: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
            prepend: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
            append: ((props: MentionSlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}
export interface MentionSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elMentionProps>>;
    getProps: () => MentionProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    onEnter: (ev: Event | KeyboardEvent) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const mentionPropsPrivate = mentionPropsGeneric();
/** 组件传参 - 外部调用 */

export const mentionProps = emits2props({
    ...elMentionProps,
    ...mentionPropsPrivate,
}, elMentionEmits);
export type MentionProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof mentionPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function mentionEmitsGeneric<T>() {
    return {
        ...{} as typeof elMentionEmits,
    };
}
/** 组件事件 - 私有 */
export const mentionEmitsPrivate = mentionEmitsGeneric();
/** 组件事件 - 外部调用 */
export const mentionEmits = {
    ...elMentionEmits,
    ...mentionEmitsPrivate,
} as ReturnType<typeof mentionEmitsGeneric<any>>;
export type MentionEmits<T> = ReturnType<typeof mentionEmitsGeneric<T>>;

export interface MentionSlots extends CommonSlots<Record<string, any>> {
}
