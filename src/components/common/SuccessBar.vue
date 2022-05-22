<template>
  <div
    class="gt-success-bar"
    :style="{
      height: `${rowHeight}px`,
      top: `${headerHeight + rowHeight * row.__uindex - scrollTop}px`,
      'animation-duration': `${successBarTimeout / 1000}s`
    }"
  />
</template>

<script lang="ts">
import { PropType, defineComponent } from '@vue/composition-api';
import useResize from '@/composables/useResize';
import { Row } from '@/models/data/row';
import useSuccessBar from '@/composables/useSuccessBar';
import useWheel from '@/composables/useWheel';

export default defineComponent({
  props: {
    row: {
      type: Object as PropType<Row>,
      required: true
    }
  },

  setup() {
    const { headerHeight, rowHeight } = useResize();
    const { successBarTimeout } = useSuccessBar();
    const { scrollTop } = useWheel();

    return {
      headerHeight,
      rowHeight,
      successBarTimeout,
      scrollTop
    };
  }
});
</script>

<style scoped lang="scss">
.gt-success-bar {
  position: absolute;
  left: 50%;
  width: 0;
  z-index: 999;
  background-color: #90ee90;
  opacity: 0.2;
  animation-name: spread;
  animation-timing-function: cubic-bezier(0, 0.95, 0.48, 1);
  animation-fill-mode: forwards;
}

@keyframes spread {
  0% {
    width: 0;
  }
  100% {
    left: 0;
    width: 100%;
  }
}
</style>
