import type { Obj2Props, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, Prop, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';

type VanFieldProps = Obj2Props<ComponentProps<typeof VanField>>;

/** 组件传参 */
export const inputSlotProps = {
    ...{
        // 这些属性不需要传到组件上
        t: { type: String as PropType<string> },
        rules: { type: [Array, Object] as PropType<any> },
        name: { type: [String] as PropType<string> },
    } as unknown as typeof VanField.props as unknown as VanFieldProps,
    /** 输入框类型(input/textarea) */
    type: { type: String } as unknown as VanFieldProps['type'],
    /** 输入框行数 */
    rows: { type: [Number, String] as PropType<number | string> },
    /** 禁用 */
    disabled: { type: [Boolean] as PropType<boolean> },
    /** 只读 */
    readonly: { type: [Boolean] as PropType<boolean> },
    /** 文本信息 */
    label: { type: [String] as PropType<string> },
};
export type InputSlotProps = ExtractPublicPropTypes<typeof inputSlotProps>;

/** 组件事件 */
export const inputSlotEmits = {
};

export type InputSlotEmits = typeof inputSlotEmits;
