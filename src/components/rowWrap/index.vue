<template>
  <transition-group tag="div" name="gt-update-animate">
    <component
      :is="camelToKebabCased(name)"
      v-for="view in inView"
      :key="view.uuid"
      :row-data="view"
      :style="rowWrapStyle(view.__uindex, view.uuid, isTransparent)"
      class="gt-update-animate-item"
    />
  </transition-group>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  Ref,
  toRefs,
  PropType
} from '@vue/composition-api';
import useInView from '@/composables/useInView';
import { Row } from '@/models/data/row';
import { camelToKebabCased } from '@/utils/common';
import useStyle from '@/composables/useStyle';
import JTableRow from '../table/Row.vue';
import JGanttRow from '../gantt/Row.vue';
import JGanttBackgroundRow from '../gantt/BackgroundRow.vue';

export default defineComponent({
  name: 'XGanttRowWrap',

  components: {
    [JTableRow.name]: JTableRow,
    [JGanttRow.name]: JGanttRow,
    [JGanttBackgroundRow.name]: JGanttBackgroundRow
  },

  props: {
    rowData: {
      type: Array as PropType<Array<Row>>,
      required: true
    },

    name: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const { rowData } = toRefs(props);
    const { inView } = useInView(rowData as Ref<Array<Row>>);
    const { rowWrapStyle } = useStyle();

    const isTransparent = computed(() => {
      return props.name !== JGanttBackgroundRow.name;
    });

    return {
      inView,
      rowWrapStyle,
      isTransparent,
      camelToKebabCased
    };
  }
});
</script>

<style scoped lang="scss">
.gt-update-animate-item {
  transition: transform 0s;
}

.gt-update-animate-enter,
.gt-update-animate-leave-to {
  height: 0;
}

.gt-update-animate-leave-active {
  position: absolute;
}

.gt-update-animate-enter-active {
  animation: fadeInDown 0s;
}
</style>
