<template>
  <div>
    <q-banner v-if="tasks.length === 0" rounded class="bg-teal-1 text-teal-9">
      <template #avatar>
        <q-icon name="inbox" />
      </template>
      {{ hint }}
    </q-banner>

    <q-list v-else bordered class="rounded-borders bg-white">
      <template v-for="task in tasks" :key="task.id">
        <q-slide-transition appear>
          <div>
            <TaskCard :task="task" @flip="emit('flip', $event)" @drop="emit('drop', $event)" />
            <q-separator />
          </div>
        </q-slide-transition>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import TaskCard from 'src/components/TaskCard.vue';
import type { Task } from 'src/types/task';

withDefaults(
  defineProps<{
    tasks: Task[];
    hint?: string;
  }>(),
  {
    hint: 'Список пуст.',
  },
);

const emit = defineEmits<{
  flip: [id: number];
  drop: [id: number];
}>();
</script>
