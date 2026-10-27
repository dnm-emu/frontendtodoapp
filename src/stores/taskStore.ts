import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { usePersist } from 'src/composables/usePersist';
import { useNotifyErrors } from 'src/composables/useNotifyErrors';
import { addTask, listTasks, locateTask, patchTask, removeTask } from 'src/http/taskApi';
import { useSessionStore } from 'src/stores/sessionStore';
import type { Outcome } from 'src/types/outcome';
import type { NewTaskPayload, Task, TaskView, TaskViewState } from 'src/types/task';
import { isOfflineToken } from 'src/utils/offlineAuth';

const VIEW_KEY = 'daylist-view';

const defaultView: TaskViewState = {
  view: 'everything',
  query: '',
};

export const useTaskStore = defineStore('tasks', () => {
  const viewState = usePersist<TaskViewState>(VIEW_KEY, defaultView);
  const session = useSessionStore();
  const { catchFault } = useNotifyErrors();

  const items = ref<Task[]>([]);
  const busy = ref(false);
  const message = ref<string | null>(null);

  const view = computed({
    get: (): TaskView => viewState.value.view,
    set: (next: TaskView) => {
      viewState.value = { ...viewState.value, view: next };
    },
  });

  const query = computed({
    get: (): string => viewState.value.query,
    set: (next: string) => {
      viewState.value = { ...viewState.value, query: next };
    },
  });

  const total = computed(() => items.value.length);
  const openCount = computed(() => items.value.filter((item) => !item.done).length);
  const doneCount = computed(() => items.value.filter((item) => item.done).length);

  const visibleTasks = computed((): Task[] => {
    let rows = items.value;
    if (view.value === 'open') rows = rows.filter((item) => !item.done);
    if (view.value === 'done') rows = rows.filter((item) => item.done);

    const needle = query.value.trim().toLowerCase();
    if (needle) {
      rows = rows.filter((item) => item.title.toLowerCase().includes(needle));
    }
    return rows;
  });

  const emptyHint = computed((): string => {
    if (items.value.length === 0) {
      return 'Пока пусто — добавьте первую задачу справа от поля ввода.';
    }
    return 'Ничего не подошло под фильтр или поиск.';
  });

  function shelfKey(): string {
    return `daylist-shelf-${session.account?.id ?? 0}`;
  }

  function readShelf(): Task[] {
    const raw = localStorage.getItem(shelfKey());
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Task[]) : [];
    } catch {
      return [];
    }
  }

  function writeShelf(rows: Task[]): void {
    localStorage.setItem(shelfKey(), JSON.stringify(rows));
  }

  function offline(): boolean {
    return isOfflineToken(session.accessToken);
  }

  function seed(): Task[] {
    const ownerId = session.account?.id ?? 0;
    return [
      {
        id: 11,
        ownerId,
        title: 'Собрать конспект по Pinia',
        done: false,
        priority: 'high',
        createdAt: new Date().toISOString(),
      },
      {
        id: 12,
        ownerId,
        title: 'Прогнать unit-тесты перед сдачей',
        done: true,
        priority: 'normal',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async function refresh(): Promise<Outcome<Task[]>> {
    if (!session.account) {
      items.value = [];
      return { ok: false, fault: { kind: 'transport', text: 'Сначала войдите в аккаунт' } };
    }

    if (offline()) {
      let rows = readShelf();
      if (rows.length === 0) {
        rows = seed();
        writeShelf(rows);
      }
      items.value = rows;
      return { ok: true, value: rows };
    }

    busy.value = true;
    message.value = null;
    const result = await listTasks(session.account.id);
    busy.value = false;

    if (!result.ok) {
      message.value = result.fault.text;
      catchFault(result.fault, 'tasks.refresh', () => {
        void refresh();
      });
      return result;
    }

    items.value = result.value;
    return result;
  }

  async function create(payload: NewTaskPayload): Promise<Outcome<Task>> {
    if (!session.account) {
      const fault = { kind: 'transport' as const, text: 'Нужна авторизация' };
      message.value = fault.text;
      catchFault(fault, 'tasks.create');
      return { ok: false, fault };
    }

    if (offline()) {
      const created: Task = {
        id: Date.now(),
        ownerId: session.account.id,
        title: payload.title,
        done: false,
        priority: payload.priority ?? 'normal',
        createdAt: new Date().toISOString(),
      };
      items.value = [created, ...items.value];
      writeShelf(items.value);
      return { ok: true, value: created };
    }

    busy.value = true;
    message.value = null;
    const result = await addTask(session.account.id, payload);
    busy.value = false;

    if (!result.ok) {
      message.value = result.fault.text;
      catchFault(result.fault, 'tasks.create');
      return result;
    }

    items.value = [result.value, ...items.value];
    return result;
  }

  async function flip(id: number): Promise<Outcome<Task>> {
    const current = locateTask(items.value, id);
    if (!current) {
      const fault = { kind: 'missing' as const, text: 'Задача не найдена', entityId: id };
      message.value = fault.text;
      catchFault(fault, 'tasks.flip');
      return { ok: false, fault };
    }

    if (offline()) {
      const next = { ...current, done: !current.done };
      items.value = items.value.map((item) => (item.id === id ? next : item));
      writeShelf(items.value);
      return { ok: true, value: next };
    }

    busy.value = true;
    message.value = null;
    const result = await patchTask(id, { done: !current.done });
    busy.value = false;

    if (!result.ok) {
      message.value = result.fault.text;
      catchFault(result.fault, 'tasks.flip', () => {
        void flip(id);
      });
      return result;
    }

    items.value = items.value.map((item) => (item.id === id ? result.value : item));
    return result;
  }

  async function drop(id: number): Promise<Outcome<{ id: number }>> {
    const current = locateTask(items.value, id);
    if (!current) {
      const fault = { kind: 'missing' as const, text: 'Задача не найдена', entityId: id };
      message.value = fault.text;
      catchFault(fault, 'tasks.drop');
      return { ok: false, fault };
    }

    if (offline()) {
      items.value = items.value.filter((item) => item.id !== id);
      writeShelf(items.value);
      return { ok: true, value: { id } };
    }

    busy.value = true;
    message.value = null;
    const result = await removeTask(id);
    busy.value = false;

    if (!result.ok) {
      message.value = result.fault.text;
      catchFault(result.fault, 'tasks.drop', () => {
        void drop(id);
      });
      return result;
    }

    items.value = items.value.filter((item) => item.id !== id);
    return result;
  }

  function setMessage(text: string | null): void {
    message.value = text;
  }

  watch(
    () => session.signedIn,
    (on) => {
      if (on) {
        void refresh();
      } else {
        items.value = [];
      }
    },
    { immediate: true },
  );

  return {
    items,
    view,
    query,
    visibleTasks,
    emptyHint,
    total,
    openCount,
    doneCount,
    busy,
    message,
    refresh,
    create,
    flip,
    drop,
    setMessage,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot));
}
