<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <component v-bind="$attrs" :is="tag" ref="tagRef" v-on="$listeners">
        <template v-if="$slots.prepend">
            <slot name="prepend" :query="query" :wrapper="wrapper" />
        </template>
        <template v-else-if="slots.prepend">
            <component :is="getNode(slots.prepend)" :query="query" :wrapper="wrapper" />
        </template>
        <template v-if="slots.default">
            <component :is="slots.default" :config="finalConfig" :query="query" :wrapper="wrapper" />
        </template>
        <slot v-else-if="hasOwn($slots, 'default')" :config="finalConfig" :query="query" />
        <template v-else>
            <template v-for="(item, key) of finalConfig">
                <component :is="getComponent2(item.t)" v-if="item" :key="item.as || item.field || item[REWRITE_FIELD_KEY] || key" v-bind="item" :field="item.as || item.field || item[REWRITE_FIELD_KEY] || key" :query="query" v-on="item.on" />
            </template>
        </template>
        <template v-if="$slots.append">
            <slot name="append" :query="query" :wrapper="wrapper" />
        </template>
        <template v-else-if="slots.append">
            <component :is="getNode(slots.append)" :query="query" :wrapper="wrapper" />
        </template>
    </component>
</template>

<script lang="tsx">
import { get, getProvideValue, hasOwn, hyphenate, isPlainObject, usePlain } from '@xiaohaih/json-form-core';
// import type { SlotsType } from 'vue';
import { computed, defineComponent, markRaw, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { getComponent } from './assist';
import type { GroupSlots } from './types';
import { groupEmitsPrivate as emits, groupPropsPrivate as props } from './types';

/** 当 field 不存在, 但 fields 存在时, 合并 fields 到对象上的 key */
const REWRITE_FIELD_KEY = '__field__' as const;

/**
 * @file 自定义组件 - 支持多列渲染
 */
export default defineComponent({
    name: 'HGroup',
    components: {
    },
    props,
    emits,
    // slots: Object as SlotsType<GroupSlots>,
    setup(props, ctx) {
        const tagRef = ref<Record<string, any> | undefined>();
        /** 容器注入值 */
        const wrapper = getProvideValue();
        // const checked = computed(() => get<any>(props.query, props.field!));
        const finalConfig = computed(() => {
            const { config } = props;
            // 如果函数且提供了 formRef 时, formRef 获取失败时不渲染
            // 防止重复渲染一次导致 getOptions 重复请求
            if (typeof config === 'function' && props.getFormRef && !props.getFormRef?.()) return [];
            return typeof config === 'function' ? coverObjOption2Arr<any[]>(config({ query: props.query, wrapper, formRef: props.getFormRef?.() })) : coverObjOption2Arr<any[]>(config);
        });
        /** 将对象形式的配置项转为数组 */
        function coverObjOption2Arr<T>(opt: any): T {
            if (isPlainObject(opt)) {
                const r: any[] = [];
                Object.entries(opt).forEach(([key, value]) => {
                    value.field = key;
                    r.push(value);
                });
                return r as unknown as T;
            }
            opt.forEach((o: any) => !o.field && o.fields && (o[REWRITE_FIELD_KEY] = o.fields.join(',')));
            return opt as unknown as T;
        }
        /** 对 group 组件特殊处理 */
        function getComponent2(name: string) {
            return name === 'group' ? 'HGroup' : getComponent(name);
        }

        props.hooks?.created?.({ props });

        return {
            hyphenate,
            getNode,
            hasOwn,
            REWRITE_FIELD_KEY,
            tagRef,
            wrapper,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
