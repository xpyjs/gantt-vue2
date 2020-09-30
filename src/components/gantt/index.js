import "./index.styl";
import { Variables, createDate } from "../../utils";
import Mixins from "../mixins";

import Header from "./header";
import Row from "./row";
import MoreBtn from "../common/icons/moreBtn.vue";

export default {
  name: Variables.name.gantt,

  props: {
    tableWidth: Number,
    ganttWidth: Number,
    rowData: Array
  },

  beforeCreate() {},

  created() {
    this.ganttResizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.ganttWrapWidth = entry.contentRect.width;
      }
    });
  },

  beforeMount() {
    // 动态添加功能按钮，顺序：右 → 左
    this.moreButtons = [
      { name: "operation", action: this.handleClickOperationBtn },
      { name: "today", action: this.handleClickTodayBtn }
    ];
  },

  mounted() {
    this.rootWidth = this.root.$el.clientWidth;
    this.ganttResizeObserver.observe(this.$refs["gantt-content-wrap"]);
    this.ganttWrapWidth = this.$refs["gantt-content-wrap"].offsetWidth;
  },

  beforeDestroy() {},

  destroyed() {
    this.moreButtons = [];
    this.ganttResizeObserver = null;
  },

  inject: ["pd", "gd", "root"],

  mixins: [Mixins],

  data() {
    return {
      rootWidth: 0,
      showMoreHandleArea: false,
      moreButtons: [],
      ganttWrapWidth: 0,
      ganttResizeObserver: null
    };
  },

  computed: {
    btnMarginTop: function() {
      return this.pd.headerHeight;
    },

    btnMarginLeft: function() {
      return this.rootWidth - this.tableWidth;
    },

    btnRightPos: function() {
      return this.ganttWrapWidth - this.btnMarginLeft - 45;
    },

    isTodayInArea: function() {
      const today = createDate().getTime();
      const sd = createDate(this.pd.ganttHeaders[0]).setHours(0);
      const ed = createDate(
        this.pd.ganttHeaders[this.pd.ganttHeaders.length - 1]
      ).setHours(24);

      if (today < sd || today > ed) {
        return false;
      }

      return true;
    },

    weekendList: function() {
      const r = [];
      if (!this.pd.ganttOptions[Variables.key.showWeekend]) return r;

      const sd = createDate(this.gd.start);
      let d = sd.getDay();
      let i = 0;

      // start is Sunday
      if (d === 0) {
        r.push(d);
        d += 6;
        i += 6;
      }

      // start is work day
      while (d > 0 && d < 6) {
        d++;
        i++;
      }

      // Cycle to find Saturday and Sunday
      while (i * this.colWidth < this.ganttWidth) {
        r.push(i);
        r.push(++i);
        ++d;
        d += 6;
        i += 6;
      }

      return r;
    }
  },

  watch: {},

  methods: {
    /**
     * 点击跳转到今日按钮
     */
    handleClickTodayBtn: function() {
      if (!this.isTodayInArea) {
        // 今日不在范围内，无法跳转
        this.root.INoTodayError();
        return;
      }

      // 日期在目标右侧
      let left = 0,
        right = 0;

      if (this.$el.scrollLeft < this.todayLeft) {
        // 日期在右侧
        right = this.todayLeft - this.$el.clientWidth / 3;
      } else {
        // 日期在左侧
        left = Math.abs(this.$el.clientWidth / 6 - this.todayLeft);
      }

      // 滚动动画，ease-in模式
      if (left && right) return;
      const that = this;

      const duration = 1000;
      const distance = left || right;
      let oldTimestamp = null;
      let scrollX = 0;
      let oldLeft; // 初始不定义，保证第一次不会匹配

      function step(newTimestamp) {
        if (oldTimestamp !== null) {
          // if duration is 0 scrollX will be -Infinity
          if (
            that.$el.scrollLeft < left ||
            (right > 0 && that.$el.scrollLeft >= right) ||
            oldLeft === that.$el.scrollLeft
          )
            return;

          let x = (distance * (newTimestamp - oldTimestamp)) / duration;
          if (left) {
            scrollX -= x;
          } else if (right) {
            scrollX += x;
          } else {
            return;
          }
          oldLeft = that.$el.scrollLeft;
          that.$el.scrollLeft += scrollX;
        }
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    },

    /**
     * 点击功能区按钮
     */
    handleClickOperationBtn: function() {
      this.$emit("openOperationDrawer");
    },

    handleMouseWheel: function() {
      this.$emit("ganttScroll");
    },

    handleClickMore: function() {
      if (!this.showMoreHandleArea) {
        this.showMoreHandleTimeout = setTimeout(() => {
          this.showMoreHandleArea = true;
        }, 300);
      }
    },

    handleHoverInMore: function() {
      this.handleClickMore();
    },

    handleHoverOutMore: function() {
      if (this.showMoreHandleTimeout) {
        clearTimeout(this.showMoreHandleTimeout);
        this.showMoreHandleTimeout = null;
      }
      this.showMoreHandleArea = false;
    }

    // beforeEnterTransition: function(el) {
    //   el.style = "margin-left: 100px";
    // },

    // enterTransition: function(el) {
    //   el.style = "margin-left: 0";
    //   el.style = "transition all 0.5s";
    // },

    // afterEnterTransition: function(el) {
    //   el.style = "margin-left: 0";
    // }
  },

  components: {
    [Header.name]: Header,
    [Row.name]: Row,
    [MoreBtn.name]: MoreBtn
  },

  render(h) {
    return h(
      "div",
      {
        ref: "gantt-content-wrap",
        class: { "gt-gantt-content-wrap": true },
        style: {
          "--table-width": `${this.tableWidth}px`
        },
        on: {
          mousewheel: this.handleMouseWheel,
          DOMMouseScroll: this.handleMouseWheel,
          scroll: this.handleMouseWheel
        }
      },
      [
        // 操作按钮
        h(
          "div",
          {
            class: { "gt-gantt-handle-btn": true },
            style: {
              "margin-top": `${this.btnMarginTop}px`,
              "margin-left": `${this.btnMarginLeft}px`,
              transform: `translate(${this.btnRightPos}px, 15px)`
            },
            on: {
              click: this.handleClickMore,
              mouseenter: this.handleHoverInMore,
              mouseleave: this.handleHoverOutMore
            }
          },
          [
            <MoreBtn name="more" size={30} turn style={{ "z-index": 99 }} />,
            <transition
              name="fade"
              enter-active-class="fade-in-right"
              leave-active-class="fade-out-right"
            >
              {/* TODO: 希望是展开和收缩样式 */}
              {this.showMoreHandleArea
                ? h(
                    "div",
                    {
                      class: { "gt-gantt-more-btn-area": true },
                      style: {
                        right: `${30}px`
                      }
                    },
                    this.moreButtons.map(btn => {
                      return (
                        <MoreBtn
                          size={30}
                          name={btn.name}
                          style={{ "margin-right": "10px" }}
                          on-click={btn.action}
                        />
                      );
                    })
                  )
                : null}
            </transition>
          ]
        ),

        h(Header.name, {
          style: { width: `${this.ganttWidth}px` }
        }),

        h(
          "div",
          {
            class: { "gt-gantt-row-wrap": true },
            style: {
              width: `${this.ganttWidth}px`,
              height: `${this.contentHeight}px`
            }
          },
          [
            this.renderRow(h, Row.name, this.rowData),
            // 今天时间线
            this.isTodayInArea && this.pd.ganttOptions[Variables.key.showToday]
              ? h("div", {
                  class: { "gt-today-line": true },
                  style: {
                    left: `${this.todayLeft}px`,
                    width: `${this.colWidth}px`,
                    height: `${this.contentHeight}px`,
                    "background-color": this.pd.ganttOptions[
                      Variables.key.body
                    ][Variables.key.todayColor]
                  }
                })
              : null,

            // 周末线
            this.weekendList.map(item => {
              return h("div", {
                class: { "gt-weekend-line": true },
                style: {
                  left: `${item * this.colWidth}px`,
                  width: `${this.colWidth}px`,
                  height: `${this.contentHeight}px`,
                  "background-color": this.pd.ganttOptions[Variables.key.body][
                    Variables.key.weekendColor
                  ]
                }
              });
            })
          ]
        ),

        this.renderRowHoverStrip(h, this.ganttWidth),
        this.renderRowSelectStrip(h, this.ganttWidth)
      ]
    );
  }
};
