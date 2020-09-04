import "./index.styl";
import { Variables, sameDate, createDate, formatDate } from "../../../utils";
import Mixins from "../../mixins";

export default {
  name: Variables.name.ganttHeader,

  props: {},

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  destroyed() {},

  inject: ["pd", "gd"],

  mixins: [Mixins],

  data() {
    return {};
  },

  computed: {
    arrowWidth: function() {
      let v = this.colWidth;
      if (this.colWidth > 50) {
        v = 50;
      }
      return v;
    }
  },

  watch: {},

  methods: {},

  components: {},

  render(h) {
    return h(
      "div",
      {
        class: { "gt-gantt-header": true, "gt-noselect": true },
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
      this.pd.ganttHeaders
        .map(item => {
          return h(
            "div",
            {
              class: { "gt-gantt-header-chunk": true },
              style: {
                width: `${this.colWidth - 1}px`,
                "border-color": `${
                  this.pd.ganttOptions[Variables.key.header][
                    Variables.key.borderColor
                  ]
                }`
              }
            },
            [
              createDate(item)
                .getDate()
                .toString(),
              sameDate(item, this.gd.start) || createDate(item).getDate() === 1
                ? h(
                    "div",
                    { class: { "gt-gantt-header-chunk-month": true } },
                    formatDate(createDate(item), "yyyy-MM")
                  )
                : null
            ]
          );
        })
        .concat(
          h("div", {
            class: { "gt-gantt-header-today-arrow": true },
            style: {
              left: `${this.todayLeft +
                (this.colWidth - this.arrowWidth) / 2}px`,
              "border-width": `${this.arrowWidth / 2}px`,
              "border-top-color": this.pd.ganttOptions[Variables.key.body][
                Variables.key.todayColor
              ]
            }
          })
        )
    );
  }
};
