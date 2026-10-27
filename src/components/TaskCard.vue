<template>
  <q-item class="q-py-md" :class="{ 'task-card--done': task.done }">
    <q-item-section avatar>
      <q-checkbox :model-value="task.done" @update:model-value="emit('flip', task.id)" />
    </q-item-section>
    <q-item-section>
      <q-item-label :class="{ 'text-strike text-grey-6': task.done }">
        {{ task.title }}
      </q-item-label>
      <q-item-label caption>
        {{ stamp }}
        <q-badge class="q-ml-sm" :color="badgeColor" outline>
          {{ badgeLabel }}
        </q-badge>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        flat
        round
        dense
        icon="delete_outline"
        color="negative"
        aria-label="Удалить"
        @click="emit('drop', task.id)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from 'src/types/task';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  flip: [id: number];
  drop: [id: number];
}>();

const stamp = computed(() => {
  const date = new Date(props.task.createdAt);
  return date.toLocaleDateString('ru-RU');
});

const badgeLabel = computed(() => {
  if (props.task.priority === 'high') return 'срочно';
  if (props.task.priority === 'low') return 'позже';
  return 'обычно';
});

const badgeColor = computed(() => {
  if (props.task.priority === 'high') return 'negative';
  if (props.task.priority === 'low') return 'grey';
  return 'primary';
});
</script>
