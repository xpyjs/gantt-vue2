import "./operationDrawer.styl";
import { Variables } from "../../utils";

import Slider from "../common/sliderBar.vue";
import Line from "../common/line.vue";

export default {
  name: "GanttOperationDrawer",

  props: {
    showDrawer: Boolean,
    width: {
      type: Number,
      default: 200
    }
  },

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  destroyed() {},

  inject: ["pd", "gd"],

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    handleChangeColWidth: function(value) {
      if (
        value < Variables.size.defaultMinGanttColumnWidth ||
        value > Variables.size.defaultMaxGanttColumnWidth
      )
        return;

      this.pd.setGanttOptions({
        [Variables.key.columnWidth]: value
      });
    },

    handleChangeRowHeight: function(value) {
      this.pd.rowHeight = value;
    },

    handleReset: function() {
      this.pd.setGanttOptions({
        [Variables.key.columnWidth]: Variables.size.defaultMinGanttColumnWidth
      });
      this.pd.rowHeight = Variables.size.defaultContentRowHeight;
    }
  },

  components: {
    [Slider.name]: Slider
  },

  render() {
    return (
      <div
        class="gt-operation-drawer"
        style={{
          width: `${this.width}px`,
          // 多出10，可以隐藏drawer的阴影部分
          right: this.showDrawer ? "0" : `-${this.width + 10}px`
        }}
      >
        <div class="gt-drawer-item-wrap">
          <div class="gt-text-title" style={{ "margin-left": "20px" }}>
            修改甘特列宽
          </div>
          <Slider
            value={parseInt(this.pd.ganttOptions[Variables.key.columnWidth])}
            onChange={this.handleChangeColWidth}
            min={Variables.size.defaultMinGanttColumnWidth}
            max={Variables.size.defaultMaxGanttColumnWidth}
            style={{ margin: "5px 20px 10px 20px" }}
          />
          <Line />
        </div>

        <div class="gt-drawer-item-wrap">
          <div class="gt-text-title" style={{ "margin-left": "20px" }}>
            修改行高
          </div>
          <Slider
            value={parseInt(this.pd.rowHeight)}
            onChange={this.handleChangeRowHeight}
            min={Variables.size.defaultMinContentRowHeight}
            max={Variables.size.defaultMaxContentRowHeight}
            style={{ margin: "5px 20px 10px 20px" }}
          />
          <Line />
        </div>

        {/* 重置按钮 */}
        <div class="gt-drawer-item-wrap">
          <button class="gt-drawer-reset-btn" onclick={this.handleReset}>
            重置
          </button>
        </div>
      </div>
    );
  }
};
