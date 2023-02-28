<template>
  <svg
    t="1594609520750"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6884"
    data-darkreader-inline-fill=""
    :width="size"
    :height="size"
    :style="{ fill: 'var(--j-primary-color)' }"
    :class="{
      'gt-animation': true,
      up: up,
      down: down,
      left: left,
      right: right
    }"
  >
    <path
      d="M823.110667 437.542194L302.873052 81.236186c-59.893088-41.026392-141.257188 1.871627-141.257188 74.457805v712.610994c0 72.586179 81.364099 115.484198 141.257188 74.457806l520.237615-356.304985c52.364625-35.8413 52.364625-113.074312 0-148.915612z"
      p-id="6885"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type Direction = 'up' | 'down' | 'left' | 'right';

export default defineComponent({
  name: 'GanttArrowIcon',

  props: {
    size: {
      type: Number,
      default: 15
    },

    direction: {
      type: String as PropType<Direction>,
      default: 'right',
      validator: (v: Direction) => {
        return ['up', 'down', 'left', 'right'].includes(v);
      }
    }
  },

  data() {
    return {
      up: false,
      down: false,
      left: false,
      right: false
    };
  },

  watch: {
    direction() {
      this.checkDirection();
    }
  },

  mounted() {
    this.checkDirection();
  },

  methods: {
    checkDirection() {
      this.up = false;
      this.down = false;
      this.left = false;
      this.right = false;

      switch (this.direction) {
        case 'up':
          this.up = true;
          break;
        case 'down':
          this.down = true;
          break;
        case 'left':
          this.left = true;
          break;
        default:
          this.right = true;
          break;
      }
    }
  }
});
</script>

<style scoped>
.right {
  transform: rotate(0);
}

.down {
  transform: rotate(90deg);
}

.up {
  transform: rotate(-90deg);
}

.left {
  transform: rotate(-180deg);
}
</style>
