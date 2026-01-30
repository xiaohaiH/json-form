<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <component v-bind="$attrs" :is="tag" ref="tagRef" v-on="$listeners">
        <template v-if="$slots.prepend">
            <slot name="prepend" :query="query" :checked="checked" />
        </template>
        <template v-else-if="slots.prepend">
            <component :is="getNode(slots.prepend)" :query="query" :checked="checked" />
        </template>
        <template v-if="slots.default">
            <component :is="slots.default" :config="finalConfig" :query="query" :checked="checked" />
        </template>
        <slot v-else-if="hasOwn($slots, 'default')" :config="finalConfig" :query="query" />
        <template v-else>
            <template v-for="(item, key) of finalConfig">
                <component :is="getComponent2(item.t)" v-if="item" :key="item.field || key" v-bind="item" :field="item.as || item.field || key" :query="query" />
            </template>
        </template>
        <template v-if="$slots.append">
            <slot name="append" :query="query" :checked="checked" />
        </template>
        <template v-else-if="slots.append">
            <component :is="getNode(slots.append)" :query="query" :checked="checked" />
        </template>
    </component>
</template>

<script lang="tsx">
import { get, hasOwn, hyphenate, usePlain } from '@xiaohaih/json-form-core';
// import type { SlotsType } from 'vue';
import { computed, defineComponent, markRaw, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { getComponent } from './assist';
import type { GroupSlots } from './types';
import { groupEmitsPrivate as emits, groupPropsPrivate as props } from './types';

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
        const checked = undefined;
        // const checked = computed(() => get<any>(props.query, props.field!));
        const finalConfig = computed(() => {
            const { config, parseConfig } = props;
            if (!parseConfig) return [];
            return typeof config === 'function' ? config({ query: props.query }) : config;
        });
        /** 对 group 组件特殊处理 */
        function getComponent2(name: string) {
            return name === 'group' ? 'HGroup' : getComponent(name);
        }

        props.hooks?.created?.({ props });

        return {
            hyphenate,
            hasOwn,
            getNode,
            tagRef,
            checked,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
