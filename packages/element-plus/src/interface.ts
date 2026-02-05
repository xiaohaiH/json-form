import type { CoreOption, GetOptions, getProvideValue, usePlain } from '@xiaohaih/json-form-core';
import type { ElForm } from 'element-plus';
import type { Ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import type {
    AutocompleteProps as PureAutocompleteProps,
    CascaderProps as PureCascaderProps,
    CheckboxGroupProps as PureCheckboxGroupProps,
    CheckboxProps as PureCheckboxProps,
    ColorPickerProps as PureColorPickerProps,
    CustomRenderProps as PureCustomRenderProps,
    DatePickerProps as PureDatepickerProps,
    DynamicGroupProps as PureDynamicGroupProps,
    GroupProps as PureGroupProps,
    InputNumberProps as PureInputNumberProps,
    InputProps as PureInputProps,
    InputTagProps as PureInputTagProps,
    MentionProps as PureMentionProps,
    RadioGroupProps as PureRadioGroupProps,
    RadioProps as PureRadioProps,
    RateProps as PureRateProps,
    SegmentedProps as PureSegmentedProps,
    SelectProps as PureSelectProps,
    SelectV2Props as PureSelectV2Props,
    SliderProps as PureSliderProps,
    SwitchProps as PureSwitchProps,
    TimePickerProps as PureTimePickerProps,
    TimeSelectProps as PureTimeSelectProps,
    TreeSelectProps as PureTreeSelectProps,
    UploadProps as PureUploadProps,
} from '../components/index';

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
    = | AutocompleteProps<Field, Query, Option, OptionQuery>
        | CascaderProps<Field, Query, Option, OptionQuery>
        | CheckboxGroupProps<Field, Query, Option, OptionQuery>
        | CheckboxProps<Field, Query, Option, OptionQuery>
        | ColorPickerProps<Field, Query, Option, OptionQuery>
        | CustomRenderProps<Field, Query, Option, OptionQuery>
        | DatepickerProps<Field, Query, Option, OptionQuery>
        | DynamicGroupProps<Field, Query, Option, OptionQuery>
        | GroupProps<Field, Query, Option, OptionQuery>
        | InputNumberProps<Field, Query, Option, OptionQuery>
        | InputProps<Field, Query, Option, OptionQuery>
        | InputTagProps<Field, Query, Option, OptionQuery>
        | MentionProps<Field, Query, Option, OptionQuery>
        | RadioGroupProps<Field, Query, Option, OptionQuery>
        | RadioProps<Field, Query, Option, OptionQuery>
        | RateProps<Field, Query, Option, OptionQuery>
        | SegmentedProps<Field, Query, Option, OptionQuery>
        | SelectProps<Field, Query, Option, OptionQuery>
        | SelectV2Props<Field, Query, Option, OptionQuery>
        | SliderProps<Field, Query, Option, OptionQuery>
        | SwitchProps<Field, Query, Option, OptionQuery>
        | TimePickerProps<Field, Query, Option, OptionQuery>
        | TimeSelectProps<Field, Query, Option, OptionQuery>
        | TreeSelectProps<Field, Query, Option, OptionQuery>
        | UploadProps<Field, Query, Option, OptionQuery>;

export interface AutocompleteProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureAutocompleteProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'autocomplete';
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
export interface ColorPickerProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureColorPickerProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'color-picker';
}
export interface CustomRenderProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCustomRenderProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'custom-render';
}
export interface DatepickerProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDatepickerProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'date-picker';
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
    config?: MaybeFunction<[{ query: Query; wrapper?: ReturnType<typeof getProvideValue<Query, OptionQuery, Ref<ComponentExposed<typeof ElForm>>>> }], JSONFormOption<Field, Query, Option, OptionQuery>[] | Record<keyof Query, JSONFormOption<Field, Query, Option, OptionQuery>>>;
}
export interface InputNumberProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputNumberProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'input-number';
}
export interface InputProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'input';
}
export interface InputTagProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputTagProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'input-tag';
}
export interface MentionProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureMentionProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'mention';
    // 需要重新声明, 否则 ts 会报层级过深
    inputStyle?: string | string[] | Record<string, any>;
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
export interface SegmentedProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSegmentedProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'segmented';
}
export interface SelectProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSelectProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'select';
}
export interface SelectV2Props<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSelectV2Props<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'select-v2';
}
export interface SliderProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSliderProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'slider';
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
export interface TimeSelectProps<
    Field,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureTimeSelectProps<Query, OptionQuery>, BuiltInField>, RewriteOption<Field, Query, Option, OptionQuery> {
    t: 'time-select';
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
