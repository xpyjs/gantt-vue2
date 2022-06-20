<template>
  <Root ref="rootRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, useSlots, ref } from '@vue/composition-api';
import useInitEvent from '@/composables/event/useInitEvent';
import { initStore } from '@/store';
import Root from './index.vue';

export default defineComponent({
  name: 'XGanttRootWrap',

  components: {
    Root
  },

  setup(_, { emit }) {
    const slots = useSlots();

    // 初始全局数据
    initStore();

    // 初始化事件
    useInitEvent(emit);

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
      rootRef,

      setSelected,
      jumpToDate,
      setHeaderUnit
    };
  }
});
</script>

<style lang="scss" scoped></style>
