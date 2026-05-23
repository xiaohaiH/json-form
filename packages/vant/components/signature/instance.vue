<template>
    <VanSignature
        v-if="!(globalDisabled || disabled || globalReadonly || readonly)"
        ref="signatureRef"
        v-bind="signatureProps" v-on="signatureOn"
        @end="end" @submit="change" @clear="clear"
    >
        <template v-for="(item, slotName) of signatureSlots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanSignature>
    <img v-else-if="imgSrc" :src="imgSrc" style="padding: var(--van-signature-padding);">
    <i v-else />
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import type { SignatureInstance } from 'vant';
import { Field as VanField, Signature as VanSignature } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useCommonSetup } from '../use';
import type { SignatureSlots, SubmitOption } from './types';
import { signatureEmitsPrivate as emits, signaturePropsPrivate as props } from './types';

const ratio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
function getSize(canvas: HTMLCanvasElement) {
    return { width: canvas.offsetWidth * ratio, height: canvas.offsetHeight * ratio };
}
/**
 * 绘制图片到 canvas 上
 * @param {object} opt - 绘制选项
 * @param {HTMLCanvasElement} opt.canvas - 待渲染的画布
 * @param {string} opt.src - 图片来源
 * @param {CanvasRenderingContext2D} [opt.ctx] - 画布上下文，若未提供则使用 canvas.getContext('2d') 获取
 * @param {() => boolean} [opt.allowPaint] - 是否允许绘制, 默认为 true
 */
function drawImage(opt: {
    /** 待渲染的画布 */
    canvas: HTMLCanvasElement | undefined;
    src: string | undefined;
    ctx?: CanvasRenderingContext2D | null;
    allowPaint?: () => boolean;
}) {
    const canvas = opt.canvas;
    if (!(canvas && opt.src)) return;
    const ctx = opt.ctx || canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
        if (opt.allowPaint?.() === false) return;
        const { width, height } = getSize(canvas);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width / ratio, height / ratio);
    };
    img.src = opt.src;
}
/** 释放 blob */
function revokeBlob(value: any) {
    typeof value === 'string' && value.slice(0, 5) === 'blob:' && URL.revokeObjectURL(value);
}

/**
 * @file 纯签名组件
 */
export default defineComponent({
    name: 'HSignaturePure',
    components: { VanField, VanSignature },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<SignatureSlots>,
    setup(props, ctx) {
        const signatureRef = useTemplateRef<SignatureInstance>('signatureRef');
        const plain = usePlain(props);
        plain.on('reset', () => reset);
        /** 将当前值转为图片地址 */
        const imgSrc = computed(() => props.format(plain.checked.value));
        watch(imgSrc, (value, oldValue) => oldValue && revokeBlob(oldValue));
        onBeforeUnmount(() => imgSrc.value && revokeBlob(imgSrc.value));
        /** 是否由用户触发 */
        const isUserChange = ref(false);
        /** 覆盖值更改事件 */
        function change(value: SubmitOption) {
            isUserChange.value = true;
            plain.change(props.valueFormat(value));
            nextTick(() => isUserChange.value = false);
        }
        onMounted(() => updateCanvasContent(imgSrc.value));
        watch(imgSrc, updateCanvasContent);
        /** 更新画布内容 */
        function updateCanvasContent(val: string | undefined) {
            if (isUserChange.value) return;
            // 当图片地址变化且非用户触发时, 说明外部值发生了变化, 此时需要重新绘制图片
            drawImage({
                ...getCanvas(),
                src: val,
                allowPaint: () => val === imgSrc.value,
            });
        }
        const { slotProps } = useCommonSetup(props, ctx, plain);
        const isResetting = ref(false);
        /** 清空事件 */
        function clear() {
            if (isResetting.value) return;
            plain.change(undefined);
        }
        /** 重置事件 */
        function reset() {
            if (!signatureRef.value) return;
            let _src = imgSrc.value;
            if (signatureRef.value.clear) {
                isResetting.value = true;
                nextTick(() => isResetting.value = false);
                signatureRef.value.clear();
            }
            // 兼容低版本的 VanSignature 组件，低版本没有 clear 方法
            else {
                const { canvas, ctx } = getCanvas();
                if (!(canvas && ctx)) return;
                const { width, height } = getSize(canvas);
                ctx.clearRect(0, 0, width, height);
                ctx.closePath();
                const bgColor = props.signatureProps?.backgroundColor;
                if (bgColor) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, width, height);
                }
            }
            // 重置后, 如果图片值未改变则无法触发 watch 回调, 需要主动重新绘制
            nextTick(() => _src === imgSrc.value && updateCanvasContent(_src));
        }
        /** 获取画布 */
        function getCanvas() {
            const canvas = signatureRef.value?.$el?.getElementsByTagName('canvas')[0] as HTMLCanvasElement | undefined;
            const ctx = canvas?.getContext('2d');
            return { canvas, ctx };
        }
        /** 签名结束事件 */
        function end() {
            props.submitAtEnd && signatureRef.value?.submit?.();
        }
        ctx.emit('load', plain);

        return {
            hyphenate,
            getNode,
            ...plain,
            change,
            slotProps,
            signatureRef,
            imgSrc,
            clear,
            end,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
