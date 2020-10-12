import {
  isArray,
  isObject,
  Variables,
  createDate,
  uuid,
  compareDate,
  getDateOffset,
  isObjectValueEqual
} from "../utils";

/**
 * 每一条的数据格式
 */
export class Row {
  constructor() {
    this.uuid = uuid(12);
    this.data = null;
    this.index = 0;
    this.parentId = [];
    this.parentNode = null;
    this.level = 0;
    this.isExpand = true;
    this.start = null;
    this.end = null;
    this.children = [];
    this._opts = {};

    // 渲染使用
    this.uindex = 0;
  }

  initData(data, options) {
    const sl = options.startLabel || Variables.key.start;
    const el = options.endLabel || Variables.key.end;
    Object.assign(this._opts, { sl, el });

    this.isExpand = options.isExpand || true;

    const that = this;
    this.data = new Proxy(data, {
      get: function(obj, prop) {
        that.proxy(obj);
        return obj[prop];
      },
      set: function(obj, prop, value, receiver) {
        if (obj[prop] != value) {
          obj[prop] = value;
        }
        return Reflect.set(obj, prop, value, receiver);
      }
    });

    // 初始化
    this.proxy(this.data);
  }

  proxy(obj) {
    this.start = createDate(obj[this._opts["sl"]]);
    this.end = createDate(obj[this._opts["el"]]);
  }

  /**
   * 赋值起始日期，判断是否联动。如果联动，则先判断父节点，然后递归判断子节点
   * @param {Date} date 日期
   * @param {Boolean} linkage 联动
   */
  setStart(date, linkage = false) {
    // 首先判断起始日期不能大于结束日期
    if (
      compareDate(
        date,
        getDateOffset(this.end, -Variables.time.millisecondOfDay)
      ) === "r"
    )
      return;

    this.data[this._opts["sl"]] = date;

    if (!linkage) return;

    // 查看父节点
    let pNode = this.parentNode;
    while (pNode !== null) {
      if (compareDate(this.start, pNode.start) === "l") {
        // 赋值应该给data的日期数据赋值
        pNode.setStart(this.start);
      } else {
        break;
      }
      pNode = pNode.parentNode;
    }

    // 查看子节点
    this._setChildrenDate(this, "start");
  }

  setEnd(date, linkage = false) {
    // 首先判断起始日期不能大于结束日期
    if (
      compareDate(
        date,
        getDateOffset(this.start, Variables.time.millisecondOfDay)
      ) === "l"
    )
      return;

    this.data[this._opts["el"]] = date;

    if (!linkage) return;

    let pNode = this.parentNode;
    while (pNode !== null) {
      if (compareDate(this.end, pNode.end) === "r") {
        pNode.setEnd(this.end);
      } else {
        break;
      }
      pNode = pNode.parentNode;
    }

    // 查看子节点
    this._setChildrenDate(this, "end");
  }

  _setChildrenDate(node, key) {
    for (let i = 0; i < node.children.length; i++) {
      const c = node.children[i];
      if (key === "start") {
        if (compareDate(c.start, node.start) === "l") {
          c.setStart(node.start);
          this._setChildrenDate(c, key);
        }
      } else if (key === "end") {
        if (compareDate(c.end, node.end) === "r") {
          c.setEnd(node.end);
          this._setChildrenDate(c, key);
        }
      }
    }
  }

  isSame(obj) {
    return isObjectValueEqual(obj, this.data);
  }

  cloneData() {
    return this._clone(this.data);
  }

  _clone(data) {
    if (!isObject(data)) {
      return data;
    } else {
      var d = isArray(data) ? [] : {};
      for (var i in data) {
        d[i] = isObject(data[i]) ? this._clone(data[i]) : data[i];
      }
      return d;
    }
  }
}

// 生成键，使其对应变量伪私有化
// const _data = Symbol("d");
// const _originData = Symbol("o");

// 生成全局唯一id使用
let UID = 0;

/**
 * 整个gantt项目的数据结构，整理外部的数据
 */
