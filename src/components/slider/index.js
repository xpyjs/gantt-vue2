import "./index.styl";
import {
  Variables,
  getDateInterval,
  formatDate,
  getDateOffset,
  compareDate
} from "../../utils";
import Mixins from "../mixins";

export default {
  name: Variables.name.slider,

  props: {
    label: String,
    dateFormat: String,
    flat: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: "lightgreen"
    },
    // left, center, right
    alignment: {
      type: String,
      default: "left"
    },
    move: {
      type: Boolean,
      default: false
    },
    resizeLeft: {
      type: Boolean,
      default: false
    },
    resizeRight: {
      type: Boolean,
      default: false
    },
    emptyData: {
      type: String,
      default: Variables.noData
    },

    linkedResize: Boolean
  },

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  destroyed() {},

  inject: ["pd", "gd", "root"],

  mixins: [Mixins],

  data() {
    return {
      showCtrlChunk: false
    };
  },

  computed: {
    realAlignment: function() {
      switch (this.alignment) {
        case "right":
          return "flex-end";
        case "center":
          return "center";
        default:
          return "flex-start";
      }
    },

    /**
     * 计算滑块的宽度
     */
    sliderWidth: function() {
      return (
        (getDateInterval(this.$parent.rowData.start, this.$parent.rowData.end) /
          Variables.time.millisecondOfDay) *
        this.pd.ganttOptions[Variables.key.columnWidth]
      );
    },

    /**
     * 计算滑块的初始偏移量
     */
    sliderLeft: function() {
      // 最左侧一定是一个整天的宽度，将时间调整为0时，保证没有位移。非0会产生位移
      const sd = new Date(formatDate(this.gd.start)).setHours(0);
      return (
        (getDateInterval(sd, this.$parent.rowData.start) /
          Variables.time.millisecondOfDay) *
        this.pd.ganttOptions[Variables.key.columnWidth]
      );
    },

    isCustomDefaultScoped: function() {
      return (
        this.$scopedSlots &&
        Object.prototype.hasOwnProperty.call(this.$scopedSlots, "default")
      );
    },

    isCustomContentScoped: function() {
      return (
        this.$scopedSlots &&
        Object.prototype.hasOwnProperty.call(this.$scopedSlots, "content")
      );
    },

    sliderContent: function() {
      return this.isCustomDefaultScoped
        ? this.$scopedSlots.default(this.scopeData)
        : this.isCustomContentScoped
        ? this.$scopedSlots.content(this.scopeData)
        : this.textData;
    }
  },

  watch: {
    sliderWidth: function() {
      this.setBetweenDate();
    }
  },

  methods: {
    getMoveChunkStyle(f) {
      if (f) {
        return { opacity: 1, height: "100%" };
      } else {
        return { opacity: 0 };
      }
    },

    setBetweenDate() {
      // 左边界
      if (compareDate(this.$parent.rowData.start, this.gd.start) === "l") {
        this.gd.start = this.$parent.rowData.start;
      }

      // 右边界
      if (compareDate(this.$parent.rowData.end, this.gd.end) === "r") {
        this.gd.end = this.$parent.rowData.end;
      }

      this.root.setHeaders();
    },

    /**
     * 移动处理
     * @param {Event} e
     * @param {String} flag
     */
    sliderMoveHandle: function(e, flag = "") {
      const srcX = e.pageX;
      const srcStartDate = new Date(this.$parent.rowData.start);
      const srcEndDate = new Date(this.$parent.rowData.end);

      document.onmousemove = e => {
        let targetX = e.pageX;
        // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
        if (targetX < 0) {
          targetX = 0;
        }

        const offset = parseInt(
          ((targetX - srcX) / this.pd.ganttOptions[Variables.key.columnWidth]) *
            Variables.time.millisecondOfDay
        );

        if (flag === "move" || flag === "left") {
          this.$parent.rowData.setStart(
            getDateOffset(srcStartDate, offset),
            this.linkedResize
          );
        }

        if (flag === "move" || flag === "right") {
          this.$parent.rowData.setEnd(
            getDateOffset(srcEndDate, offset),
            this.linkedResize
          );
        }
      };

      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;

        this.root.IFMoveSlider(this.$parent.rowData);
        this.setBetweenDate();
      };
    },

    onMouseDown: function(e) {
      e.stopPropagation();
      this.sliderMoveHandle(e, "move");
    },

    onLeftChunkMouseDown: function(e) {
      e.stopPropagation();
      this.sliderMoveHandle(e, "left");
    },

    onRightChunkMouseDown: function(e) {
      e.stopPropagation();
      this.sliderMoveHandle(e, "right");
    },

    onMouseEnter: function() {
      this.showCtrlChunk = true;
    },

    onMouseLeave: function() {
      this.showCtrlChunk = false;
    }
  },

  components: {},

  render(h) {
    return h(
      "div",
      {
        class: {
          "gt-slider": true,
          "gt-shadow": !this.flat
        },
        style: {
          width: `${this.sliderWidth}px`,
          left: `${this.sliderLeft}px`,
          "background-color": this.bgColor
        },
        on: {
          mousedown: this.move ? this.onMouseDown : () => {},
          mouseenter: this.onMouseEnter,
          mouseleave: this.onMouseLeave
        }
      },
      [
        h(
          "div",
          {
            class: {
              "gt-slider-content": !this.isCustomContentScoped,
              "gt-custom-slider-content": this.isCustomContentScoped,
              "gt-noselect": true,
              "gt-text-nowrap": true
            },
            style: {
              "justify-content": this.realAlignment
            },
            on: {
              onselectstart: () => {
                return false;
              }
            }
          },
          this.sliderContent
        ),
        h("div", {
          class: { "gt-slider-ctrl__left": true },
          style: {
            "background-color": this.bgColor,
            ...this.getMoveChunkStyle(this.showCtrlChunk && this.resizeLeft)
          },
          on: {
            mousedown: this.resizeLeft ? this.onLeftChunkMouseDown : () => {}
          }
        }),
        h("div", {
          class: { "gt-slider-ctrl__right": true },
          style: {
            "background-color": this.bgColor,
            ...this.getMoveChunkStyle(this.showCtrlChunk && this.resizeRight)
          },
          on: {
            mousedown: this.resizeRight ? this.onRightChunkMouseDown : () => {}
          }
        })
      ]
    );
  }
};
