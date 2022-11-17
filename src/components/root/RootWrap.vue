<template>
  <Root ref="rootRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import useInitEvent from '@/composables/event/useInitEvent';
import { initStore } from '@/store';
import Root from './index.vue';

export default defineComponent({
  name: 'XGanttRootWrap',

  components: {
    Root
  },

  setup(_, ctx) {
    // 初始全局数据
    initStore();

    // 初始化事件
    useInitEvent(ctx.emit);

    const rootRef = ref<any>();
    const setSelected = (args: any) => {
      rootRef?.value?.setSelected(args);
    };

    const jumpToDate = (args: any) => {
      rootRef?.value?.jumpToDate(args);
    };

    const setHeaderUnit = (args: any) => {
      rootRef?.value?.setHeaderUnit(args);
    };

    return {
      slots: ctx.slots,
      rootRef,

      setSelected,
      jumpToDate,
      setHeaderUnit
    };
  }
});
</script>

<style lang="scss" scoped></style>
