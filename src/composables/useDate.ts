/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { computed } from '@vue/composition-api';
import { Variables } from '@/constants/vars';
import { parseNumber } from '@/utils/common';
import {
  createDate,
  formatDate,
  getDateInterval,
  getMillisecond
} from '@/utils/date';
import { isDate, isUndefined } from '@/utils/is';
import { HeaderDateUnit } from '@/typings/ParamOptions';
import useGanttRef from './useGanttRef';
import useParam from './useParam';
import useResize from './useResize';
import { useDark } from './useStyle';
import useRootEmit from './event/useRootEmit';
import useData from './data/useData';
import useToast from './useToast';

function _getDateInterval(
  start: Date,
  date: Date | number,
  unit: HeaderDateUnit
) {
  const sd = new Date(formatDate(start)).setHours(0);

  return getDateInterval(sd, date) / getMillisecond(unit);
}

export function useCheckDate() {
  const { GtParam } = useParam();

  function isInArea(date: Date) {
    if (GtParam.ganttHeaders.length === 0) return false;

    const sd = GtParam.startDate.setHours(0);
    const ed = GtParam.endDate.setHours(24);

    return !(date.getTime() < sd || date.getTime() > ed);
  }
  return { isInArea };
}

export function useToday() {
  const { GtParam, oneDayWidth } = useParam();
  const { GtData } = useData();
  const { isInArea } = useCheckDate();
  const { colorSelectStr } = useDark();

  const isTodayInArea = computed(() => {
    return isInArea(createDate());
  });

  const showTodayLine = computed(
    () => isTodayInArea.value && GtParam.ganttOptions.showToday
  );

  const todayLeft = computed(() => {
    const today = new Date().setHours(0);
    return parseNumber(
      _getDateInterval(GtData.start as Date, today, GtParam.headerUnit) *
        oneDayWidth.value
    );
  });

  const leftOffsetDiff = computed(() => {
    switch (GtParam.ganttOptions.columnSize) {
      case 'large':
        return 2;
      case 'normal':
        return 1;
      default:
        return 0;
    }
  });

  const todayLineStyle = computed(() => {
    return {
      left: `${todayLeft.value - leftOffsetDiff.value}px`,
      width: `${GtParam.headerUnit === 'day' ? oneDayWidth.value : 5}px`,
      height: '100%',
      'background-color':
        GtParam.ganttOptions.body?.todayColor ||
        Variables.color.today[colorSelectStr.value]
    };
  });

  const arrowWidth = computed(() => {
    if (GtParam.headerUnit === 'day') {
      if (oneDayWidth.value > 50) return 50;
      return oneDayWidth.value;
    }
    return 15;
  });

  const todayArrowStyle = computed(() => {
    return {
      left: `${
        GtParam.headerUnit === 'day'
          ? todayLeft.value + (oneDayWidth.value - arrowWidth.value) / 2
          : todayLeft.value - arrowWidth.value / 2 + 2
      }px`,
      'border-width': `${arrowWidth.value / 2}px`,
      'border-top-color': GtParam.ganttOptions.body?.todayColor
    };
  });

  return {
    isTodayInArea,
    showTodayLine,
    todayLineStyle,
    todayLeft,
    todayArrowStyle
  };
}

export function useWeekend() {
  const { GtData } = useData();
  const { GtParam, oneDayWidth } = useParam();
  const { ganttWidth } = useResize();
  const { colorSelectStr } = useDark();

  const weekendList = computed(() => {
    const r: Array<number> = [];
    if (!GtParam.ganttOptions.showWeekend || GtParam.headerUnit !== 'day')
      return r;

    const sd = createDate(GtData.start);
    let d = sd.getDay();
    let i = 0;

    // start is Sunday
    if (d === 0) {
      r.push(d);
      d += 6;
      i += 6;
    }

    // start is work day
    while (d > 0 && d < 6) {
      d++;
      i++;
    }

    // Cycle to find Saturday and Sunday
    while (i * oneDayWidth.value < ganttWidth.value) {
      r.push(i);
      r.push(++i);
      ++d;
      d += 6;
      i += 6;
    }

    return r;
  });

  const weekendStyle = computed(() => {
    return (item: number) => {
      return {
        left: `${item * oneDayWidth.value}px`,
        width: `${oneDayWidth.value}px`,
        height: '100%',
        'background-color':
          GtParam.ganttOptions.body?.weekendColor ||
          Variables.color.weekend[colorSelectStr.value]
      };
    };
  });

  return {
    weekendList,
    weekendStyle
  };
}

export function useJumpDate() {
  const { GtData } = useData();
  const { oneDayWidth, GtParam } = useParam();
  const { isInArea } = useCheckDate();
  const { INoDateError } = useRootEmit();
  const { ganttRef } = useGanttRef();
  const { showToast } = useToast();

  /**
   * ?????????????????????
   */
  function handleJumpTo(date: Date | undefined) {
    if (!ganttRef.value) return;

    // ???????????????????????????????????????
    if (isUndefined(date) || !isDate(date)) {
      // eslint-disable-next-line no-param-reassign
      date = new Date();
    }

    if (!isInArea(date)) {
      showToast('??????????????????');
      INoDateError(date);
      return;
    }

    date.setHours(0);
    const width = parseNumber(
      _getDateInterval(GtData.start as Date, date, GtParam.headerUnit) *
        oneDayWidth.value
    );

    let left = 0;
    let right = 0;

    if (ganttRef.value.scrollLeft < width) {
      // ???????????????
      right = width - ganttRef.value.clientWidth / 3;
    } else {
      // ???????????????
      left = Math.abs(ganttRef.value.clientWidth / 6 - width);
    }

    // ???????????????ease-in??????
    if (left && right) return;

    const duration = 1000;
    const distance = left || right;
    let oldTimestamp: number | null = null;
    let scrollX = 0;
    let oldLeft: number | undefined; // ?????????????????????????????????????????????

    function step(newTimestamp: number) {
      if (oldTimestamp !== null && ganttRef.value) {
        // if duration is 0 scrollX will be -Infinity
        if (
          ganttRef.value.scrollLeft < left ||
          (right > 0 && ganttRef.value.scrollLeft >= right) ||
          oldLeft === ganttRef.value.scrollLeft
        )
          return;

        const x = (distance * (newTimestamp - oldTimestamp)) / duration;
        if (left) {
          scrollX -= x;
        } else if (right) {
          scrollX += x;
        } else {
          return;
        }
        oldLeft = ganttRef.value.scrollLeft;
        ganttRef.value.scrollLeft += scrollX;
      }
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  return { handleJumpTo, ganttRef };
}
