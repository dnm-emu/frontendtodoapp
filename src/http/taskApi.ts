import { z } from 'zod';
import { requestJson } from './client';
import { fail, ok, type Outcome } from 'src/types/outcome';
import type { NewTaskPayload, Task, TaskPriority } from 'src/types/task';
import { titleRule } from 'src/utils/schemas';

const createRule = z.object({ title: titleRule });

interface RemoteTask {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt: string;
  priority?: TaskPriority;
}

function fromRemote(row: RemoteTask): Task {
  return {
    id: row.id,
    ownerId: row.userId,
    title: row.title,
    done: row.completed,
    priority: row.priority ?? 'normal',
    createdAt: row.createdAt,
  };
}

export function checkNewTask(payload: NewTaskPayload): Outcome<NewTaskPayload> {
  const parsed = createRule.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const field = first?.path[0]?.toString();
    return fail({
      kind: 'input',
      text: first?.message ?? 'Некорректные данные',
      ...(field ? { field } : {}),
    });
  }
  return ok(parsed.data);
}

export function locateTask(list: Task[], id: number): Task | undefined {
  return list.find((item) => item.id === id);
}

export async function listTasks(ownerId: number, abort?: AbortSignal): Promise<Outcome<Task[]>> {
  const result = await requestJson<RemoteTask[]>({
    path: '/todos',
    verb: 'GET',
    query: { userId: ownerId },
    abort,
  });

  if (!result.ok) return result;
  return ok(result.value.map(fromRemote));
}

export async function addTask(ownerId: number, payload: NewTaskPayload): Promise<Outcome<Task>> {
  const checked = checkNewTask(payload);
  if (!checked.ok) return checked;

  const result = await requestJson<RemoteTask>({
    path: '/todos',
    verb: 'POST',
    body: {
      userId: ownerId,
      title: checked.value.title,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: payload.priority ?? 'normal',
      tagIds: [],
    },
  });

  if (!result.ok) return result;
  return ok(fromRemote(result.value));
}

export async function patchTask(id: number, patch: Partial<Task>): Promise<Outcome<Task>> {
  const result = await requestJson<RemoteTask>({
    path: `/todos/${id}`,
    verb: 'PATCH',
    body: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.done !== undefined ? { completed: patch.done } : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
    },
  });

  if (!result.ok) return result;
  return ok(fromRemote(result.value));
}

export async function removeTask(id: number): Promise<Outcome<{ id: number }>> {
  const result = await requestJson<void>({
    path: `/todos/${id}`,
    verb: 'DELETE',
  });

  if (!result.ok) return result;
  return ok({ id });
}
