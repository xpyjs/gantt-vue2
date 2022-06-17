<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import useEvent from '@/composables/event/useEvent';
import useParam from '@/composables/useParam';
import useRender from '@/composables/useRender';
import useStyle from '@/composables/useStyle';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import XGanttColumn from '@/components/column/index.vue';

export default defineComponent({
  name: Variables.name.tableRow,

  components: { XGanttColumn },

  props: {
    rowData: {
      type: Object as () => Row,
      required: true
    }
  },

  setup(props) {
    const { tableRowStyle } = useStyle();

    const { GtParam } = useParam();
    const { isMerge } = useRender(props.rowData);
    const colNodes = GtParam.colNodes.filter(n => !isMerge(n.merge));

    const { onClickRow, onDbClickRow, onMouseEnterRow, onMouseLeaveRow } =
      useEvent(props.rowData);

    return {
      tableRowStyle,
      colNodes,
      onClickRow,
      onDbClickRow,
      onMouseEnterRow,
      onMouseLeaveRow
    };
  },

  render(h) {
    const { tableRowStyle, rowData, colNodes } = this as any;
    return h(
      'div',
      {
        class: { 'gt-table-row': true },
        style: { ...tableRowStyle(rowData.level) },
        on: {
          click: this.onClickRow as any,
          dblclick: this.onDbClickRow as any,
          mouseenter: this.onMouseEnterRow as any,
          mouseleave: this.onMouseLeaveRow as any
        }
      },
      rowData
        ? colNodes.map(
            (v: any) =>
              // h(v.node, { attrs: { rowData: this.rowData } })
              v.node
          )
        : null
    );
  }
});
</script>

<style scoped lang="scss">
.gt-table-row {
  width: 100%;
  display: flex;
  flex: row nowrap;
  flex-shrink: 0;
  background-color: var(--j-content-bg-color);
  border-bottom: 1px solid var(--j-content-border-color);
  box-sizing: border-box;
}
</style>
