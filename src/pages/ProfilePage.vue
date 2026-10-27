<template>
  <q-page>
    <div class="text-h5 q-mb-md">Профиль</div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Аккаунт</div>
        <div v-if="account" class="text-body2 q-mt-sm">{{ account.name }} · {{ account.email }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Оформление</div>
        <q-btn-toggle
          :model-value="mode"
          spread
          no-caps
          toggle-color="primary"
          :options="modes"
          @update:model-value="look.applyMode($event)"
        />
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Уведомления</div>
        <q-toggle
          :model-value="prefs.toastEnabled"
          label="Показывать всплывающие сообщения"
          @update:model-value="session.patchPrefs({ toastEnabled: $event })"
        />
      </q-card-section>
    </q-card>

    <q-btn class="q-mt-lg" outline color="negative" icon="logout" label="Выйти" @click="leave" />
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLookStore } from 'src/stores/lookStore';
import { useSessionStore } from 'src/stores/sessionStore';

const router = useRouter();
const look = useLookStore();
const session = useSessionStore();
const { account, prefs } = storeToRefs(session);
const { mode } = storeToRefs(look);

const modes = [
  { label: 'День', value: 'day' },
  { label: 'Ночь', value: 'night' },
];

function leave(): void {
  session.signOut();
  void router.push({ name: 'signin' });
}
</script>
