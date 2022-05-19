<template>
  <div class="sync-scroll-container" :class="{ 'hide-scroll': hideScroll }">
    <slot></slot>
  </div>
</template>

<script>
// This component idea from https://github.com/metawin-m/vue-scroll-sync

let uuid = 0; // from https://github.com/vuejs/vue/issues/5886
const eventName = 'scroll-sync';

export default {
  props: {
    // 按比例滚动
    proportional: Boolean,
    // 垂直
    vertical: Boolean,
    // 横向
    horizontal: Boolean,
    // 组名，同组一起滚动
    group: { type: String, default: undefined },
    // 隐藏滚动条
    hideScroll: Boolean,
    // 禁用横向滚动
    disableHorizontal: Boolean,
    // 禁用纵向滚动
    disableVertical: Boolean
  },

  data() {
    return {
      topNode: null,
      scrollAction: { x: undefined, y: undefined },
      direction: '',
      uuid: uuid.toString()
    };
  },

  created() {
    uuid += 1;
  },

  mounted() {
    // 接收事件
    const container = this;
    let parent = this.$parent;

    while (parent) {
      this.topNode = parent;
      parent = this.topNode.$parent;
    }

    // 注册滚动事件
    container.$el.addEventListener('scroll', this.scrollFunc);

    // 接收事件
    this.topNode.$on(eventName, data => {
      if (data.emitter === container.uuid || data.group !== container.group) {
        return;
      }
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
        barHeight,
        barWidth,
        disableHorizontal,
        disableVertical
      } = data;

      // from https://github.com/okonet/react-scroll-sync
      const scrollTopOffset = scrollHeight - clientHeight;
      const scrollLeftOffset = scrollWidth - clientWidth;
      const { proportional, vertical, horizontal } = container;
      /* Calculate the actual pane height */
      const paneHeight = container.$el.scrollHeight - clientHeight;
      const paneWidth = container.$el.scrollWidth - clientWidth;
      /* Adjust the scrollTop position of it accordingly */
      container.$el.onscroll = null;
      if (!disableVertical && vertical && scrollTopOffset > barHeight) {
        container.$el.scrollTop = proportional
          ? (paneHeight * scrollTop) / scrollTopOffset
          : scrollTop; // eslint-disable-line
      }
      if (!disableHorizontal && horizontal && scrollLeftOffset > barWidth) {
        container.$el.scrollLeft = proportional
          ? (paneWidth * scrollLeft) / scrollLeftOffset
          : scrollLeft; // eslint-disable-line
      }
      window.requestAnimationFrame(() => {
        container.$el.onscroll = container.handleScroll;
      });
    });

    this.$el.onscroll = this.handleScroll;
  },

  methods: {
    // 判断页面上下左右的移动方向
    scrollFunc(e) {
      const diffX = this.scrollAction.x - e.target.scrollLeft;
      const diffY = this.scrollAction.y - e.target.scrollTop;

      if (diffX < 0) {
        this.direction = 'right';
      } else if (diffX > 0) {
        this.direction = 'left';
      } else if (diffY < 0) {
        this.direction = 'down';
      } else if (diffY > 0) {
        this.direction = 'up';
      }

      this.scrollAction.x = e.target.scrollLeft;
      this.scrollAction.y = e.target.scrollTop;
    },

    handleScroll(e) {
      // 禁用条件
      if (
        this.disableHorizontal &&
        ['left', 'right'].includes(this.direction)
      ) {
        return;
      }

      if (this.disableVertical && ['up', 'down'].includes(this.direction)) {
        return;
      }

      const container = this;

      window.requestAnimationFrame(() => {
        const {
          scrollTop,
          scrollHeight,
          clientHeight,
          scrollLeft,
          scrollWidth,
          clientWidth,
          offsetHeight,
          offsetWidth
        } = e.target;

        // 发出事件
        this.topNode.$emit(eventName, {
          scrollTop,
          scrollHeight,
          clientHeight,
          scrollLeft,
          scrollWidth,
          clientWidth,
          barHeight: offsetHeight - clientHeight,
          barWidth: offsetWidth - clientWidth,
          emitter: container.uuid,
          group: container.group,
          disableHorizontal: container.disableHorizontal,
          disableVertical: container.disableVertical
        });
      });
    }
  }
};
</script>

<style scoped>
.sync-scroll-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}

.hide-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
