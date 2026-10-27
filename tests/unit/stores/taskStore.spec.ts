import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import * as taskApi from 'src/http/taskApi';
import { useTaskStore } from 'src/stores/taskStore';
import { useSessionStore } from 'src/stores/sessionStore';

vi.mock('src/composables/useNotifyErrors', () => ({
  useNotifyErrors: () => ({ catchFault: vi.fn() }),
}));

vi.mock('src/http/taskApi', async () => {
  const actual = await vi.importActual<typeof import('src/http/taskApi')>('src/http/taskApi');
  return {
    ...actual,
    listTasks: vi.fn(),
    addTask: vi.fn(),
    patchTask: vi.fn(),
    removeTask: vi.fn(),
  };
});

describe('taskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(taskApi.listTasks).mockResolvedValue({ ok: true, value: [] });
    const session = useSessionStore();
    session.remember({ id: 1, email: 'user@test.com', name: 'Студент' }, 'token');
  });

  it('loads tasks for a signed-in account', async () => {
    vi.mocked(taskApi.listTasks).mockResolvedValue({
      ok: true,
      value: [
        {
          id: 1,
          ownerId: 1,
          title: 'Конспект',
          done: false,
          priority: 'normal',
          createdAt: '2026-01-01',
        },
      ],
    });

    const store = useTaskStore();
    const result = await store.refresh();
    expect(result.ok).toBe(true);
    expect(store.items).toHaveLength(1);
  });

  it('keeps a validation fault from create', async () => {
    vi.mocked(taskApi.addTask).mockResolvedValue({
      ok: false,
      fault: { kind: 'input', text: 'Название не может быть пустым' },
    });

    const store = useTaskStore();
    const result = await store.create({ title: '' });
    expect(result.ok).toBe(false);
    expect(store.message).toBe('Название не может быть пустым');
  });

  it('filters open tasks', async () => {
    vi.mocked(taskApi.listTasks).mockResolvedValue({
      ok: true,
      value: [
        {
          id: 1,
          ownerId: 1,
          title: 'Открытая',
          done: false,
          priority: 'low',
          createdAt: '2026-01-01',
        },
        {
          id: 2,
          ownerId: 1,
          title: 'Закрытая',
          done: true,
          priority: 'low',
          createdAt: '2026-01-01',
        },
      ],
    });

    const store = useTaskStore();
    await store.refresh();
    store.view = 'open';
    expect(store.visibleTasks).toHaveLength(1);
    expect(store.visibleTasks[0]?.title).toBe('Открытая');
  });
});
