import type { ExtractPropTypes } from 'vue-demi';
import { computed, nextTick, onBeforeUnmount, ref, set as setAttr, unref, watch } from 'vue-demi';
import { set } from '../utils/index';
import type { CommonMethod } from './constant';

// /** 获取条件的初始值 */
// export function useValue<T extends Record<'value' | 'query', any>>(getValue: () => T) {
//     const setValue = ref<T['value']>();
//     const a = computed({
//         set(value: any) {
//             setValue.value = value;
//         },
//         get() {
//             const { value, query } = getValue();
//             if (value === undefined && setValue.value === undefined) return undefined;
//             return setValue.value === undefined
//                 ? typeof value === 'function' ? value({ query }) : value
//                 : setValue.value;
//         },
//     });
//     return a;
// }

/**
 * 转换当前事件循环内更新标识
 * @param {boolean} initialValue 初始状态
 */
export function useFlag(initialValue = true) {
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

/** 对赋值进行处理 - 防止 vue2 对新增属性不响应 */
export function vueSet<T extends object, K>(initial: T, path: string, value: K) {
    set(initial, path, value, setAttr);
}
