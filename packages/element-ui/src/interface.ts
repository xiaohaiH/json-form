import type { CoreOption } from '@xiaohaih/json-form-core';
import type {
    CascaderProps as PureCascaderProps,
    CheckboxGroupProps as PureCheckboxGroupProps,
    CheckboxProps as PureCheckboxProps,
    ColorPickerProps as PureColorPickerProps,
    CustomRenderProps as PureCustomRenderProps,
    DatePickerProps as PureDatePickerProps,
    FormProps as PureFormProps,
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

type BuiltInField<T = ''> = CoreOption.BuiltInField | 'customGetQuery' | 'backfillToValue' | T;

export type FormProps<
    T = any,
    Query extends Record<string, any> = Record<string, any>,
    Option = any,
    QueryOption extends Record<string, any> = Record<string, any>,
> = PureFormProps<T, Query, Option, QueryOption>;

/** 条件声明集合 */
export type JSONFormOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> =
    | InputProps<T, Query, Option, OptionQuery>
    | SelectProps<T, Query, Option, OptionQuery>
    | DatePickerProps<T, Query, Option, OptionQuery>
    | RadioGroupProps<T, Query, Option, OptionQuery>
    | RadioProps<T, Query, Option, OptionQuery>
    | CheckboxGroupProps<T, Query, Option, OptionQuery>
    | CheckboxProps<T, Query, Option, OptionQuery>
    | CascaderProps<T, Query, Option, OptionQuery>
    | ColorPickerProps<T, Query, Option, OptionQuery>
    | InputNumberProps<T, Query, Option, OptionQuery>
    | RateProps<T, Query, Option, OptionQuery>
    | SliderProps<T, Query, Option, OptionQuery>
    | SwitchProps<T, Query, Option, OptionQuery>
    | TimePickerProps<T, Query, Option, OptionQuery>
    | UploadProps<T, Query, Option, OptionQuery>
    | CustomRenderProps<T, Query, Option, OptionQuery>

export interface InputProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'input';
}
export interface SelectProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSelectProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'select';
}
export interface DatePickerProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureDatePickerProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'date-picker';
}
export interface RadioGroupProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRadioGroupProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'radio-group';
}
export interface RadioProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRadioProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'radio';
}
export interface CheckboxGroupProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCheckboxGroupProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'checkbox-group';
}
export interface CheckboxProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCheckboxProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'checkbox';
}
export interface CascaderProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCascaderProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'cascader';
}
export interface ColorPickerProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureColorPickerProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'color-picker';
}
export interface InputNumberProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureInputNumberProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'input-number';
}
export interface RateProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureRateProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'rate';
}
export interface SliderProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSliderProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'slider';
}
export interface SwitchProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureSwitchProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'switch';
}
export interface TimePickerProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureTimePickerProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'time-picker';
}
export interface UploadProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureUploadProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'upload';
}
export interface CustomRenderProps<
    T,
    Query extends Record<string, any>,
    Option,
    OptionQuery extends Record<string, any> = Record<string, any>,
> extends Omit<PureCustomRenderProps<T, Query, Option, OptionQuery>, BuiltInField> {
    t: 'custom-render';
}
