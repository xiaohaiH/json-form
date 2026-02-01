<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--switch json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as SwitchSlots).before">
            <component :is="getNode(slots?.before || ($slots as SwitchSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSwitch
                :model-value="(checked as string)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @change="(change as () => void)"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElSwitch>
        </slot>
        <template v-if="slots?.after || ($slots as SwitchSlots).after">
            <component :is="getNode(slots?.after || ($slots as SwitchSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as SwitchSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as SwitchSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElSwitch } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { SwitchSlots } from './types';
import { switchEmitsPrivate as emits, switchPropsPrivate as props } from './types';

/**
 * @file 开关
 */
export default defineComponent({
    name: 'HSwitch',
    components: {
        ElFormItem,
        ElSwitch,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<SwitchSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
