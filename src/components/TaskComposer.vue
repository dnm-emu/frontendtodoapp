<template>
  <form class="q-mb-lg" @submit.prevent="submit">
    <div class="row q-col-gutter-sm items-start">
      <div class="col">
        <q-input
          v-model="title"
          outlined
          dense
          label="Что нужно сделать?"
          :error="!!issues.title"
          @blur="checkField('title', title)"
        />
        <FieldHint :text="issues.title" />
      </div>
      <div class="col-auto">
        <q-select
          v-model="priority"
          dense
          outlined
          emit-value
          map-options
          :options="priorityOptions"
          style="min-width: 140px"
        />
      </div>
      <div class="col-auto">
        <q-btn
          type="submit"
          color="primary"
          unelevated
          icon="playlist_add"
          label="Записать"
          :disable="!title.trim()"
          :loading="busy"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import FieldHint from 'src/components/FieldHint.vue';
import { useFormSchema } from 'src/composables/useFormSchema';
import { newTaskSchema } from 'src/utils/schemas';
import { useTaskStore } from 'src/stores/taskStore';
import { useLookStore } from 'src/stores/lookStore';
import type { TaskPriority } from 'src/types/task';

const tasks = useTaskStore();
const look = useLookStore();
const { busy } = storeToRefs(tasks);
const { issues, check, checkField, resetIssues } = useFormSchema(newTaskSchema);

const title = ref('');
const priority = ref<TaskPriority>('normal');

const priorityOptions = [
  { label: 'Низкий', value: 'low' },
  { label: 'Обычный', value: 'normal' },
  { label: 'Срочно', value: 'high' },
];

async function submit(): Promise<void> {
  resetIssues();
  if (!check({ title: title.value })) return;

  const result = await tasks.create({ title: title.value, priority: priority.value });
  if (result.ok) {
    title.value = '';
    priority.value = 'normal';
    look.pushToast({ tone: 'positive', text: 'Задача появилась в списке' });
  }
}
</script>
