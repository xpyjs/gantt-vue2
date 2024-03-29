<template>
  <div
    ref="tableRef"
    class="gt-table"
    @wheel.passive="onMouseWheel"
    @DOMMouseScroll.passive="onMouseWheel"
  >
    <!-- 表头 -->
    <TableHeader />

    <!-- 表格内容 -->
    <div
      class="gt-table-row-wrap"
      :style="{
        height: `${rowHeight * rowData.length}px`,
        position: 'relative'
      }"
    >
      <RowWrap :row-data="rowData" :name="Variables.name.tableRow" />
    </div>

    <!-- 底部占位条，对齐甘特图的滚动条 -->
    <div class="gt-table-bottom-bar" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Row } from '@/models/data/row';
import useResize from '@/composables/useResize';
import RowWrap from '@/components/rowWrap/index.vue';
import { Variables } from '@/constants/vars';
import { useInitTableRef } from '@/composables/useTableRef';
import TableHeader from './Header.vue';

export default defineComponent({
  name: Variables.name.table,

  components: {
    RowWrap,
    TableHeader
  },

  props: {
    rowData: {
      type: Array as () => Row[],
      required: true
    }
  },

  setup(props, { emit }) {
    const { rowHeight } = useResize();

    function onMouseWheel(e: WheelEvent) {
      e.stopPropagation();
      emit('table-scroll', e);
    }

    const { tableRef } = useInitTableRef();

    return {
      rowHeight,
      tableRef,
      onMouseWheel,
      Variables
    };
  }
});
</script>

<style scoped lang="scss">
.gt-table {
  z-index: 5;
  position: relative;
  overflow: hidden;
  width: var(--table-width);

  .gt-table-row-wrap {
    width: 100%;
    position: relative;
    background-color: var(--j-content-bg-color);
  }

  .gt-table-bottom-bar {
    height: var(--scrollbar-width);
  }
}
</style>
