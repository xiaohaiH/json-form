<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--radio json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as RadioSlots).before">
            <component :is="getNode(slots?.before || ($slots as RadioSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <component
                :is="radioType"
                :model-value="(checked as boolean)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :label="contentActualProps[realLabelProp]"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="(change as () => void)"
                @[eventName].prevent="customChange"
            >
                {{ contentActualProps.label }}
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </component>
        </slot>
        <template v-if="slots?.after || ($slots as RadioSlots).after">
            <component :is="getNode(slots?.after || ($slots as RadioSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as RadioSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as RadioSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { checkVersion, getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElRadio, ElRadioButton, ElRadioGroup, version } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { RadioSlots } from './types';
import { radioEmitsPrivate as emits, radioPropsPrivate as props } from './types';

/** 小于 2.6 版本时, label 作为 value 使用 */
const VALUE_KEY = checkVersion(version, '2.6.0', '<') ? 'value' as const : 'label' as const;

/**
 * @file 单选框
 */
export default defineComponent({
    name: 'HRadio',
    components: {
        ElFormItem,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<RadioSlots>,
    setup(props, ctx) {
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));
        const eventName = computed(() => (props.cancelable ? 'click' : null));

        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        /** 单选框选中事件 - 处理可取消选中 */
        function customChange() {
            plain.change(plain.checked.value === contentActualProps.value.value ? '' : contentActualProps.value.value);
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            radioType,
            eventName,
            realLabelProp: VALUE_KEY,
            customChange,
        };
    },
});
</script>

<style lang="css" scoped></style>
