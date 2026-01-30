<template>
    <HGroup ref="dynamicGroupRef" :config="config" :query="query" :tag="tag" :field="field" :hooks="hooks" :slots="slots" :parse-config="false">
        <template v-if="($slots as DynamicGroupSlots).prepend" #prepend>
            <slot :query="query" name="prepend" />
        </template>
        <template v-if="($slots as DynamicGroupSlots).append" #append>
            <slot :query="query" name="append" />
        </template>
        <template #default>
            <template v-for="(opt, idx) of finalConfig" :key="opt.uniqueValue">
                <div v-bind="itemProps">
                    <component :is="itemSlots.prepend" :query="query" :checked="checked!" :index="idx" />
                    <template v-for="(item) of opt.options" :key="`${field}.${idx}.${item.field}`">
                        <component :is="getComponent2(item.t)!" v-if="item" v-bind="item" :unique-value="opt.uniqueValue" :field="`${field}.${idx}.${item.field}`" :query="query" :parent-query="checked![idx]" />
                    </template>
                    <component :is="itemSlots.append" :query="query" :checked="checked!" :index="idx" />
                </div>
            </template>
        </template>
    </HGroup>
</template>

<script lang="tsx">
import type { PlainProps } from '@xiaohaih/json-form-core';
import { defineCommonMethod, get, getNode, getProvideValue, hyphenate, isPlainObject, set, usePlain } from '@xiaohaih/json-form-core';
import type { ExtractPublicPropTypes, SlotsType } from 'vue';
import { computed, defineComponent, inject, markRaw, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { getComponent, HGroup } from '../group/index';
import type { DynamicGroupSlots } from './types';
import { dynamicGroupEmitsPrivate as emits, dynamicGroupPropsPrivate as props } from './types';

type Option = Omit<ExtractPublicPropTypes<PlainProps<any, Record<string, any>, any>>, 'query'> & { t: string };

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
    slots: Object as SlotsType<DynamicGroupSlots>,
    setup(props, ctx) {
        const dynamicGroupRef = ref<Record<string, any> | undefined>();
        const checked = computed(() => get<Record<string, any>[] | undefined>(props.query, props.field!));
        // /** watch 版本的配置项, watch 自带旧值记录, 方便做优化 */
        // const finalConfig = ref<{ uniqueValue: string | number; options: Option[] }[]>([]);
        // watch(
        //     [() => checked.value && [...checked.value], () => props.config],
        //     ([value, config], oldVal) => {
        //         if (!value?.length) return finalConfig.value = [];
        //         const { uniqueKey } = props;
        //         const isFunc = typeof config === 'function';
        //         const arr = !isFunc && coverObjOption2Arr<Option[]>(config);
        //         finalConfig.value = value.map((o, i) => ({
        //             uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, oldVal?.[0], i),
        //             options: isFunc ? coverObjOption2Arr<Option[]>(config({ item: o, index: i, query: props.query })) : arr as Option[],
        //         }));
        //     },
        //     { immediate: true },
        // );
        // /**
        //  * 获取唯一 id, 如果与旧引用相同, 则复用唯一 id(配合 finalConfig - watch 版本使用)
        //  * (为动态新增的表单项做的优化, 不然可以用下方的计算属性(finalConfig))
        //  */
        // function getId(val: Record<string, any>, oldVal: Record<string, any>[] | undefined, idx: number) {
        //     return oldVal?.[idx] === val ? finalConfig.value[idx].uniqueValue : ++globalId;
        // }
        /** 由于计算属性不似 watch 有上条数据, 因为手动记录 */
        let configSnapshot = {
            /** 记录每行配置项的唯一值集合 */
            configUniqueValue: [] as any[],
            /** 记录每行数据的值集合 */
            checkedValue: [] as any[],
        };
        /** 计算属性版本的 config 配置项(防止生成的配置项中用了响应式变量, 不在计算属性中生成无法捕捉到) */
        const finalConfig = computed(() => {
            const { config } = props;
            if (!config) return [];
            const value = checked.value;
            if (!value?.length) return [];
            const isFunc = typeof config === 'function';
            const arr = !isFunc && coverObjOption2Arr<Option[]>(config);
            const { uniqueKey } = props;
            const result = value.map((o, i) => ({ uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, i), options: isFunc ? coverObjOption2Arr<Option[]>(config({ item: o, index: i, query: props.query })) : arr as Option[] }));
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            configSnapshot.configUniqueValue = result.map((r) => r.uniqueValue);
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            configSnapshot.checkedValue = [...value];
            return result;
        });
        /**
         * 获取唯一 id, 如果与旧引用相同, 则复用唯一 id(配合 finalConfig - computed 版本使用)
         * (为动态新增的表单项做的优化, 不然可以用下方的计算属性(finalConfig))
         */
        function getId(val: Record<string, any>, idx: number) {
            return configSnapshot.checkedValue[idx] === val ? configSnapshot.configUniqueValue[idx] : ++globalId;
        }
        /** 将对象形式的配置项转为数组 */
        function coverObjOption2Arr<T>(opt: any): T {
            return (isPlainObject(opt) ? Object.entries(opt).map(([key, value]) => ({ ...value, field: key })) : opt) as unknown as T;
        }

        /** 容器注入值 */
        const wrapper = getProvideValue();
        const option = defineCommonMethod({
            reset(this: void, query?: Record<string, any>) {
                set(query || props.query, props.field!, getDef());
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
            checked,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
