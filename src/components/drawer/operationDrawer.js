import "./operationDrawer.styl";
import { Variables } from "../../utils";

import Slider from "../common/sliderBar.vue";
import Line from "../common/line.vue";

export default {
  name: "GanttOperationDrawer",

  props: {
    showDrawer: Boolean,
    settingsSlot: [Object, undefined]
  },

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {
    this.drawerWidth = this.$refs.drawer.clientWidth;
  },

  beforeDestroy() {},

  destroyed() {},

  inject: ["pd", "gd"],

  data() {
    return {
      drawerWidth: 2000
    };
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
    [Slider.name]: Slider,
    [Line.name]: Line
  },

  render() {
    return (
      <div
        ref="drawer"
        class={{
          "gt-operation-drawer": true,
          "gt-bg-dark": this.pd.dark,
          "gt-text-dark": this.pd.dark
        }}
        style={{
          "min-width": "200px",
          // 多出10，可以隐藏drawer的阴影部分
          right: this.showDrawer ? `${0}px` : `-${this.drawerWidth + 10}px`
        }}
      >
        {/* 系统设置 */}
        <div>
          <div class="gt-text-title" style={{ "margin-bottom": "20px" }}>
            系统设置
          </div>
          <div style={{ display: "inline-block" }}>
            <div class="gt-text-secondary-title">修改甘特列宽</div>
            <Slider
              value={parseInt(this.pd.ganttOptions[Variables.key.columnWidth])}
              onChange={this.handleChangeColWidth}
              min={Variables.size.defaultMinGanttColumnWidth}
              max={Variables.size.defaultMaxGanttColumnWidth}
              style={{ margin: "5px 20px 10px 20px" }}
            />
          </div>

          <div style={{ display: "inline-block" }}>
            <div class="gt-text-secondary-title">修改行高</div>
            <Slider
              value={parseInt(this.pd.rowHeight)}
              onChange={this.handleChangeRowHeight}
              min={Variables.size.defaultMinContentRowHeight}
              max={Variables.size.defaultMaxContentRowHeight}
              style={{ margin: "5px 20px 10px 20px" }}
            />
          </div>

          {/* 重置按钮 */}
          <button class="gt-drawer-reset-btn" onclick={this.handleReset}>
            重置
          </button>
        </div>

        <Line />

        {/* 个人设置，插槽 */}
        {this.settingsSlot && this.settingsSlot}
      </div>
    );
  }
};
