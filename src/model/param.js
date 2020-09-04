import { Variables, Errors, isArray, parseNumber } from "../utils";

/**
 * 每一个列的参数对象
 */
class CNode {
  constructor() {
    this.key = -1;
    this.label = "";
    this.node = null;
    this.merge = false;
    this.scopedSlots = null;

    return this;
  }

  initData(data) {
    this.key = data.key;
    this.label = data.label;
    this.node = data.node;
    this.merge = data.merge;
    this.scopedSlots = data.scopedSlots;

    return this;
  }
}

/**
 * 每一各表头的参数对象
 */
class THeader {
  constructor() {
    this.key = -1;
    this.label = "";
    this.text = "";
    this.width = 0;

    return this;
  }

  initData(data) {
    this.key = data.key;
    this.label = data.label;
    this.text = data.text;
    this.width = data.width;

    return this;
  }
}

/**
 * 项目的配置参数对象
 */
export class PD {
  constructor() {
    this._cns = [];
    this._sn = null;
    this._ths = [];
    this._ghs = [];
    this._cbw = 15;
    this._rh = Variables.size.defaultContentRowHeight;
    this._hh = Variables.size.defaultHeaderHeight;
    this.levelColor = [];
    this.expandWidth = 15;
    this.showCheckbox = false;
    this.showExpand = false;

    // 默认值
    this._gos = {
      [Variables.key.columnWidth]: Variables.size.defaultMinGanttColumnWidth,
      [Variables.key.showToday]: true,
      [Variables.key.showWeekend]: true,
      [Variables.key.header]: {
        [Variables.key.bgColor]: "",
        [Variables.key.borderColor]: "",
        [Variables.key.textColor]: ""
      },
      [Variables.key.body]: {
        [Variables.key.todayColor]: "lightblue",
        [Variables.key.weekendColor]: "lightgrey",
        [Variables.key.bgColor]: "",
        [Variables.key.borderColor]: "",
        [Variables.key.textColor]: ""
      }
    };
  }

  get colNodes() {
    return this._cns;
  }

  get sliderNode() {
    return this._sn;
  }

  get tableHeaders() {
    return this._ths;
  }

  get ganttHeaders() {
    return this._ghs;
  }

  get ganttOptions() {
    return this._gos;
  }

  get checkBoxWidth() {
    return this._cbw + 10;
  }

  set checkBoxWidth(w) {
    this._cbw = w;
  }

  get rowHeight() {
    return this._rh;
  }

  set rowHeight(h) {
    if (h < Variables.size.defaultMinContentRowHeight) {
      console.error(
        Errors.header,
        Errors.invalidProps,
        `rowHeight should be at least ${Variables.size.defaultMinContentRowHeight}.`
      );
    } else {
      this._rh = h;
    }
  }

  get headerHeight() {
    return parseNumber(this._hh);
  }

  set headerHeight(h) {
    if (h < Variables.size.defaultMinHeaderHeight) {
      console.error(
        Errors.header,
        Errors.invalidProps,
        `headerHeight should be at least ${Variables.size.defaultMinHeaderHeight}.`
      );
    } else {
      this._hh = h;
    }
  }

  _addCNode(data) {
    this.colNodes.push(new CNode().initData(data));
  }

  _addTHeader(data) {
    this.tableHeaders.push(new THeader().initData(data));
  }

  setNodes(nodes) {
    if (isArray(nodes)) {
      let colVnodeKey = 0;
      nodes
        .filter(v => {
          return (
            // 保留指定的组件
            v.componentOptions !== undefined &&
            v.componentOptions.Ctor.options !== undefined &&
            // 接受带label属性的column组件，label属性是必须的
            ((v.componentOptions.Ctor.options.name === Variables.name.column &&
              v.componentOptions.propsData !== undefined &&
              Object.prototype.hasOwnProperty.call(
                v.componentOptions.propsData,
                "label"
              )) ||
              // 接受slider组件且只保留最后一个
              v.componentOptions.Ctor.options.name === Variables.name.slider)
          );
        })
        .map(v => {
          // 分别对不同组件进行整理
          if (v.componentOptions.Ctor.options.name === Variables.name.column) {
            // 添加唯一key
            v.key = colVnodeKey;

            const label = v.componentOptions.propsData["label"];
            const width = parseNumber(
              v.componentOptions.propsData["width"],
              Variables.size.defaultTableColumnWidth
            );

            // 添加merge方法，将第一行的merge忽略
            let merge = v.componentOptions.propsData["merge"];
            if (v.key === 0) {
              merge = undefined;
            }

            this._addTHeader({
              key: colVnodeKey,
              label: label,
              text: v.componentOptions.propsData["name"] || label,
              width: width
            });

            this._addCNode({
              key: colVnodeKey++,
              label: label,
              node: v,
              merge: merge,
              scopedSlots: v.data.scopedSlots
            });
          } else if (
            // 保存slider。如果有多个，只渲染最后一个传入的slider
            v.componentOptions.Ctor.options.name === Variables.name.slider
          ) {
            this._sn = v;
          }
        });
    }
  }

  setGanttOptions(opt) {
    Object.assign(this.ganttOptions, opt);
  }

  setGanttHeaders(headers) {
    this.ganttHeaders.splice(0, this.ganttHeaders.length, ...headers);
  }
}
