import { VNode } from 'vue';
import { ColumnNodeDataOptions } from '@/typings/ParamOptions';

type ScopedSlot = /* unresolved */ any;

export class ColumnNode {
  /**
   * 节点key
   */
  key: number;

  /**
   * 节点 label 名
   */
  label: string;

  /**
   * 节点内容
   */
  node: VNode | null;

  /**
   * 是否合并
   */
  merge: boolean;

  /**
   * 合并节点
   */
  scopedSlots: ScopedSlot | undefined;

  constructor() {
    this.key = -1;
    this.label = '';
    this.node = null;
    this.merge = false;
  }

  initData(data: ColumnNodeDataOptions) {
    this.key = data.key;
    this.label = data.label;
    this.node = data.node;
    this.merge = data.merge;
    this.scopedSlots = data.scopedSlots;

    return this;
  }
}

export default ColumnNode;