export class GD {
  constructor() {
    this.data = [];
    this.originData = [];
    this.start = null;
    this.end = null;
    this._hierarchy = 0;

    // 渲染使用
    this.selectIndex = -1;
    this.hoverIndex = -1;

    // 可展示的数据条数
    this.length = 0;
  }

  /**
   * 获取整个数据的层级规模
   */
  get hierarchy() {
    // 获取时从0开始计算，所以返回时主动 +1
    return this._hierarchy + 1;
  }

  /**
   * 获取数据的规模，总条数
   */
  get capacity() {
    let len = 0;

    function _getLength(data) {
      data.forEach(item => {
        len++;

        if (item.children) {
          _getLength(item.children);
        }
      });
    }

    _getLength(this.data);

    return len;
  }

  initData(data, options = {}) {
    this.originData = data;
    this.data = this._createDataTree(data, [], options);
    // 初始化长度
    this.length = this.data.length;
  }

  _createDataTree(data, parentId, options = {}, level = 0, parentNode = null) {
    const r = [];
    for (let i = 0; i < data.length; i++) {
      r.push(
        this._createDataNode(data[i], i, parentId, level, parentNode, options)
      );
    }

    return r;
  }

  _createDataNode(data, index, parentId, level, parentNode, options = {}) {
    const item = new Row();
    item.initData(data, options);
    item.index = index;
    item.level = level;
    item.parentId = parentId;
    item.parentNode = parentNode;

    // 取最大最小值
    if (!this.start || compareDate(item.start, this.start) === "l") {
      this.start = item.start;
    }

    if (!this.end || compareDate(item.end, this.end) === "r") {
      this.end = item.end;
    }

    const p = [...parentId];
    p.push(index);
    if (isArray(data.children)) {
      item.children = this._createDataTree(
        data.children,
        p,
        options,
        level + 1,
        item
      );
    }

    // 计算数据结构的层级数量
    if (level > this._hierarchy) this._hierarchy = level;

    return item;
  }

  // eslint-disable-next-line no-unused-vars
  diffData(newData, options = {}, item = null) {
    this._diff(this.data, newData);

    // 更新选择条
    if (!item) return;
    const t = this.flatData.find(x => x.uuid === item.uuid);
    this.selectIndex = t?.uindex ?? -1;
  }

  _diff(originData, newData, parentNode = null) {
    let i = 0;
    while (i < newData.length) {
      if (i < originData.length && !originData[i].isSame(newData[i])) {
        if (i + 1 < originData.length && originData[i + 1].isSame(newData[i])) {
          // 删除一个
          originData.splice(i, 1);
        } else if (
          i + 1 < newData.length &&
          originData[i].isSame(newData[i + 1])
        ) {
          // 插入一个
          const item = this._createDataNode(
            newData[i],
            i,
            originData[i].parentId,
            originData[i].level,
            originData[i].parentNode,
            originData[i].options
          );
          originData.splice(i, 0, item);
        } else {
          const item = this._createDataNode(
            newData[i],
            i,
            originData[i].parentId,
            originData[i].level,
            originData[i].parentNode,
            originData[i].options
          );
          originData.splice(i, 1, item);
        }
      }

      // 新节点超出了原有节点，直接创建新的节点即可
      if (originData[i] === void 0) {
        const item = this._createDataNode(
          newData[i],
          i,
          parentNode ? [...parentNode.parentId, parentNode.index] : [],
          parentNode ? parentNode.level + 1 : 0,
          parentNode,
          parentNode ? parentNode.options : {}
        );
        originData.splice(i, 1, item);
      }

      this._diff(originData[i].children, newData[i].children, originData[i]);

      i++;
    }

    // 如果循环完成，旧数据后面还有，则全部删除
    if (originData[i]) {
      originData.splice(i, originData.length);
    }
  }

  get flatData() {
    UID = 0;
    const arr = [];
    this._flatten(this.data, arr);
    this.length = arr.length;
    return arr;
  }

  _flatten(data, arr) {
    for (let i = 0; i < data.length; i++) {
      data[i].uindex = UID++;
      arr.push(data[i]);

      if (data[i].isExpand && isArray(data[i].children)) {
        this._flatten(data[i].children, arr);
      }
    }
  }
}
