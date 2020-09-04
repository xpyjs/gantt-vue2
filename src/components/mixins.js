import {
  Variables,
  isUndefined,
  isBoolean,
  isFunction,
  formatDate,
  getDateInterval
} from "../utils";

export default {
  data() {
    return {
      rowRepeatClick: false
    };
  },

  computed: {
    todayLeft: function() {
      const today = new Date().setHours(0);
      const sd = new Date(formatDate(this.gd.start)).setHours(0);
      const m = getDateInterval(sd, today) / Variables.time.millisecondOfDay;
      return m * this.colWidth;
    },

    colWidth: function() {
      return this.pd.ganttOptions[Variables.key.columnWidth];
    },

    rowFlatData: function() {
      return this.gd.flatData;
    },

    contentHeight: function() {
      return this.gd.length * this.pd.rowHeight;
    },

    // column 和 slider 使用的展示数据
    scopeData: function() {
      if (isUndefined(this.dateFormat)) {
        return this.$parent.rowData.data;
      } else {
        const d = this.$parent.rowData.cloneData();
        const sl = this.$parent.rowData._opts["sl"];
        const el = this.$parent.rowData._opts["el"];
        const fmt = this.dateFormat ? this.dateFormat : "yyyy-MM-dd";
        d[sl] = formatDate(d[sl], fmt);
        d[el] = formatDate(d[el], fmt);

        return d;
      }
    },

    // column 和 slider 使用的展示数据
    textData: function() {
      if (Object.prototype.hasOwnProperty.call(this.scopeData, this.label)) {
        return this.scopeData[this.label];
      } else {
        return this.emptyData;
      }
    },

    // 行背景颜色，如果用户主动给出
    rowBackgroundColor: function() {
      return function(color = "#fff") {
        if (this.rowData) {
          const c = this.pd.levelColor[this.rowData.level] || color;
          return { "background-color": c };
        }
      };
    }
  },

  methods: {
    /**
     * 判断列是否需要合并的函数
     * @param {String | Boolean | Function} m
     * @param {Object} data
     * @returns {Boolean}
     */
    isMerge(m, data) {
      let merge = false;
      if (!isUndefined(m)) {
        if (isBoolean(m)) {
          merge = m;
        } else if (isFunction(m)) {
          merge = m(data);
        } else {
          if (m === "") {
            merge = true;
          }
        }
      }
      return merge;
    },

    /**
     * 单击一行，将当前行数据抛出，注意双击去重
     */
    onClickRow: function() {
      if (this.rowRepeatClick) {
        this.rowRepeatClick = false;
        return;
      } else {
        this.root.IFClickRow(this.rowData);
        this.rowRepeatClick = true;

        window.setTimeout(() => {
          this.rowRepeatClick = false;
        }, 500);
      }
    },

    /**
     * 双击一行，将当前行数据抛出
     */
    onDbClickRow: function() {
      this.root.IFDblClickRow(this.rowData);
    },

    onMouseEnterRow: function() {
      this.gd.hoverIndex = this.rowData.uindex;
    },

    onMouseLeaveRow: function() {
      this.gd.hoverIndex = -1;
    },

    // 渲染行
    renderRow: function(h, el, data) {
      // TODO: 优化加载数量
      const marginNumber = 5;
      const top = this.root.offsetTop - this.pd.rowHeight * marginNumber;
      const bottom = this.root.offsetBottom + this.pd.rowHeight * marginNumber;

      // TODO: 合并展开的动画可以在好一些
      return (
        <transition-group
          name="fade"
          enter-active-class="fade-in-right"
          leave-active-class="fade-out-right"
        >
          {data.map(item => {
            const offsetTop = item.uindex * this.pd.rowHeight;
            const condition = top < offsetTop && offsetTop < bottom;
            return h(el, {
              key: item.uuid,
              props: { rowData: condition ? item : null }
            });
          })}
        </transition-group>
      );
    },

    // 渲染行的装饰条，包括悬停条和选择条
    renderRowHoverStrip(h, width) {
      // 悬停条
      return this.gd.hoverIndex >= 0
        ? h("div", {
            class: { "gt-row-strip": true, "gt-row-hover": true },
            style: {
              width: `${width}px`,
              height: `${this.pd.rowHeight}px`,
              top: `${this.pd.headerHeight +
                this.pd.rowHeight * this.gd.hoverIndex}px`
            }
          })
        : null;
    },

    renderRowSelectStrip(h, width) {
      //选择条
      return this.gd.selectIndex >= 0
        ? h("div", {
            class: { "gt-row-strip": true, "gt-row-select": true },
            style: {
              width: `${width}px`,
              height: `${this.pd.rowHeight}px`,
              top: `${this.pd.headerHeight +
                this.pd.rowHeight * this.gd.selectIndex}px`
            }
          })
        : null;
    }
  }
};
