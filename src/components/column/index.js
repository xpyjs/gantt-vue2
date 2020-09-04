import "./index.styl";
import { Variables, Errors, parseNumber } from "../../utils";
import Mixins from "../mixins";
import ArrowIcon from "../common/icons/arrow.vue";

export default {
  name: Variables.name.column,

  props: {
    // 数据键
    label: {
      type: String,
      required: true
    },

    // 表头显示的文字，如果没有，则显示label
    name: String,

    // 列宽
    width: {
      type: [Number, String],
      validator: v => {
        const r = parseNumber(v) > Variables.size.defaultMinTableColumnWidth;
        if (!r) {
          console.error(
            Errors.header,
            Errors.invalidProps,
            "column width should be more than " +
              Variables.size.defaultMinTableColumnWidth +
              "."
          );
        }
        return r;
      }
    },

    // 是否合并，一个函数，抛出当前数据，接收true / false，true为合并当前行，与前置列合并
    merge: {
      type: [Function, Boolean],
      default: () => false
    },

    // 自定义格式化显示日期。如果列内需要显示日期时间，提供一个格式化字符串
    // * 只有提供了该字段才会生效。哪怕只给了key，会使用 yyyy-MM-dd 进行解析
    // * 注意，这里不能提供默认值，否则所有数据都会被作为日期解析
    dateFormat: String,

    emptyData: {
      type: String,
      default: Variables.noData
    },

    // 是否可以选择文本
    selectable: {
      type: Boolean,
      default: false
    }
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

  computed: {
    realWidth: function() {
      return this.pd.tableHeaders[this.$vnode.key].width;
    },

    colWidth: function() {
      let w = Variables.size.defaultTableColumnWidth;
      if (this.realWidth && this.realWidth > 0) {
        w = this.realWidth;
      }

      // 向后查找可合并的节点
      for (let i = this.$vnode.key + 1; i < this.pd.colNodes.length; i++) {
        const v = this.pd.colNodes[i];
        if (this.isMerge(v.merge, this.$parent.rowData.data)) {
          w += this.pd.tableHeaders[i].width;
        } else {
          break;
        }
      }

      return w;
    },

    isCustomScoped: function() {
      return (
        this.$scopedSlots &&
        Object.prototype.hasOwnProperty.call(this.$scopedSlots, "default")
      );
    }
  },

  watch: {},

  methods: {
    handleChangeCheckbox: function(e) {
      this.root.IFCheckedRow(e.target.checked, this.$parent.rowData);
    },

    handleExpand: function(e) {
      e.stopPropagation();
      this.$parent.rowData.isExpand = !this.$parent.rowData.isExpand;
    }
  },

  components: {},

  render(h) {
    return h(
      "div",
      {
        class: { "gt-column": true, "gt-noselect": !this.selectable },
        style: {
          "--column-width": `${this.colWidth - 1}px`,
          "border-color": `${
            this.pd.ganttOptions[Variables.key.body][Variables.key.borderColor]
          }`
        }
      },
      [
        // 加载checkbox
        this.pd.showCheckbox && this.$vnode.key === 0
          ? h("input", {
              attrs: {
                type: "checkbox"
              },
              class: {
                "gt-column__checkbox": true
              },
              style: {
                "--box-size": "15px"
              },
              on: {
                change: this.handleChangeCheckbox,
                click: e => e.stopPropagation(),
                dblclick: e => e.stopPropagation()
              }
            })
          : null,

        // 加载展开操作符
        this.pd.showExpand && this.$vnode.key === 0
          ? h(
              "div",
              {
                attrs: {
                  type: "text"
                },
                class: {
                  "gt-column__expand": true,
                  "gt-hide": !this.$parent.rowData.children.length > 0
                },
                style: {
                  "--box-size": "15px",
                  "margin-left": `${this.$parent.rowData.level * 10}px`
                },
                // domProps: {
                //   innerHTML:
                // },
                on: {
                  click: this.handleExpand
                }
              },
              [
                this.$parent.rowData.isExpand ? (
                  <ArrowIcon direction="down" />
                ) : (
                  <ArrowIcon direction="right" />
                )
              ]
            )
          : null,

        // 加载列内容
        h(
          "div",
          {
            class: { "gt-column__chunk": true },
            style: { "--row-height": `${this.pd.rowHeight}px` }
          },
          this.isCustomScoped
            ? this.$scopedSlots.default(this.scopeData)
            : this.textData
        )
      ]
    );
  }
};
