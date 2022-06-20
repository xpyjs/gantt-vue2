<template>
  <div ref="rootRef" class="gt-root" :style="rootStyle">
    <!-- 悬停操作按钮，外部遮罩一层，用于定位 -->
    <div v-if="showSettingBtn" class="gt-root-btn-mask">
      <XBtn
        icon="more"
        :size="btnSize"
        :style="opBtnStyle"
        @mouseenter.native.passive="onOpBtnMouseEnter"
        @mouseleave.native.passive="onOpBtnMouseLeave"
        @click.native.stop="onOpBtnClick"
      />
    </div>

    <!-- 拖动表头大小的位移线 -->
    <div
      class="gt-column-slider-line"
      :class="sliderLineClass"
      :style="sliderLineStyle"
    />

    <!-- 表格与甘特图之间的移动线 -->
    <div
      class="gt-table-slider-line"
      :style="{ left: `${tableWidth - 2}px` }"
      @mousedown="onResizeTableWidth"
    />

    <XTable :row-data="allData" @table-scroll="tableWheelHandle" />

    <XGantt :row-data="allData" @gantt-scroll="ganttWheelHandle" />

    <!-- 设置抽屉 -->
    <XDrawer :show="isShowOperationDrawer" />

    <!-- 遮罩层 -->
    <div :class="maskClass" @click.stop="onClickMask" />

    <!-- toast -->
    <XToast />

    <!-- success bar -->
    <!-- <template v-for="row in successBarList">
      <XSuccessBar :key="row.uuid" :row="row" />
    </template> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';
import { useInitParam } from '@/composables/useParam';
import { useInitRootRef } from '@/composables/useRootRef';
import { Variables } from '@/constants/vars';
import XTable from '@/components/table/index.vue';
import XGantt from '@/components/gantt/index.vue';
import XBtn from '@/components/common/Btn.vue';
import XDrawer from '@/components/common/Drawer.vue';
import XToast from '@/components/common/Toast.vue';
// import XSuccessBar from '@/components/common/SuccessBar.vue';
import useWheel from '@/composables/useWheel';
import useResize, {
  useBtnPosition,
  useResizeGanttObserver,
  useResizeTableColumn
} from '@/composables/useResize';
import useMask from '@/composables/useMask';
import { useDark } from '@/composables/useStyle';
import useExportEvent from '@/composables/event/useExportEvent';
import { useInitData } from '@/composables/data/useData';
// eslint-disable-next-line import/named
import { CustomCssProperties } from '@/typings/private/CSSProperties';
import useSuccessBar from '@/composables/useSuccessBar';
import rootProps from './rootProps';

export default defineComponent({
  name: 'XGanttRoot',

  components: {
    XTable,
    XGantt,
    XBtn,
    XDrawer,
    XToast
    // XSuccessBar
  },

  props: rootProps,

  setup(props) {
    const {
      data,
      border,
      showExpand,
      expandAll,
      startKey,
      endKey,
      borderColor,
      primaryColor
    } = toRefs(props);
    // 绑定根元素
    const { rootRef } = useInitRootRef();
    // 初始化参数
    useInitParam(props, props.slots);
    // 处理数据
    const dataOptions = computed(() => {
      return {
        isExpand: showExpand.value ? expandAll.value : true,
        startLabel: startKey.value,
        endLabel: endKey.value
        // eslint-disable-next-line no-undef
      } as DataOptions;
    });
    const { allData } = useInitData(data, dataOptions);

    const { tableWheelHandle, ganttWheelHandle, scrollBarHeight } = useWheel();
    const { tableWidth, headerHeight } = useResize();
    const { successBarList } = useSuccessBar();

    // 设置表头
    useResizeGanttObserver();

    const { colorSelectStr } = useDark();
    const rootStyle = computed(() => {
      return {
        '--root-border': `${border.value}px`,
        '--table-width': `${tableWidth.value}px`,
        '--scrollbar-width': `${scrollBarHeight.value}px`,
        '--header-height': `${headerHeight.value}px`,
        '--j-content-border-color':
          borderColor.value || Variables.color.border[colorSelectStr.value],
        '--j-primary-color':
          primaryColor.value || Variables.color.primary[colorSelectStr.value],
        '--j-content-bg-color':
          Variables.color.background[colorSelectStr.value],
        '--j-text-color': Variables.color.text[colorSelectStr.value]
      } as CustomCssProperties;
    });

    const { sliderLineClass, sliderLineStyle, onResizeTableWidth } =
      useResizeTableColumn();
    const { opBtnStyle, btnSize, onOpBtnMouseLeave, onOpBtnMouseEnter } =
      useBtnPosition();

    const { maskClass, hideMask, showMask } = useMask();
    const isShowOperationDrawer = ref(false);

    function showOperationDrawer() {
      isShowOperationDrawer.value = true;
    }

    function hideOperationDrawer() {
      isShowOperationDrawer.value = false;
    }

    function onClickMask() {
      hideMask();
      hideOperationDrawer();
    }

    function onOpBtnClick() {
      showMask();
      showOperationDrawer();
    }

    // ***** 对外方法 ***** //
    const { setSelected, jumpToDate, setHeaderUnit } = useExportEvent();

    return {
      setSelected,
      jumpToDate,
      setHeaderUnit,

      rootRef,
      rootStyle,
      tableWidth,
      sliderLineClass,
      sliderLineStyle,
      onResizeTableWidth,
      onOpBtnMouseLeave,
      onOpBtnMouseEnter,
      opBtnStyle,
      btnSize,
      onOpBtnClick,
      maskClass,
      hideMask,
      showMask,
      isShowOperationDrawer,
      showOperationDrawer,
      hideOperationDrawer,
      onClickMask,
      tableWheelHandle,
      ganttWheelHandle,

      allData,
      successBarList
    };
  }
});
</script>

<style scoped lang="scss">
@use 'sass:color';

.gt-root {
  width: calc(100% - var(--root-border) * 2);
  height: calc(100% - var(--root-border) * 2);
  border: var(--root-border) solid var(--j-content-border-color);
  overflow: hidden;
  font-size: 14px;
  color: var(--j-text-color);
  position: relative;
  display: flex;
  box-sizing: initial;
  background-color: var(--j-content-bg-color);

  .gt-root-btn-mask {
    position: absolute;
    // width: calc(100% - var(--scrollbar-width));
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-width: var(--table-width);
  }

  .gt-column-slider-line {
    width: 1px;
    height: 100%;
    border-right: 1px dotted var(--j-text-color);
    opacity: 0.5;
    position: absolute;
    z-index: 9;
  }

  .gt-table-slider-line {
    width: 2px;
    height: 100%;
    background-color: var(--j-content-border-color);
    position: absolute;
    z-index: 9;
    cursor: w-resize;
    transition: filter 0.2s;

    &:hover {
      box-shadow: 0px 0px 2px var(--j-content-border-color);
      filter: blur(1px) invert(1);
      opacity: 0.5;
    }
  }

  .gt-mask {
    width: 100%;
    height: 100%;
    z-index: 998;
    position: absolute;
    background-color: grey;
    opacity: 0.5;
    transition: all 0.2s;
  }

  .gt-mask-show {
    width: 100%;
    height: 100%;
    z-index: 998;
    position: absolute;
    background-color: grey;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .gt-mask-hide {
    opacity: 0;
    transition: opacity 0.2s;
  }
}
</style>
