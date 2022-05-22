<template>
  <Root ref="rootRef" v-bind="$attrs" :slot="slots" />
</template>

<script lang="ts">
import { defineComponent, useSlots, ref } from '@vue/composition-api';
import { initStore } from '@/store';
import Root from './index.vue';

export default defineComponent({
  name: 'XGanttRootWrap',

  components: {
    Root
  },

  setup() {
    const slots = useSlots();

    // 初始全局数据
    initStore();

    const rootRef = ref<any>();
    const setSelected = (args: any) => {
      rootRef.value.setSelected(args);
    };

    const jumpToDate = (args: any) => {
      rootRef.value.jumpToDate(args);
    };

    const setHeaderUnit = (args: any) => {
      rootRef.value.setHeaderUnit(args);
    };

    return {
      slots,

      setSelected,
      jumpToDate,
      setHeaderUnit
    };
  }
});
</script>

<style lang="scss" scoped></style>
