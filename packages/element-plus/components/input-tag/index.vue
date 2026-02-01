<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--input-tag json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as InputTagSlots).before">
            <component :is="getNode(slots?.before || ($slots as InputTagSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElInputTag
                :clearable="clearable"
                :model-value="(checked as string[])"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
                @add-tag="tagAdd"
                @keydown.enter="enterHandle"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElInputTag>
        </slot>
        <template v-if="slots?.after || ($slots as InputTagSlots).after">
            <component :is="getNode(slots?.after || ($slots as InputTagSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as InputTagSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as InputTagSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, useFlag, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElInputTag } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { InputTagSlots } from './types';
import { inputTagEmitsPrivate as emits, inputTagPropsPrivate as props } from './types';

/**
 * @file 标签输入框
 */
export default defineComponent({
    name: 'HInputTag',
    components: {
        ElFormItem,
        ElInputTag,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<InputTagSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        const { flag: enterFlag, updateFlag } = useFlag(false);
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            // 1. 先触发 enter 事件
            // 2. 再触发 tagAdd 事件
            // 防止在添加标签时触发回车事件, 加上 enterFlag 标志做判断
            nextTick(() => {
                if (enterFlag.value) return;
                plain.wrapper?.search();
            });
        }
        /** 新增标签某项后触发的事件 */
        function tagAdd() {
            updateFlag();
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            enterHandle,
            tagAdd,
        };
    },
});
</script>

<style lang="css" scoped></style>
