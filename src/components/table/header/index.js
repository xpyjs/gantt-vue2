import "./index.styl";
import { Variables } from "../../../utils";

export default {
  name: Variables.name.tableHeader,

  props: {},

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  destroyed() {},

  inject: ["pd", "gd", "root"],

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    handleResize: function(e, item) {
      let offset = 0;
      const srcX = e.pageX;

      document.onmousemove = e => {
        let targetX = e.pageX;
        // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
        if (targetX < 0) {
          targetX = 0;
        }

        // 判断表格宽度的最小值
        let minWidth = Variables.size.defaultMinTableColumnWidth;
        if (item.key === 0) {
          let w = 0;
          // 留出层级的宽度
          w += this.pd.expandWidth * this.gd.hierarchy;

          // 需要留出层级和 checkbox 的宽度
          if (this.pd.showCheckbox) w += this.pd.checkBoxWidth;

          if (w > minWidth) minWidth = w;
        }

        // 判断最大值，最大总宽度要给甘特留出一定空间
        const space = 100;
        const originAllWidth = this.pd.tableHeaders.reduce(
          (res, head) => res + head.width,
          0
        );
        const diffWidth = targetX - srcX;
        if (originAllWidth + diffWidth > this.root.$el.clientWidth - space) {
          return;
        }

        if (item.width + targetX - srcX > minWidth) {
          // 赋差值
          offset = targetX - srcX;
          // this.$emit("moveColumnSlider", targetX);
          this.root.handleMoveColumnSlider(targetX);
        }
      };

      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
        item.width += offset;
        // this.$emit("sliderHidden");
        this.root.handleColumnSliderHidden();
      };
    }
  },

  components: {},

  render(h) {
    return h(
      "div",
      {
        class: {
          "gt-table-header": true,
          "gt-noselect": true,
          "gt-header-border-dark": this.pd.dark,
          "gt-header-bg-dark": this.pd.dark
        },
        style: {
          "--header-height": `${this.pd.headerHeight}px`,
          "background-color": `${
            this.pd.ganttOptions[Variables.key.header][Variables.key.bgColor]
          }`,
          "border-color": `${
            this.pd.ganttOptions[Variables.key.header][
              Variables.key.borderColor
            ]
          }`,
          color: `${
            this.pd.ganttOptions[Variables.key.header][Variables.key.textColor]
          }`
        }
      },
      this.pd.tableHeaders.map(item => {
        return h(
          "div",
          {
            class: {
              "gt-table-header-chunk": true,
              "gt-header-border-dark": this.pd.dark
            },
            style: {
              width: `${item.width - 1}px`,
              "border-color": `${
                this.pd.ganttOptions[Variables.key.header][
                  Variables.key.borderColor
                ]
              }`
            }
          },
          [
            h(
              "div",
              {
                style: {
                  "padding-top": `${this.pd.headerHeight / 2}px`
                },
                domProps: {
                  innerHTML: item.text
                }
              },
              []
            ),
            item.key !== this.pd.tableHeaders.length - 1
              ? h("div", {
                  class: {
                    "gt-header__table-chunk__move-slider": true
                  },
                  on: {
                    mousedown: e => this.handleResize(e, item)
                  }
                })
              : h()
          ]
        );
      })
    );
  }
};
