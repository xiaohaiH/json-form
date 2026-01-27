<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <HGroup ref="dynamicGroupRef" :config="config" :query="query" :tag="tag" :field="field" :hooks="hooks" :slots="slots" v-bind="$attrs" v-on="$listeners">
        <template v-if="$slots.prepend" #prepend>
            <slot :query="query" name="prepend" />
        </template>
        <template v-if="$slots.append" #append>
            <slot :query="query" name="append" />
        </template>
        <template #default>
            <template v-for="(opt, idx) of finalConfig">
                <div :key="opt.uniqueValue" v-bind="itemProps">
                    <component :is="itemSlots.prepend" :query="query" :checked="checked" :index="idx" />
                    <template v-for="(item) of opt.options">
                        <component :is="getComponent2(item.t)" v-if="item" :key="`${field}.${idx}.${item.field}`" v-bind="item" :unique-value="opt.uniqueValue" :field="`${field}.${idx}.${item.field}`" :query="query" :parent-query="checked[idx]" />
                    </template>
                    <component :is="itemSlots.append" :query="query" :checked="checked" :index="idx" />
                </div>
            </template>
        </template>
    </HGroup>
</template>

<script lang="tsx">
import type { PlainProps, ProvideValue } from '@xiaohaih/json-form-core';
import { defineCommonMethod, get, hyphenate, isPlainObject, provideKey, set, usePlain } from '@xiaohaih/json-form-core';
import type { ExtractPropTypes, Ref } from 'vue-demi';
import { computed, defineComponent, inject, markRaw, ref, set as vueSet, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { getComponent, HGroup } from '../group/index';
import type { DynamicGroupSlots } from './types';
import { dynamicGroupEmitsPrivate as emits, dynamicGroupPropsPrivate as props } from './types';

type Option = Omit<ExtractPropTypes<PlainProps<any, Record<string, any>, any>>, 'query'> & { t: string };

let globalId = 0;

/**
 * @file 自定义组件 - 动态删减组件(对应动态表单)
 */
export default defineComponent({
    name: 'HDynamicGroup',
    components: {
        HGroup,
    },
    props,
    emits,
    // slots: Object as SlotsType<DynamicGroupSlots>,
    setup(props, ctx) {
        const dynamicGroupRef = ref<Record<string, any> | undefined>();
        const checked = computed(() => get<Record<string, any>[] | undefined>(props.query, props.field!));
        const finalConfig = ref<{ uniqueValue: string | number; options: Option[] }[]>([]);
        watch(
            [() => checked.value && [...checked.value], () => props.config],
            ([value, config], oldVal) => {
                if (!value?.length) return finalConfig.value = [];
                const { uniqueKey } = props;
                const isFunc = typeof config === 'function';
                const arr = coverObjOption2Arr<Option[]>(config);
                finalConfig.value = value.map((o, i) => ({
                    uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, oldVal, i),
                    options: isFunc ? coverObjOption2Arr<Option[]>(config({ item: o, index: i, query: props.query })) : arr,
                }));
            },
            { immediate: true },
        );
        /**
         * 获取唯一 id, 如果与旧引用相同, 则复用唯一 id
         * (为动态新增的表单项做的优化, 不然可以用下方的计算属性(finalConfig))
         */
        function getId(val: Record<string, any>, oldVal: Record<string, any>[][], idx: number) {
            return oldVal?.[0] && oldVal[0][idx] === val ? finalConfig.value[idx].uniqueValue : ++globalId;
        }
        // const finalConfig = computed(() => {
        //     const { config } = props;
        //     if (!config) return [];
        //     const { uniqueKey } = props;
        //     const value = checked.value;
        //     if (!value?.length) return [];
        //     const isFunc = typeof config === 'function';
        //     const arr = coverObjOption2Arr<Option[]>(config);
        //     return value.map((o, i) => ({ uniqueValue: uniqueKey ? o[uniqueKey] : ++globalId, options: isFunc ? coverObjOption2Arr<Option[]>(config({ item: o, index: i, query: props.query })) : arr }));
        // });
        /** 将对象形式的配置项转为数组 */
        function coverObjOption2Arr<T>(opt: any): T {
            return (isPlainObject(opt) ? Object.entries(opt).map(([key, value]) => ({ ...value, field: key })) : opt) as unknown as T;
        }

        /** 容器注入值 */
        const wrapper = inject<ProvideValue>(provideKey);
        const option = defineCommonMethod({
            reset(this: void, query?: Record<string, any>) {
                set(query || props.query, props.field!, getDef(), vueSet);
            },
            get validator() {
                return props.validator;
            },
            onBackfillChange: (backfill, oldBackfill, isChange) => {
                // isChange && props.hooks?.backfillChange?.(backfill, oldBackfill);
            },
            trySetDefaultValue(_query: Record<string, any>) {
                // 存在默认值时
                // 如果值为空, 直接赋默认值
                // 如果值长度为空则读取默认值, 且在默认值长度为真时赋值
                const { defaultValue } = props;
                if (!defaultValue) return false;
                const val = get<any[] | undefined>(_query, props.field!);
                let def;
                if (!val) {
                    def = getDef();
                }
                else if (!val.length) {
                    const r = getDef();
                    r!.length && (def = r);
                }
                if (def) {
                    set(_query, props.field!, def);
                    return true;
                }
                return false;
            },
        });
        wrapper?.register(option);
        /** 获取默认值 */
        function getDef() {
            const { defaultValue } = props;
            return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
        function getComponent2(name: string) {
            return name === 'dynamic-group' ? 'HDynamicGroup' : name === 'group' ? HGroup : getComponent(name);
        }

        return {
            wrapper,
            option,
            hyphenate,
            getNode,
            dynamicGroupRef,
            checked: checked as unknown as Ref<NonNullable<typeof checked.value>>,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
