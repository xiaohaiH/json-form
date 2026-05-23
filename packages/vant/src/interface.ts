import type { CoreOption, GetOptions, getProvideValue, usePlain } from '@xiaohaih/json-form-core';
import type { CellGroupProps as VanCellGroupProps, Form as VanForm } from 'vant';
import type { Ref } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type {
    AreaProps as PureAreaProps,
    CascaderProps as PureCascaderProps,
    CheckboxGroupProps as PureCheckboxGroupProps,
    CheckboxProps as PureCheckboxProps,
    CustomRenderProps as PureCustomRenderProps,
    DatePickerProps as PureDatePickerProps,
    DateTimePickerGroupProps as PureDateTimePickerGroupProps,
    DatetimePickerProps as PureDatetimePickerProps,
    DynamicGroupProps as PureDynamicGroupProps,
    GroupProps as PureGroupProps,
    InputProps as PureInputProps,
    NumberKeyboardProps as PureNumberKeyboardProps,
    PasswordInputProps as PurePasswordInputProps,
    PickerProps as PurePickerProps,
    RadioGroupProps as PureRadioGroupProps,
    RadioProps as PureRadioProps,
    RateProps as PureRateProps,
    SignatureProps as PureSignatureProps,
    SliderProps as PureSliderProps,
    StepperProps as PureStepperProps,
    SwitchProps as PureSwitchProps,
    TimePickerProps as PureTimePickerProps,
    TreeSelectProps as PureTreeSelectProps,
    UploadProps as PureUploadProps,
} from '../components/index';
import type { ComponentType } from '../components/share';

type BuiltInField<T = ''> = CoreOption.BuiltInField | keyof RewriteOption<any, any, any, any> | T;

/** 重写下列选项(函数内导出的属性无法被推断出来) */
interface RewriteOption<Field, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 提交的字段 */
    field?: Field;
    /** 提交的字段集(多选时, 每个下标对应的字段可能不一样)) */
    fields?: Field[];
    /** 数据源 */
    options?: Option;
    /** 获取数据源的方法 */
    getOptions?: GetOptions<Query, OptionQuery>;
}

/** 条件声明集合 */
export type JSONFormOption<Field, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>
    = | AreaProps<Field, Query, Option, OptionQuery>
        | CascaderProps<Field, Query, Option, OptionQuery>
        | CheckboxGroupProps<Field, Query, Option, OptionQuery>
        | CheckboxProps<Field, Query, Option, OptionQuery>
        | CustomRenderProps<Field, Query, Option, OptionQuery>
        | DatePickerProps<Field, Query, Option, OptionQuery>
        | DateTimePickerGroupProps<Field, Query, Option, OptionQuery>
        | DatetimePickerProps<Field, Query, Option, OptionQuery>
        | DynamicGroupProps<Field, Query, Option, OptionQuery>
        | GroupProps<Field, Query, Option, OptionQuery>
        | CellGroupProps<Field, Query, Option, OptionQuery>
        | InputProps<Field, Query, Option, OptionQuery>
        | NumberKeyboardProps<Field, Query, Option, OptionQuery>
        | PasswordInputProps<Field, Query, Option, OptionQuery>
        | PickerProps<Field, Query, Option, OptionQuery>
        | RadioGroupProps<Field, Query, Option, OptionQuery>
        | RadioProps<Field, Query, Option, OptionQuery>
        | RateProps<Field, Query, Option, OptionQuery>
        | SignatureProps<Field, Query, Option, OptionQuery>
        | SliderProps<Field, Query, Option, OptionQuery>
        | StepperProps<Field, Query, Option, OptionQuery>
        | SwitchProps<Field, Query, Option, OptionQuery>
        | TimePickerProps<Field, Query, Option, OptionQuery>
        | TreeSelectProps<Field, Query, Option, OptionQuery>
        | UploadProps<Field, Query, Option, OptionQuery>;

