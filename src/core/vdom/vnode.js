/* @flow */

export default class VNode {
  tag: string | void; // 元素节点名称
  data: VNodeData | void; //
  children: ?Array<VNode>; // 子节点
  text: string | void; // 文本节点的文本内容
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope 当前组件的Vue.js实例
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void; // 组件节点的选项参数
  componentInstance: Component | void; // component instance // 组件的实例, 也是vue.js的实例, 在Vue.js中，每个组件都是一个Vue.js实例
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node // 是否是静态节点
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder? 是否是注释节点
  isCloned: boolean; // is a cloned node? // 是否是克隆节点
  isOnce: boolean; // is a v-once node? // 是否只渲染一次的节点
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functioanl scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

// 注释节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

// 文本节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode, deep?: boolean): VNode {
  const componentOptions = vnode.componentOptions
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  // 唯一区别
  cloned.isCloned = true
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true)
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true)
    }
  }
  return cloned
}

export function cloneVNodes (vnodes: Array<VNode>, deep?: boolean): Array<VNode> {
  const len = vnodes.length
  const res = new Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep)
  }
  return res
}
