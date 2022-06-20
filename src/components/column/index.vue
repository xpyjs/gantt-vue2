<script lang="ts">
import {
  toRefs,
  computed,
  defineComponent,
  ref,
  getCurrentInstance
} from '@vue/composition-api';
import useParam from '@/composables/useParam';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import useResize from '@/composables/useResize';
import useRender from '@/composables/useRender';
// eslint-disable-next-line import/named
import { CustomCssProperties } from '@/typings/private/CSSProperties';
import { isString } from '@/utils/is';
import { addStyleStrToObject } from '@/utils/common';
import useEvent from '@/composables/event/useEvent';
import ArrowIcon from '../common/Arrow.vue';
import columnProps from './props';

export default defineComponent({
  name: Variables.name.column,

  components: { ArrowIcon },

  props: columnProps,

  setup(props, { slots }) {
    const { dateFormat, label, emptyData, center, columnStyle } = toRefs(props);

    // eslint-disable-next-line no-underscore-dangle
    // const nodeKey = attrs.__key as number;
    const nodeKey = getCurrentInstance()?.vnode.key as number;
    // const rowData = attrs.data as Row;
    const rowData = getCurrentInstance()?.parent?.props.rowData as Row;
    const { GtParam } = useParam();
    const { isMerge, scopeData, textData } = useRender(rowData);

    const realWidth = computed(() => {
      return GtParam.tableHeaders[nodeKey]?.width || 0;
    });

    const colWidth = computed(() => {
      let w = Variables.size.defaultTableColumnWidth;
      if (realWidth.value > 0) {
        w = realWidth.value;
      }

      // 向后查找可合并的节点
      for (let i = (nodeKey as number) + 1; i < GtParam.colNodes.length; i++) {
        const v = GtParam.colNodes[i];
        if (isMerge(v.merge)) {
          w += GtParam.tableHeaders[i]?.width ?? 0;
        } else {
          break;
        }
      }

      return w;
    });
    const rootStyle = computed(() => {
      return {
        '--column-width': `${colWidth.value - 1}px`,
        borderColor: 'var(--j-content-border-color)'
      } as unknown as CustomCssProperties;
    });

    // checkbox & expandbox
    const boxSize = ref(15);
    const boxSizeStyle = computed(() => {
      return { '--box-size': `${boxSize.value}px` } as CustomCssProperties;
    });
    const showCheckbox = computed(() => GtParam.showCheckbox && nodeKey === 0);
    const showExpand = computed(() => GtParam.showExpand && nodeKey === 0);
    const canshowExpand = computed(() => rowData.children.length > 0);
    const expandMarginLeft = computed(() => rowData.level * 10);
    const isExpand = computed(() => rowData.isExpand);

    const checkboxRef = ref<HTMLInputElement>();
    const { onChangeCheckbox } = useEvent(rowData);
    // 鼠标左键，单项切换状态
    function onChangeCheckboxState(e: Event) {
      rowData.setChecked((e.target as HTMLInputElement).checked);
      onChangeCheckbox(rowData.isChecked);
    }
    // 鼠标右键，深度切换状态
    function onRightClick() {
      // 选中时，先选中再抛出事件。取消时相反
      if (!rowData.isChecked) {
        rowData.setChecked(true, true);
        onChangeCheckbox(
          true,
          rowData.getFlattenChildren().filter(v => v.isChecked)
        );
      } else {
        onChangeCheckbox(
          false,
          rowData.getFlattenChildren().filter(v => v.isChecked)
        );
        rowData.setChecked(false, true);
      }
    }

    function onClickExpand() {
      rowData.setExpand(!isExpand.value);
    }

    // chunk content
    const { rowHeight } = useResize();
    const chunkStyle = computed(() => {
      let h = {
        '--row-height': `${rowHeight.value}px`,
        justifyContent: center.value ? 'center' : 'flex-start'
      } as unknown as CustomCssProperties;

      if (columnStyle.value && Object.keys(columnStyle.value).length > 0) {
        if (isString(columnStyle.value)) {
          addStyleStrToObject(h, columnStyle.value);
        } else {
          h = { ...h, ...columnStyle.value };
        }
      }

      return h;
    });

    const isChunkNode = computed(() => !!slots?.default);
    const chunkNode = computed(() => {
      return slots?.default && slots.default(scopeData(dateFormat?.value))[0];
    });

    const chunkText = computed(() => {
      return (
        !isChunkNode.value &&
        textData(label?.value, dateFormat?.value, emptyData.value)
      );
    });

    return {
      rowData,
      rootStyle,
      boxSizeStyle,
      showCheckbox,
      showExpand,
      canshowExpand,
      expandMarginLeft,
      isExpand,
      checkboxRef,
      onChangeCheckboxState,
      onRightClick,
      onClickExpand,
      chunkStyle,
      isChunkNode,
      chunkNode,
      chunkText
    };
  },

  render(h) {
    const {
      rowData,
      rootStyle,
      boxSizeStyle,
      showCheckbox,
      showExpand,
      canshowExpand,
      expandMarginLeft,
      isExpand,
      onChangeCheckboxState,
      onRightClick,
      onClickExpand,
      chunkStyle,
      isChunkNode,
      chunkNode,
      chunkText
    } = this as any;

    return h(
      'div',
      {
        class: { 'gt-column': true, 'gt-noselect': !this.selectable },
        style: rootStyle
      },
      [
        showCheckbox &&
          h('input', {
            class: { 'gt-column__checkbox': true },
            style: boxSizeStyle,
            attrs: {
              type: 'checkbox',
              name: 'checkbox',
              id: 'checkbox',
              checked: rowData.isChecked
            },
            on: {
              change: onChangeCheckboxState,
              contextmenu: (e: Event) => {
                e.preventDefault();
                onRightClick();
              },
              click: (e: Event) => {
                e.stopPropagation();
              },
              dblclick: (e: Event) => {
                e.stopPropagation();
              }
            }
          }),

        showExpand &&
          h(
            'div',
            {
              class: { 'gt-column__expand': true, 'gt-hide': !canshowExpand },
              style: {
                marginLeft: `${expandMarginLeft}px`,
                ...boxSizeStyle
              },
              on: {
                click: (e: Event) => {
                  e.stopPropagation();
                  onClickExpand();
                },
                dblclick: (e: Event) => {
                  e.stopPropagation();
                }
              }
            },
            [
              h('ArrowIcon', {
                props: {
                  direction: isExpand ? 'down' : 'right'
                }
              })
            ]
          ),

        // 加载内容
        h(
          'div',
          {
            class: ['gt-column__chunk', this.columnClass],
            style: chunkStyle
          },
          [isChunkNode ? chunkNode : chunkText]
        )
      ]
    );
  }
});
</script>

<style scoped lang="scss">
.gt-column {
  width: calc(var(--column-width) - 4px);
  height: calc(100% - 4px);
  padding: 2px;
  display: flex;
  flex-shrink: 0;
  border-right: 1px solid var(--j-content-border-color);

  .gt-column__checkbox {
    width: var(--box-size);
    height: var(--box-size);
    flex-shrink: 0;
    margin: auto 5px;
  }

  .gt-column__expand {
    width: var(--box-size);
    height: var(--box-size);
    flex-shrink: 0;
    margin: auto 5px auto 0;
  }

  .gt-column__chunk {
    width: 100%;
    height: calc(var(--row-height) - 4px);
    line-height: calc(var(--row-height) - 4px);
    display: flex;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
