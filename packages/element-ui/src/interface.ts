import type { CoreOption, GetOptions } from '@xiaohaih/json-form-core';
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
    RadioGroupProps as PureRadioGroupProps,
    RadioProps as PureRadioProps,
    RateProps as PureRateProps,
    SelectProps as PureSelectProps,
    SliderProps as PureSliderProps,
    SwitchProps as PureSwitchProps,
    TimePickerProps as PureTimePickerProps,
    UploadProps as PureUploadProps,
} from '../components/index';

type BuiltInField<T = ''> = CoreOption.BuiltInField | keyof RewriteOption<any, any, any, any> | T;

/** 重写下列选项(函数内导出的属性无法被推断出来) */
interface RewriteOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 提交的字段 */
    field?: T;
    /** 提交的字段集(多选时, 每个下标对应的字段可能不一样)) */
    fields?: T[];
    /** 数据源 */
    options?: Option;
    /** 获取数据源的方法 */
    getOptions?: GetOptions<T, Query, Option, OptionQuery>;
}

/** 条件声明集合 */
export type JSONFormOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>
    = | AutocompleteProps<T, Query, Option, OptionQuery>
        | CascaderProps<T, Query, Option, OptionQuery>
        | CheckboxGroupProps<T, Query, Option, OptionQuery>
        | CheckboxProps<T, Query, Option, OptionQuery>
        | ColorPickerProps<T, Query, Option, OptionQuery>
        | CustomRenderProps<T, Query, Option, OptionQuery>
        | DatepickerProps<T, Query, Option, OptionQuery>
        | DynamicGroupProps<T, Query, Option, OptionQuery>
        | GroupProps<T, Query, Option, OptionQuery>
        | InputNumberProps<T, Query, Option, OptionQuery>
        | InputProps<T, Query, Option, OptionQuery>
        | RadioGroupProps<T, Query, Option, OptionQuery>
        | RadioProps<T, Query, Option, OptionQuery>
        | RateProps<T, Query, Option, OptionQuery>
        | SelectProps<T, Query, Option, OptionQuery>
        | SliderProps<T, Query, Option, OptionQuery>
        | SwitchProps<T, Query, Option, OptionQuery>
        | TimePickerProps<T, Query, Option, OptionQuery>
        | UploadProps<T, Query, Option, OptionQuery>;

export interface AutocompleteProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureAutocompleteProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'autocomplete';
}
export interface CascaderProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCascaderProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'cascader';
}
export interface CheckboxGroupProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCheckboxGroupProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'checkbox-group';
}
export interface CheckboxProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCheckboxProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'checkbox';
}
export interface ColorPickerProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureColorPickerProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'color-picker';
}
export interface CustomRenderProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCustomRenderProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'custom-render';
}
export interface DatepickerProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDatepickerProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'date-picker';
}
export interface DynamicGroupProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDynamicGroupProps<T, Query, Option, OptionQuery>, BuiltInField | 'config'>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'dynamic-group';
    /** 渲染的子条件(重写该属性以补充声明) */
    config?: MaybeFunction<[{ item: Record<string, any>; query: Query; checked: any; index: number }], JSONFormOption<T, Query, Option, OptionQuery>[] | Record<keyof Query, JSONFormOption<T, Query, Option, OptionQuery>>>;
}
export interface GroupProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureGroupProps<T, Query, Option, OptionQuery>, BuiltInField | 'config'>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'group';
    /** 渲染的子条件(重写该属性以补充声明) */
    config?: MaybeFunction<[{ query: Query; checked: any }], JSONFormOption<T, Query, Option, OptionQuery>[] | Record<keyof Query, JSONFormOption<T, Query, Option, OptionQuery>>>;
}
export interface InputNumberProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputNumberProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'input-number';
}
export interface InputProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'input';
}
export interface RadioGroupProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRadioGroupProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'radio-group';
}
export interface RadioProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRadioProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'radio';
}
export interface RateProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRateProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'rate';
}
export interface SelectProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSelectProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'select';
}
export interface SliderProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSliderProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'slider';
}
export interface SwitchProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSwitchProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'switch';
}
export interface TimePickerProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureTimePickerProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'time-picker';
}
export interface UploadProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureUploadProps<T, Query, Option, OptionQuery>, BuiltInField>, RewriteOption<T, Query, Option, OptionQuery> {
    t: 'upload';
}

export type MaybeFunction<TParams extends any[], TResult> = TResult | ((...args: TParams) => TResult);
