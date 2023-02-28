<script lang="ts">
import { computed, defineComponent, ref, toRefs, PropType } from 'vue';
import useEvent from '@/composables/event/useEvent';
import useParam from '@/composables/useParam';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import { uuid } from '@/utils/common';
import XGanttSlider from '../slider/index.vue';

export default defineComponent({
  name: Variables.name.ganttRow,

  components: {
    XGanttSlider
  },

  props: {
    rowData: { type: Object as PropType<Row>, required: true }
  },

  setup(props) {
    const { rowData } = toRefs(props);

    const key = ref(rowData.value?.uuid ?? uuid(12));
    const { GtParam } = useParam();
    const sliderNode = computed(() => GtParam.sliderNode);

    const { onClickRow, onDbClickRow, onMouseEnterRow, onMouseLeaveRow } =
      useEvent(rowData.value as Row);

    return {
      key,
      sliderNode,
      onClickRow,
      onDbClickRow,
      onMouseEnterRow,
      onMouseLeaveRow
    };
  },

  render(h) {
    const {
      rowData,
      key,
      sliderNode,
      onClickRow,
      onDbClickRow,
      onMouseEnterRow,
      onMouseLeaveRow
    } = this as any;

    return h(
      'div',
      {
        class: ['gt-table-row'],
        key,
        on: {
          click: onClickRow as any,
          dblclick: onDbClickRow as any,
          mouseenter: onMouseEnterRow as any,
          mouseleave: onMouseLeaveRow as any
        }
      },
      [!!rowData && (sliderNode || h(XGanttSlider))]
    );
  }
});
</script>

<style scoped lang="scss">
.gt-gantt-row {
  width: 100%;
  position: relative;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
}
</style>
