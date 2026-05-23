<template>
    <textarea v-if="type === 'textarea'" ref="inputRef" v-bind="inputAttrs" @focus="focusHandle" @blur="blurHandle" @keypress="keypressHandle" />
    <input v-else ref="inputRef" v-bind="inputAttrs" @focus="focusHandle" @blur="blurHandle" @keypress="keypressHandle">
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { inputSlotEmits as emits, inputSlotProps as props } from './types';

/**
 * @file 输入框 - 该组件提供 vant 输入框的样式, 便于覆盖 Field.input 插槽
 */
export default defineComponent({
    name: 'HInputSlot',
    components: { },
    inheritAttrs: false,
    props,
    emits,
    setup(props, ctx) {
        const id = '';
        const inputRef = ref<ComponentExposed<typeof HTMLInputElement | typeof HTMLTextAreaElement>>();
        const inputAttrs = computed(() => {
            const { rows, label, disabled, readonly } = props;
            return {
                ...ctx.attrs,
                'rows': rows !== undefined ? +rows : undefined,
                'aria-labelledby': label ? `${id}-label` : undefined,
                'data-allow-mismatch': 'attribute',
                'class': 'van-field__control',
                disabled,
                readonly,
                // onBlur,
                // onFocus,
                // onKeypress,
            };
        });

        function blur() {
            inputRef.value?.blur();
        }
        function focus() {
            inputRef.value?.focus();
        }
        function focusHandle(event: Event) {
            nextTick(adjustTextareaSize);
            // readonly not work in legacy mobile safari
            props.readonly && blur();
        };
        function blurHandle() {
            if (props.readonly) return;
            nextTick(adjustTextareaSize);
            resetScroll();
        }
        function keypressHandle(event: KeyboardEvent) {
            // const ENTER_CODE = 13;
            // if (event.keyCode === ENTER_CODE) {
            //     // trigger blur after click keyboard search button
            //     props.type === 'search' && blur();
            // }

        };

        const adjustTextareaSize = () => {
            const input = inputRef.value;
            if (props.type === 'textarea' && props.autosize && input) {
                resizeTextarea(input as HTMLInputElement, props.autosize);
            }
        };
        function resetScroll() {
            if (isIOS_) {
                setRootScrollTop(getRootScrollTop());
            }
        }

        const inBrowser = typeof window !== 'undefined';
        const isIOS = (): boolean =>
            inBrowser
                ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
                : false;
        const isIOS_ = isIOS();
        const isObject = (val: unknown): val is Record<any, any> =>
            val !== null && typeof val === 'object';

        function resizeTextarea(
            input: HTMLInputElement,
            autosize: true | {
                maxHeight?: number;
                minHeight?: number;
            },
        ) {
            const scrollTop = getRootScrollTop();
            input.style.height = 'auto';

            let height = input.scrollHeight;
            if (isObject(autosize)) {
                const { maxHeight, minHeight } = autosize;
                if (maxHeight !== undefined) {
                    height = Math.min(height, maxHeight);
                }
                if (minHeight !== undefined) {
                    height = Math.max(height, minHeight);
                }
            }

            if (height) {
                input.style.height = `${height}px`;
                // https://github.com/vant-ui/vant/issues/9178
                setRootScrollTop(scrollTop);
            }
        }

        type ScrollElement = Element | Window;
        function setScrollTop(el: ScrollElement, value: number) {
            if ('scrollTop' in el) {
                el.scrollTop = value;
            }
            else {
                el.scrollTo(el.scrollX, value);
            }
        }

        function getRootScrollTop(): number {
            return (
                window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0
            );
        }
        function setRootScrollTop(value: number) {
            setScrollTop(window, value);
            setScrollTop(document.body, value);
        }

        return {
            inputRef,
            inputAttrs,
            focusHandle,
            blurHandle,
            keypressHandle,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
