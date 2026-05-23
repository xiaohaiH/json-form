<template>
    <template v-if="renderField">
        <VanField v-if="!hide" :model-value="fieldModelValue" v-bind="$attrs">
            <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
                <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
            </template>
            <template #input>
                <component :is="customRender" v-bind="slotProps" />
            </template>
        </VanField>
    </template>
    <template v-else>
        <component :is="customRender" v-bind="slotProps" />
    </template>
</template>

<script lang="ts">
import { getNode, hyphenate, noop, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, markRaw, ref, watch } from 'vue';
import { useCommonSetup, useTempChecked } from '../use';
import type { CustomRenderSlots } from './types';
import { customRenderEmitsPrivate as emits, customRenderPropsPrivate as props } from './types';

/**
 * @file 自定义渲染
 */
export default defineComponent({
    name: 'HCustomRender',
    components: { VanField },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CustomRenderSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        const fieldModelValue = computed(() => typeof plain.checked.value === 'object' ? '' : plain.checked.value);
        const customRender = ref<any>();
        // 由计算属性改为 watch
        // 防止在 watch 中引用了响应式变量导致重渲染
        watch(() => props.render, (render) => {
            customRender.value = typeof render === 'function'
                ? getNode(render(slotProps.value))
                : render;
        }, { immediate: true });
        // const customRender = computed(() => {
        //     return typeof props.render === 'function'
        //         ? getNode(props.render(slotProps.value))
        //         : props.render;
        // });

        return {
            hyphenate,
            getNode,
            ...plain,
            slotProps,
            fieldModelValue,
            customRender,
        };
    },
});
</script>

<style lang="css" scoped></style>
