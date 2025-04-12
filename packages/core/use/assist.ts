import type { ExtractPropTypes, MaybeRef } from 'vue-demi';
import { computed, nextTick, onBeforeUnmount, ref, unref, watch } from 'vue-demi';
import type { CommonMethod } from './constant';
import type { commonProps } from './share';

/** 获取条件的初始值 */
export function useValue<T extends Record<'value' | 'query', any>>(getValue: () => T) {
    const setValue = ref<T['value']>();
    const a = computed({
        set(value: any) {
            setValue.value = value;
        },
        get() {
            const { value, query } = getValue();
            if (value === undefined && setValue.value === undefined) return undefined;
            return setValue.value === undefined
                ? typeof value === 'function' ? value({ query }) : value
                : setValue.value;
        },
    });
    return a;
}

/**
 * 转换当前事件循环内更新标识
 * @param {boolean} initialValue 初始状态
 */
export function useDisableInCurrentCycle(initialValue = true) {
    /** 是否允许改变 */
    const flag = ref(initialValue);
    /** 禁止改变 */
    const updateFlag = () => {
        flag.value = !initialValue;
        nextTick(() => {
            flag.value = initialValue;
        });
    };
    return { flag, updateFlag };
}
