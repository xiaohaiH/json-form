import type { usePlain } from '@xiaohaih/json-form-core';
import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';
import { pick } from '../src/utils';

/** 表单组件的常用属性 */
export function useCommonSetup<Props extends Record<string, any>, Context extends Record<string, any>>(props: Props, ctx: Context, plain: ReturnType<typeof usePlain>) {
    /** 插槽常用属性 */
    const slotProps = computed(() => ({ props, plain }));

    return { slotProps };
}

/**
 * 为选中值构建临时变量
 * 某些 UI 组件并不直接使用 modelValue, 而是内部维护一个变量
 * 当内部值发生变化, 而 modelValue 又立马重置为相同值时
 * 导致组件内部值无法同步 modelValue
 */
export function useTempChecked(checked: Ref<any>) {
    const tempChecked = ref(checked.value);
    // 监听外部值变化, 当第三方组件直接改变值时, 需要同步
    watch(checked, (val) => tempChecked.value = val);

    /**
     * 对 change 做特殊处理, 异步改变值
     * 防止存在默认值时, vant 组件清空值时
     * 内部马上重写会导致值更新了, ui 未更新
     */
    function change(value: any) {
        checked.value = tempChecked.value = value;
        tempChecked.value !== checked.value && nextTick(() => tempChecked.value = checked.value);
    }
    /**
     * 对 change 做特殊处理, 同步改变值
     * 临时变量直接等于值时, 无法得到 checked.value 最新的值
     * 因此等 checked.value 赋值后再等于其即可
     */
    function changeSync(value: any) {
        checked.value = value;
        tempChecked.value = checked.value;
    }

    return { tempChecked, change, changeSync };
}
