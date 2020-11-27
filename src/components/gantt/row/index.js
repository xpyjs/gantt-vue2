import "./index.styl";
import { Variables, isNull, uuid } from "../../../utils";
import { Row } from "../../../model";
import Mixins from "../../mixins";
import Slider from "../../slider";

export default {
  name: Variables.name.ganttRow,

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

  computed: {
    backgroundImageStyle: function() {
      if (this.pd.ganttOptions[Variables.key.body][Variables.key.borderColor]) {
        return {
          "background-image": `linear-gradient(270deg, ${
            this.pd.ganttOptions[Variables.key.body][Variables.key.borderColor]
          } 1px, transparent 0)`
        };
      }
      return {};
    }
  },

  watch: {},

  methods: {},

  components: {
    [Slider.name]: Slider
  },

  render(h) {
    return h(
      "div",
      {
        class: {
          "gt-gantt-row": true,
          "gt-bg-dark": this.pd.dark,
          "gt-gantt-content-border-dark": this.pd.dark
        },
        style: {
          height: `${this.pd.rowHeight - 1}px`,
          "background-size": `${
            this.pd.ganttOptions[Variables.key.columnWidth]
          }px`,
          "border-color": `${
            this.pd.ganttOptions[Variables.key.body][Variables.key.borderColor]
          }`,
          color: `${
            this.pd.ganttOptions[Variables.key.body][Variables.key.textColor]
          }`,
          ...this.backgroundImageStyle,
          ...this.rowBackgroundColor(
            this.pd.ganttOptions[Variables.key.body][Variables.key.bgColor]
          )
        },
        props: {
          key: !isNull(this.rowData) ? this.rowData.uuid : uuid()
        },
        on: {
          click: this.onClickRow,
          dblclick: this.onDbClickRow,
          mouseenter: this.onMouseEnterRow,
          mouseleave: this.onMouseLeaveRow
        }
      },
      !isNull(this.rowData) ? [this.pd.sliderNode || h(Slider.name)] : null
    );
  }
};