export interface AreaProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureAreaProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'area';
}
export interface CascaderProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCascaderProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'cascader';
}
export interface CheckboxGroupProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCheckboxGroupProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'checkbox-group';
}
export interface CheckboxProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCheckboxProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'checkbox';
}
export interface CustomRenderProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCustomRenderProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'custom-render';
}
export interface DatePickerProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDatePickerProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'date-picker';
}
export interface DateTimePickerGroupProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDateTimePickerGroupProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'date-time-picker-group';
}
export interface DatetimePickerProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDatetimePickerProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    /**
     * @deprecated vant@3.x版本使用, vant@4.x版本使用 date-time-picker-group
     */
    t: 'datetime-picker';
}
export interface DynamicGroupProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDynamicGroupProps<Query, OptionQuery>, BuiltInField | 'config'>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'dynamic-group';
    /**
     * 渲染的子条件(重写该属性以补充声明)
     * 动态表单不是根级属性, 不应该暴露出来, 遂用 string 替代
     */
    config?: MaybeFunction<[{ item: Record<string, any>; index: number; checked: Record<string, any>[]; query: Query; plain: ReturnType<typeof usePlain> }], JSONFormOption<string, Query, Option, OptionQuery>[] | Record<keyof Query, JSONFormOption<string, Query, Option, OptionQuery>>>;
}
export interface GroupProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureGroupProps<Query, OptionQuery>, BuiltInField | 'config' | 'getFormRef'>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'group';
    /** 渲染的子条件(重写该属性以补充声明) */
    config?: MaybeFunction<[{ query: Query; wrapper?: ReturnType<typeof getProvideValue<Query, OptionQuery, Ref<ComponentExposed<typeof VanForm>>>> }], JSONFormOption<Field, Query, Option, OptionQuery>[] | Record<keyof Query, JSONFormOption<Field, Query, Option, OptionQuery>>>;
}
export interface CellGroupProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureGroupProps<Query, OptionQuery>, BuiltInField | 'config' | 'getFormRef' | 'slots' | 'tagSlots'>, RewriteOption<Field, Query, Option, OptionQuery>, Partial<VanCellGroupProps> {
    t: 'cell-group';
    /** 重写插槽声明 */
    slots?: PureGroupProps<Query, OptionQuery>['slots'] & {
        /** 自定义分组标题 */
        title?: ComponentType<{ query: Query; wrapper?: ReturnType<typeof getProvideValue<Query, OptionQuery, Ref<ComponentExposed<typeof VanForm>>>>  }>;
    };
    /** 渲染的子条件(重写该属性以补充声明) */
    config?: MaybeFunction<[{ query: Query; wrapper?: ReturnType<typeof getProvideValue<Query, OptionQuery, Ref<ComponentExposed<typeof VanForm>>>> }], JSONFormOption<Field, Query, Option, OptionQuery>[] | Record<keyof Query, JSONFormOption<Field, Query, Option, OptionQuery>>>;
}
export interface InputProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'input';
}
export interface NumberKeyboardProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureNumberKeyboardProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'number-keyboard';
}
export interface PasswordInputProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PurePasswordInputProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'password-input';
}
export interface PickerProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PurePickerProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'picker' | 'select';
}
export interface RadioGroupProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRadioGroupProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'radio-group';
}
export interface RadioProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRadioProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'radio';
}
export interface RateProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRateProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'rate';
}
export interface SignatureProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSignatureProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'signature';
}
export interface SliderProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSliderProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'slider';
}
export interface StepperProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureStepperProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'stepper';
}
export interface SwitchProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSwitchProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'switch';
}
export interface TimePickerProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureTimePickerProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'time-picker';
}
export interface TreeSelectProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureTreeSelectProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'tree-select';
}
export interface UploadProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureUploadProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'upload';
}

export type MaybeFunction<TParams extends any[], TResult> = TResult | ((...args: TParams) => TResult);
