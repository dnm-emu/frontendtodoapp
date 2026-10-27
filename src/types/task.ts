export type TaskPriority = 'low' | 'normal' | 'high';

export type TaskView = 'everything' | 'open' | 'done';

export interface Task {
  id: number;
  ownerId: number;
  title: string;
  done: boolean;
  priority: TaskPriority;
  createdAt: string;
}

export interface NewTaskPayload {
  title: string;
  priority?: TaskPriority;
}

export interface TaskViewState {
  view: TaskView;
  query: string;
}
