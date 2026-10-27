import { storeToRefs } from 'pinia';
import { useTaskStore } from 'src/stores/taskStore';

export const VIEW_CHIPS = [
  { caption: 'Все', value: 'everything' as const },
  { caption: 'В работе', value: 'open' as const },
  { caption: 'Сделано', value: 'done' as const },
];

export function useTaskQuery() {
  const store = useTaskStore();
  const { view, query, visibleTasks, emptyHint } = storeToRefs(store);

  return {
    view,
    query,
    visibleTasks,
    emptyHint,
    chips: VIEW_CHIPS,
    refresh: store.refresh,
    create: store.create,
    flip: store.flip,
    drop: store.drop,
  };
}
