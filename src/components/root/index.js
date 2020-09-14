import "./index.styl";
import {
  Variables,
  Errors,
  parseNumber,
  getDateInterval,
  getDateOffset,
  dateList
} from "../../utils";
import { GD, PD } from "../../model";

import TableContent from "../table";
import GanttContent from "../gantt";
import OperationDrawer from "../drawer/operationDrawer";

export default {
  name: Variables.name.root,

  props: {
    // 数据列表
    data: {
      type: Array,
      default: () => []
    },

    // 数据索引的label，应当确保它是唯一的，如果不是，则会引起渲染错误。
    dataIndex: {
      type: String,
      required: true,
      validator: v => {
        if (!v) {
          throw Errors.header +
            Errors.invalidProps +
            "Data index should be an valid string.";
        }
        return !!v;
      }
    },

    // 数据中起始日期的label，默认值：startDate，如果找不到，则不会渲染甘特条
    startKey: {
      type: String,
      default: Variables.key.start
    },

    // 数据中截止日期的label，默认值：endDate。如果找不到，同时没有起始日期，则不会渲染甘特条
    endKey: {
      type: String,
      default: Variables.key.end
    },

    // 接收一个表头高度，应该保证大于30，默认值为60
    headerHeight: {
      type: [Number, String],
      default: Variables.size.defaultHeaderHeight,
      validator: v => {
        const r = parseNumber(v) >= Variables.size.defaultMinHeaderHeight;
        if (!r) {
          throw Errors.header +
            Errors.invalidProps +
            `headerHeight should be at least ${Variables.size.defaultMinHeaderHeight}.`;
        }
        return r;
      }
    },

    // 接收一个内容的行高，应该保证大于20，默认行高30（含1px的border）
    rowHeight: {
      type: [Number, String],
      default: Variables.size.defaultContentRowHeight,
      validator: v => {
        const minR =
          parseNumber(v) >= Variables.size.defaultMinContentRowHeight;
        if (!minR) {
          throw Errors.header +
            Errors.invalidProps +
            `rowHeight should be at least ${Variables.size.defaultMinContentRowHeight}.`;
        }

        const maxR =
          parseNumber(v) <= Variables.size.defaultMaxContentRowHeight;
        if (!maxR) {
          throw Errors.header +
            Errors.invalidProps +
            `rowHeight should be no more than ${Variables.size.defaultMaxContentRowHeight}.`;
        }
        return minR && maxR;
      }
    },

    // 边框的尺寸，0为不显示，默认为1
    border: {
      type: Number,
      default: 1
    },

    // 是否显示复选框，默认为隐藏
    showCheckbox: {
      type: Boolean
    },

    // 是否显示展开按钮，如果为否，则全部展开。默认为是
    showExpand: {
      type: Boolean,
      default: true
    },

    // 展开所有数据，默认展开。仅当传入了 `showExpand` 才生效
    expandAll: {
      type: Boolean,
      default: true
    },

    // 甘特图的每一列宽度
    ganttColumnWidth: {
      type: [Number, String],
      default: Variables.size.defaultMinGanttColumnWidth,
      validator: v => {
        const minR =
          parseNumber(v) >= Variables.size.defaultMinGanttColumnWidth;
        if (!minR) {
          throw Errors.header +
            Errors.invalidProps +
            `ganttColumnWidth should be at least ${Variables.size.defaultMinGanttColumnWidth}.`;
        }

        const maxR =
          parseNumber(v) <= Variables.size.defaultMaxGanttColumnWidth;
        if (!maxR) {
          throw Errors.header +
            Errors.invalidProps +
            `ganttColumnWidth should be no more than ${Variables.size.defaultMaxGanttColumnWidth}.`;
        }

        return minR && maxR;
      }
    },

    // 显示甘特图的今日线
    showToday: {
      type: Boolean,
      default: true
    },

    // 显示甘特图的周末背景
    showWeekend: {
      type: Boolean,
      default: true
    },

    levelColor: {
      type: Array,
      default: () => {
        return [];
      }
    },

    headerStyle: {
      type: Object,
      defalut: () => {
        return {};
      }
    },

    bodyStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  beforeCreate() {},

  created() {
    // 处理数据
    this.gd.initData(this.data, this.dataOptions);

    // 处理shot组件
    this.pd.setNodes(this.$slots.default);

    // 保存其他参数
    this.pd.showCheckbox = this.showCheckbox;
    this.pd.showExpand = this.showExpand;
    this.pd.headerHeight = this.headerHeight;
    this.pd.rowHeight = this.rowHeight;
    this.pd.levelColor = this.levelColor;
    this.pd.setGanttOptions({
      [Variables.key.columnWidth]: this.ganttColumnWidth,
      [Variables.key.showToday]: this.showToday,
      [Variables.key.showWeekend]: this.showWeekend,
      [Variables.key.header]: this.headerStyle || {},
      [Variables.key.body]: this.bodyStyle || {}
    });
  },

  beforeMount() {
    this.ganttResizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.initGanttWidth = entry.contentRect.width;
        this.setHeaders();
      }
    });
  },

  mounted() {
    this.rootHeight = this.$el.clientHeight;
    this.ganttResizeObserver.observe(this.$refs.ganttContent.$el);
  },

  updated() {
    this.scrollBarHeight =
      this.$refs.tableContent.$el.clientHeight -
      this.$refs.ganttContent.$el.clientHeight;
  },

  beforeDestroy() {},

  destroyed() {
    this.ganttResizeObserver = null;
  },

  provide() {
    return {
      gd: this.gd,
      pd: this.pd,
      root: this
    };
  },

  data() {
    return {
      gd: new GD(),
      pd: new PD(),
      initGanttWidth: 0,
      ganttResizeObserver: null,
      columnSliderLeft: 0,
      columnSliderVisible: false,
      scrollBarHeight: 17,
      offsetTop: 0,
      rootHeight: 500,
      showOperationDrawer: false,
      showMask: false
    };
  },

  computed: {
    dataOptions: function() {
      const opt = {};
      opt.isExpand = this.showExpand ? this.expandAll : true;
      opt.startLabel = this.startKey;
      opt.endLabel = this.endKey;
      return opt;
    },

    tableWidth: function() {
      return this.pd.tableHeaders.reduce((p, x) => p + x.width, 0);
    },

    ganttWidth: function() {
      return (
        this.pd.ganttHeaders.length *
        this.pd.ganttOptions[Variables.key.columnWidth]
      );
    },

    offsetBottom: function() {
      return this.offsetTop + this.rootHeight;
    },

    realBorder: function() {
      return parseNumber(this.border, 1);
    },

    rowFlatData: function() {
      return this.gd.flatData;
    }
  },

  watch: {
    data: function(nv) {
      this.gd.diffData(nv, this.dataOptions);
      this.setHeaders();
    }
  },

  methods: {
    setHeaders() {
      const d =
        getDateInterval(this.gd.start, this.gd.end) /
        Variables.time.millisecondOfDay;

      let end = this.gd.end;
      if (
        d * this.pd.ganttOptions[Variables.key.columnWidth] <
        this.initGanttWidth
      ) {
        const offset =
          (this.initGanttWidth -
            d * this.pd.ganttOptions[Variables.key.columnWidth]) /
          this.pd.ganttOptions[Variables.key.columnWidth];

        end = getDateOffset(end, offset * Variables.time.millisecondOfDay);
      }

      this.pd.setGanttHeaders(dateList(this.gd.start, end));
    },

    handleGanttScroll: function() {
      this.$nextTick(() => {
        this.offsetTop = this.$refs.ganttContent.$el.scrollTop;
        this.$refs.tableContent.$el.scrollTop = this.$refs.ganttContent.$el.scrollTop;
      });
    },

    handleTableScroll: function(delta) {
      this.$nextTick(() => (this.$refs.ganttContent.$el.scrollTop += delta));
    },

    handleOpenOperationDrawer: function() {
      this.showMask = true;
      this.showOperationDrawer = true;
    },

    /**
     * 点击遮罩层，表示需要取消打开的顶层对话框，这里将所有对话框的显示都置为false即可
     */
    handleClickMask: function() {
      this.showOperationDrawer = false;
      this.showMask = false;
    },

    /**
     * 移动表头宽度，重载位移线的left
     * @param {Number} offset
     */
    handleMoveColumnSlider: function(offset) {
      if (this.columnSliderVisible === false) {
        this.columnSliderVisible = true;
      }
      this.columnSliderLeft = offset - this.$el.offsetLeft;
    },

    /**
     * 隐藏位移线
     */
    handleColumnSliderHidden: function() {
      this.columnSliderVisible = false;
    },

    /**
     * 处理整个表格的右侧拉伸线
     * @param {Event} e
     */
    handleTableSliderMouseDown: function(e) {
      let offset = 0;
      const srcX = e.pageX;
      const w = this.pd.tableHeaders[this.pd.tableHeaders.length - 1].width;

      document.onmousemove = e => {
        let targetX = e.pageX;
        // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
        if (targetX < 0) {
          targetX = 0;
        }

        // 判断最大值，最大总宽度要给甘特留出一定空间
        const space = 100;
        const originAllWidth = this.pd.tableHeaders.reduce(
          (res, head) => res + head.width,
          0
        );
        const diffWidth = targetX - srcX;
        if (originAllWidth + diffWidth > this.$el.clientWidth - space) {
          return;
        }

        // 判断表格宽度的最小值
        if (w + targetX - srcX > Variables.size.defaultMinTableColumnWidth) {
          // 赋差值
          offset = targetX - srcX;
          this.handleMoveColumnSlider(targetX);
        }
      };

      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
        this.pd.tableHeaders[this.pd.tableHeaders.length - 1].width += offset;
        this.handleColumnSliderHidden();
      };
    },

    // ===== 外部接口 =====
    /**
     * 单击行
     */
    IFClickRow: function(data) {
      this.gd.selectIndex = data.uindex;
      this.$emit("row-click", { ...data.data });
    },

    /**
     * 双击行
     */
    IFDblClickRow: function(data) {
      this.$emit("row-dbl-click", { ...data.data });
    },

    /**
     * 点击checkbox
     */
    IFCheckedRow: function(state, data) {
      this.$emit("row-checked", state, { ...data.data });
    },

    /**
     * 移动甘特滑块
     * @param {Row} data
     */
    IFMoveSlider: function(data) {
      // 抛出接口事件
      this.$emit("move-slider", { ...data.data });
    },

    /**
     * 如果 "今天" 不在甘特范围内，跳转时触发该异常
     */
    INoTodayError: function() {
      this.$emit("no-today-error");
    }
  },

  components: {
    [TableContent.name]: TableContent,
    [GanttContent.name]: GanttContent,
    [OperationDrawer.name]: OperationDrawer
  },

  render(h) {
    return h(
      "div",
      {
        class: { "gt-root": true },
        style: {
          "--root-border": `${this.realBorder}px`
        }
      },
      [
        // 拖动表头大小时的位移线
        h("div", {
          class: { "gt-column-slider-line": true },
          style: {
            left: `${this.columnSliderLeft}px`,
            visibility: this.columnSliderVisible ? "visible" : "hidden"
          }
        }),

        // 表格右侧的移动线
        h("div", {
          class: { "gt-table-slider-line": true },
          style: {
            left: `${this.tableWidth - 2}px`
          },
          on: {
            mousedown: this.handleTableSliderMouseDown
          }
        }),

        h(TableContent.name, {
          ref: "tableContent",
          props: {
            tableWidth: this.tableWidth,
            rowData: this.rowFlatData,
            scrollBarHeight: this.scrollBarHeight
          },
          on: {
            tableScroll: this.handleTableScroll
          }
        }),
        h(GanttContent.name, {
          ref: "ganttContent",
          props: {
            tableWidth: this.tableWidth,
            ganttWidth: this.ganttWidth,
            rowData: this.rowFlatData
          },
          on: {
            ganttScroll: this.handleGanttScroll,
            openOperationDrawer: this.handleOpenOperationDrawer
          }
        }),

        // 操作抽屉
        h(OperationDrawer.name, {
          props: { showDrawer: this.showOperationDrawer }
        }),

        // 整体的遮罩层
        h("div", {
          class: {
            "gt-mask-show": this.showMask,
            "gt-mask-hide": !this.showMask
          },
          on: { click: this.handleClickMask }
        })
      ]
    );
  }
};
