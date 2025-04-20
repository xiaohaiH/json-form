/**
 * 排序组件工具
 *
 * 提供对表单组件子节点进行排序功能的实现。
 * 通过指定的排序索引，可以调整表单项的展示顺序。
 */
import { hasOwn } from '@xiaohaih/json-form-core';
// @ts-expect-error 忽视类型错误, 此文件未被使用
import type { FunctionalComponent, SetupContext, VNode, VNodeChild, VNodeNormalizedChildren } from 'vue';

/**
 * 排序组件属性接口
 * 定义排序组件所需的配置项
 */
interface SortComponentProps {
    /** 禁用排序 */
    disabled?: boolean;
}

/**
 * VNode 排序组件
 *
 * 函数式组件，用于对子节点进行自定义排序
 * 根据子组件的conditionSortIndex属性对内容进行排序
 *
 * @param {SortComponentProps} props - 组件属性
 * @param {Omit<SetupContext<{}>, 'expose'>} context - 组件上下文
 * @returns {VNode[] | undefined} 排序后的节点数组或原始内容
 */
function SortComponent(props: SortComponentProps, context: Omit<SetupContext<{}>, 'expose'>) {
    // 如果禁用排序，直接返回默认插槽内容
    if (props.disabled) return context.slots.default?.();

    // 收集所有子节点
    const vNodes: (VNodeNormalizedChildren | VNodeChild)[] = [];
    context.slots.default?.().forEach((o) => {
        if (!o.children) return;
        Array.isArray(o.children)
            ? o.children.forEach((v) => {
                    vNodes.push(v);
                })
            : vNodes.push(o.children);
    });

    // 根据排序值进行排序并返回
    return vNodes.sort((a, b) => getSortValue(a) - getSortValue(b));
}

/**
 * 获取节点的排序值
 *
 * 从VNode的props中获取排序索引值，支持驼峰和连字符命名
 *
 * @param {any} vnode - 虚拟节点
 * @returns {number} 排序索引值，默认为0
 */
function getSortValue(vnode: any) {
    if (!vnode?.props) return 0;
    return (
        (hasOwn(vnode.props, 'conditionSortIndex')
            ? Number(vnode.props.conditionSortIndex)
            : Number(vnode.props['condition-sort-index'])) || 0
    );
}

// 定义组件接收的属性
SortComponent.props = {
    /** 是否禁用排序组件 */
    disabled: { type: Boolean },
};

export { SortComponent };
