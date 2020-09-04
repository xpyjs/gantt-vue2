import "./index.styl";
import { Variables, isNull } from "../../../utils";
import { Row } from "../../../model";
import Mixins from "../../mixins";

export default {
  name: Variables.name.tableRow,

  props: {
    rowData: Row
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

  methods: {},

  components: {},

  render(h) {
    return h(
      "div",
      {
        class: { "gt-table-row": true },
        style: {
          height: `${this.pd.rowHeight - 1}px`,
          "border-color": `${
            this.pd.ganttOptions[Variables.key.body][Variables.key.borderColor]
          }`,
          color: `${
            this.pd.ganttOptions[Variables.key.body][Variables.key.textColor]
          }`,
          ...this.rowBackgroundColor(
            this.pd.ganttOptions[Variables.key.body][Variables.key.bgColor]
          )
        },
        on: {
          click: this.onClickRow,
          dblclick: this.onDbClickRow,
          mouseenter: this.onMouseEnterRow,
          mouseleave: this.onMouseLeaveRow
        }
      },
      !isNull(this.rowData)
        ? this.pd.colNodes.map(v => {
            if (!this.isMerge(v.merge, this.rowData.data)) {
              return v.node;
            }
          })
        : null
    );
  }
};
