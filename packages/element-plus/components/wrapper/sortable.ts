import { hasOwn } from '@xiaohaih/json-form-core';
import { Fragment } from 'vue';
import type { SetupContext, VNode } from 'vue';

interface SortComponentProps {
    /** 禁用排序 */
    disabled?: boolean;
}

/** VNode 排序组件 */
function SortComponent(props: SortComponentProps, context: Omit<SetupContext<{}>, 'expose'>) {
    if (props.disabled) return context.slots.default?.();
    const vNodes: VNode[] = [];
    context.slots.default && getRealNode(context.slots.default(), vNodes);
    return vNodes.sort((a, b) => getSortValue(a) - getSortValue(b));
}
/** 获取真实 VNode(排除 Fragment 节点) */
function getRealNode(nodes: VNode[], arr: VNode[]) {
    nodes.forEach((o) => {
        if (o.type === Fragment) {
            o.children && getRealNode(o.children as any, arr);
        }
        else {
            arr.push(o);
        }
    });
}
/** 获取排序的值 */
function getSortValue(vnode: any) {
    if (!vnode?.props) return 0;
    return (
        (hasOwn(vnode.props, 'conditionSortIndex')
            ? Number(vnode.props.conditionSortIndex)
            : Number(vnode.props['condition-sort-index'])) || 0
    );
}

SortComponent.props = {
    /** 是否禁用排序组件 */
    disabled: { type: Boolean },
};

export { SortComponent };
