<template>
  <q-page>
    <div class="row items-center q-mb-md">
      <div class="text-h5">Доска задач</div>
      <q-space />
      <div class="row q-gutter-sm">
        <q-chip class="stat-chip" color="teal-1" text-color="teal-9" icon="format_list_bulleted">
          Всего {{ tasks.total }}
        </q-chip>
        <q-chip class="stat-chip" color="amber-1" text-color="orange-10" icon="hourglass_empty">
          В работе {{ tasks.openCount }}
        </q-chip>
        <q-chip class="stat-chip" color="green-1" text-color="green-9" icon="done_all">
          Готово {{ tasks.doneCount }}
        </q-chip>
      </div>
    </div>

    <q-linear-progress v-if="tasks.busy" indeterminate color="primary" class="q-mb-md" />
    <q-banner v-if="tasks.message" class="bg-red-1 text-negative q-mb-md" rounded>
      {{ tasks.message }}
    </q-banner>

    <TaskComposer />

    <div class="row q-col-gutter-sm q-mb-md items-center">
      <div class="col">
        <q-input v-model="query" outlined dense clearable label="Найти по названию">
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-auto">
        <q-btn-toggle
          v-model="view"
          unelevated
          no-caps
          toggle-color="primary"
          :options="toggleOptions"
        />
      </div>
    </div>

    <TaskCollection
      :tasks="visibleTasks"
      :hint="emptyHint"
      @flip="onFlip"
      @drop="onDrop"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TaskComposer from 'src/components/TaskComposer.vue';
import TaskCollection from 'src/components/TaskCollection.vue';
import { useTaskQuery } from 'src/composables/useTaskQuery';
import { useTaskStore } from 'src/stores/taskStore';

const tasks = useTaskStore();
const { view, query, visibleTasks, emptyHint, chips } = useTaskQuery();

const toggleOptions = computed(() =>
  chips.map((chip) => ({ label: chip.caption, value: chip.value })),
);

function onFlip(id: number): void {
  void tasks.flip(id);
}

function onDrop(id: number): void {
  void tasks.drop(id);
}
</script>
