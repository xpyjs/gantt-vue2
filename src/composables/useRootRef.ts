import { readonly } from '@vue/composition-api';
import { useStore } from '@/store';

export function useInitRootRef() {
  const store = useStore();
  return { rootRef: store.rootRef };
}

export default () => {
  const store = useStore();
  return { rootRef: readonly(store.rootRef) };
};
