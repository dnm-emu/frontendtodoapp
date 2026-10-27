<template>
  <q-layout view="hHh LpR fFf" class="daylist-shell">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="menu" aria-label="Меню" @click="look.flipMenu" />
        <q-toolbar-title>DayList</q-toolbar-title>
        <q-btn
          flat
          round
          :icon="look.night ? 'light_mode' : 'dark_mode'"
          aria-label="Тема"
          @click="look.flipMode"
        />
        <q-btn flat round icon="logout" aria-label="Выход" @click="leave" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="menuOpen" show-if-above bordered>
      <q-list padding>
        <q-item-label header>Разделы</q-item-label>
        <q-item clickable v-ripple :to="{ name: 'board' }" exact>
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>
            <q-item-label>Доска</q-item-label>
            <q-item-label caption>Задачи на сегодня</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple :to="{ name: 'profile' }">
          <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
          <q-item-section>
            <q-item-label>Профиль</q-item-label>
            <q-item-label caption>Тема и уведомления</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <q-item v-if="session.account">
        <q-item-section avatar>
          <q-avatar color="secondary" text-color="white">{{ initials }}</q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ session.account.name }}</q-item-label>
          <q-item-label caption>{{ session.account.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md">
        <PathCrumbs />
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import PathCrumbs from 'src/components/PathCrumbs.vue';
import { useLookStore } from 'src/stores/lookStore';
import { useSessionStore } from 'src/stores/sessionStore';
import { useTaskStore } from 'src/stores/taskStore';

const $q = useQuasar();
const router = useRouter();
const look = useLookStore();
const session = useSessionStore();
const tasks = useTaskStore();
const { menuOpen } = storeToRefs(look);

const initials = computed(() => {
  const name = session.account?.name ?? 'U';
  return name.slice(0, 1).toUpperCase();
});

watch(
  () => look.toast,
  (payload) => {
    if (!payload) return;
    $q.notify({
      type: payload.tone,
      message: payload.text,
      actions: payload.action
        ? [{ label: payload.action.caption, color: 'white', handler: payload.action.run }]
        : undefined,
    });
    look.clearToast();
  },
);

function leave(): void {
  session.signOut();
  tasks.setMessage(null);
  void router.push({ name: 'signin' });
}
</script>
