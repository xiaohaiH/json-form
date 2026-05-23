import type { ExtractPropTypes, Ref } from 'vue-demi';
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, set as setAttr, unref, watch } from 'vue-demi';
import { noop, set } from '../utils/index';
import type { CommonMethod, EventsWithInstance } from './constant';

export type Tail<T extends any[]> = T extends [infer _, ...infer Rest] ? Rest : T;

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

/**
 * 事件包装器
 */
export function useCreateEmitter<Events extends Record<string, (...args: any[]) => any>>() {
    let events: {
        [K in keyof Events]?: [ReturnType<typeof getCurrentInstance>, ((...args: Parameters<Events[K]>) => ReturnType<Events[K]>)][]
    } = {};
    /**
     * 监听事件
     * @param {ReturnType<typeof getCurrentInstance>} instance vue 实例
     * @param {string} type 监听事件类型
     * @param {(...args: any[]) => any} fn 事件逻辑执行前触发, 可返回一个函数在逻辑执行后执行
     * @return {() => void} 移除监听的函数
     */
    function on<K extends keyof Events>(instance: ReturnType<typeof getCurrentInstance>, type: K, fn: Events[K]) {
        events[type] || (events[type] = []);
        events[type].push([instance, fn]);
        return () => off(instance, type, fn);
    }
    /**
     * 移除事件, 不传回调删除所有该类型的事件
     * @param {ReturnType<typeof getCurrentInstance>} instance vue 实例
     * @param {string} type 监听事件类型
     * @param {(...args: any[]) => any} [fn] 监听事件回调函数
     */
    function off<K extends keyof Events>(instance: ReturnType<typeof getCurrentInstance>, type: K, fn?: Events[K]) {
        if (!events[type]) return;
        if (fn) {
            events[type] = events[type].filter(([ins, cb]) => (ins !== instance && cb !== fn));
        }
        else {
            instance ? events[type] = events[type].filter(([ins]) => (ins !== instance)) : delete events[type];
        }
    }
    /** 触发事件并返回回调函数的返回值 */
    function emit<K extends keyof Events>(type: K, ...args: Parameters<Events[K]>) {
        return events[type]?.map(([ins, cb]) => cb(...args)) || [];
    }
    /** 清空所有事件 */
    function clear(instance?: ReturnType<typeof getCurrentInstance>) {
        instance ? Object.keys(events).forEach((type) => off(instance, type)) : events = {};
    }
    onBeforeUnmount(clear);

    return { on, off, emit, clear };
}

/**
 * 包装监听事件, 在 cb 执行时, 将 vue 实例作为首参传入
 * @param {Function} cb 监听的回调事件
 * @return {Function}
 */
export function useWithCurrentInstance<T extends (ins: ReturnType<typeof getCurrentInstance>, ...args: any[]) => any>(cb: T) {
    const currentInstance = getCurrentInstance();
    return function emitCurrentInstanceOn(...args: Tail<Parameters<T>>): ReturnType<T> {
        return cb(currentInstance, ...args);
    };
}

/**
 * 通用的事件处理方法
 * @param {object} wrapper 实例
 */
export function useEmitter<T extends { emitterWithInstance: EventsWithInstance }>(wrapper: T | undefined) {
    const emitter = {
        /** 监听事件 - 将事件绑定到当前组件的生命周期上 */
        on: useWithCurrentInstance(wrapper?.emitterWithInstance.on || eventNoop),
        /** 解除监听事件 - 将事件绑定到当前组件的生命周期上 */
        off: useWithCurrentInstance(wrapper?.emitterWithInstance.off || noop),
        /** 删除所有的监听事件 - 将事件绑定到当前组件的生命周期上 */
        clear: useWithCurrentInstance(wrapper?.emitterWithInstance.clear || noop),
    };
    onBeforeUnmount(emitter.clear);
    return emitter;
}

function eventNoop() {
    return noop;
}
