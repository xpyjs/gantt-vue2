<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  PropType
} from '@vue/composition-api';
import useEvent from '@/composables/event/useEvent';
import useParam from '@/composables/useParam';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import { uuid } from '@/utils/common';
import JGanttSlider from '../slider/index.vue';

export default defineComponent({
  name: Variables.name.ganttRow,

  components: {
    JGanttSlider
  },

  props: {
    data: { type: Object as PropType<Row>, required: true }
  },

  setup(props) {
    const { data } = toRefs(props);

    const key = ref(data.value?.uuid ?? uuid(12));
    const { GtParam } = useParam();
    const sliderNode = computed(() => GtParam.sliderNode);

    const { onClickRow, onDbClickRow, onMouseEnterRow, onMouseLeaveRow } =
      useEvent(data.value as Row);

    return {
      key,
      sliderNode,
      onClickRow,
      onDbClickRow,
      onMouseEnterRow,
      onMouseLeaveRow
    };
  }
});
</script>

<template>
  <div
    :key="key"
    class="gt-gantt-row"
    @click="onClickRow"
    @dblclick="onDbClickRow"
    @mouseenter="onMouseEnterRow"
    @mouseleave="onMouseLeaveRow"
  >
    <template v-if="!!data">
      <component :is="sliderNode" v-if="sliderNode" :data="data" />
      <JGanttSlider v-else :data="data" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.gt-gantt-row {
  width: 100%;
  position: relative;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
}
</style>
