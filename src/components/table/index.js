import "./index.styl";
import { Variables } from "../../utils";
import Mixins from "../mixins";

import Header from "./header";
import Row from "./row";

export default {
  name: Variables.name.table,

  props: {
    tableWidth: Number,
    rowData: Array,
    scrollBarHeight: Number
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
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    handleMouseWheel: function(e) {
      this.$emit("tableScroll", e.deltaY);
    }

    // TODO: 监听触摸滑动事件
    // handleTouchStart: function(e) {
    //   const startTop = e.target.offsetTop;
    //   const touchstart = e.targetTouches[0];
    //   const startPos = {
    //     x: touchstart.pageX,
    //     y: touchstart.pageY
    //   };

    //   document.touchmove = e => {
    //     const touchmove = e.targetTouches[0];
    //     // 偏移量
    //     const offsetPos = {
    //       x: touchmove.pageX - startPos.x,
    //       y: touchmove.pageY - startPos.y
    //     };
    //     // 重新定位需要的目标top值
    //     const endTop = startTop + offsetPos.y;

    //     let delta = 0;
    //     // 需要判断滚动到顶和到底的情况
    //     if (
    //       endTop < 10 &&
    //       endTop > e.target.parentElement.offsetHeight - e.target.offsetHeight
    //     ) {
    //       delta = endTop;
    //     } else if (endTop >= 10) {
    //       delta = 0;
    //     } else {
    //       delta =
    //         e.target.parentElement.offsetHeight - e.target.offsetHeight - 10;
    //     }

    //     console.log(delta);
    //     this.$emit("tableScroll", delta);
    //   };
    //   document.touchend = () => {
    //     document.touchmove = document.touchend = null;
    //   };
    // }
  },

  components: {
    [Header.name]: Header,
    [Row.name]: Row
  },

  render(h) {
    return h(
      "div",
      {
        class: { "gt-table-content": true },
        style: {
          width: `${this.tableWidth}px`
        },
        on: {
          mousewheel: this.handleMouseWheel,
          DOMMouseScroll: this.handleMouseWheel
          // touchstart: this.handleTouchStart
        }
      },
      [
        h(Header.name),
        h(
          "div",
          {
            ref: "tableWrap",
            class: { "gt-table-row-wrap": true },
            style: { height: `${this.contentHeight}px` }
          },
          [this.renderRow(h, Row.name, this.rowData)]
        ),

        this.renderRowHoverStrip(h, this.tableWidth),
        this.renderRowSelectStrip(h, this.tableWidth),

        // 滚动条占位
        h("div", {
          style: { height: `${this.scrollBarHeight}px` }
        })
      ]
    );
  }
};
