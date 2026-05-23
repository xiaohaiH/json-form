<template>
    <VanField
        v-if="!hide"
        :name="field"
        :disabled="globalDisabled || disabled"
        :readonly="true"
        :is-link="isLink"
        :model-value="showText"
        v-bind="$attrs"
        @click="clickHandle"
    >
        <template #extra>
            <VanPopup v-model:show="popupInfo.visible" teleport="body" round position="bottom" v-bind="popupProps" v-on="popupOn" @close="popupInfo.close">
                <VanTreeSelect
                    :main-active-index="mainActiveIndex"
                    :active-id="checked"
                    :items="finalOption"
                    v-bind="treeSelectProps" v-on="treeSelectOn"
                    @update:main-active-index="mainActiveIndexChange"
                    @update:active-id="activeIdChange"
                >
                    <template v-for="(item, slotName) of treeSelectSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" :options="finalOption" />
                    </template>
                </VanTreeSelect>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Popup as VanPopup, TreeSelect as VanTreeSelect } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import type { PickerOption } from '../picker/types';
import { useCommonSetup } from '../use';
import type { TreeSelectOption, TreeSelectSlots } from './types';
import { treeSelectEmitsPrivate as emits, treeSelectPropsPrivate as props } from './types';

/**
 * @file 分类选择器
 */
export default defineComponent({
    name: 'HTreeSelect',
    components: { VanTreeSelect, VanField, VanPopup },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<TreeSelectSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 展示在页面上的值 */
        const showText = computed(() => {
            const value = plain.checked.value as string | string[];
            if (!value) return '';
            const { format, separator } = props;
            const source = (props.treeSelectProps?.items || plain.finalOption.value) as TreeSelectOption[];
            if (format) return format({ source, value, separator });
            const result: string[] = [];
            let _item: TreeSelectOption['children'][number] | undefined;
            if (typeof value === 'string') {
                source.some((o) => {
                    _item = o.children.find((oo) => oo.id === value);
                    _item && result.push(_item.text);
                    return !!_item;
                });
            }
            else {
                value.forEach((val) => source.some((oo) => {
                    _item = oo.children.find((ooo) => ooo.id === val);
                    _item && result.push(_item.text);
                    return !!_item;
                }));
            }
            return result.filter(Boolean).join(separator);
        });
        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /** 左侧激活项 */
        const mainActiveIndex = ref(0);
        let tempChecked: any;
        watch(
            [plain.checked, plain.finalOption],
            ([val, options]) => {
                if (!options?.length) return;
                // 两者相等, 说明是 activeIdChange, 可以直接返回
                if (tempChecked === val) {
                    tempChecked = null;
                    return;
                }
                tempChecked = null;
                // 直接重置为 0
                mainActiveIndex.value = 0;
                if (!(val && val.length)) return;
                // 如果是字符串, 直接赋值所在下标
                if (typeof val === 'string') {
                    let flag: boolean;
                    (options as TreeSelectOption[]).some((o, idx) => {
                        flag = o.children.some((oo) => oo.id === val);
                        flag && (mainActiveIndex.value = idx);
                        return flag;
                    });
                }
                else {
                    // 如果是数组, 取最小的一个下标
                    const idxs = (val as string[]).map((o) => (options as TreeSelectOption[]).findIndex((oo) => oo.children.some((ooo) => ooo.id === o)));
                    // Math.max 兜底处理, 防止出现 -1
                    mainActiveIndex.value = Math.max(0, Math.min(...idxs));
                }
            },
            { immediate: true },
        );
        /** 左侧标签更改事件 */
        function mainActiveIndexChange(index: number) {
            mainActiveIndex.value = index;
        }
        /** 右侧更改事件 */
        function activeIdChange(value: string | string[]) {
            plain.change(value);
            tempChecked = plain.checked.value;
            nextTick(() => tempChecked = null);
        }

        /** 弹窗显示状态 */
        const popupInfo = ref({
            visible: false,
            open() {
                popupInfo.value.visible = true;
            },
            close() {
                popupInfo.value.visible = false;
            },
        });

        return {
            hyphenate,
            getNode,
            ...plain,
            slotProps,
            showText,
            clickHandle,
            mainActiveIndex,
            mainActiveIndexChange,
            activeIdChange,
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
