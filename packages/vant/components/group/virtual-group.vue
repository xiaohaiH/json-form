<template>
    <template v-if="tag">
        <component :is="tag" v-bind="$attrs" ref="tagRef" v-on="events">
            <slot />
            <template v-for="(item, slotName) in slots" :key="slotName" #[slotName]="row">
                <component :is="getNode(item)" v-bind="row" :wrapper="wrapper" :query="query" />
            </template>
        </component>
    </template>
    <slot v-else />
</template>

<script lang="tsx">
import { getNode } from '@xiaohaih/json-form-core';
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

/**
 * @file 对 Group 组件进行包装, 以支持无根节点渲染
 */
export default defineComponent({
    name: 'VirtualGroup',
    inheritAttrs: false,
    props: {
        tag: { type: [Object, String, Array, Function] as PropType<any>, default: 'div' },
        slots: { type: [Object] as PropType<Record<string, any>> },
        wrapper: { type: [Object] as PropType<Record<string, any>> },
        query: { type: [Object] as PropType<Record<string, any>> },
    },
    setup(props, ctx) {
        // @ts-expect-error 兼容 vue2.x
        const events = computed(() => ctx.listeners || {});
        return { getNode, tagRef: ref<Record<string, any> | undefined>(), events };
    },
});
</script>

<style lang="css" scoped></style>
