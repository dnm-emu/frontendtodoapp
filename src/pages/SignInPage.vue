<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: min(420px, 92vw)">
      <q-card-section class="text-center">
        <q-icon name="event_note" size="42px" color="primary" />
        <div class="text-h5 q-mt-sm">DayList</div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Учебный вход: user@test.com / 123456
        </div>
      </q-card-section>
      <q-card-section>
        <form @submit.prevent="submit">
          <q-input
            v-model="email"
            outlined
            type="email"
            label="Почта"
            class="q-mb-sm"
            :error="!!issues.email"
            @blur="onEmailBlur"
          />
          <FieldHint :text="issues.email" />

          <q-input
            v-model="password"
            outlined
            type="password"
            label="Пароль"
            class="q-mb-sm"
            :error="!!issues.password"
            @blur="checkField('password', password)"
          />
          <FieldHint :text="issues.password" />
          <FieldHint :text="session.lastFault ?? undefined" />

          <q-btn
            type="submit"
            unelevated
            color="primary"
            class="full-width q-mt-md"
            label="Войти"
            :loading="session.busy"
          />
        </form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FieldHint from 'src/components/FieldHint.vue';
import { useFormSchema } from 'src/composables/useFormSchema';
import { probeEmailTaken, signInSchema } from 'src/utils/schemas';
import { useSessionStore } from 'src/stores/sessionStore';
import { useLookStore } from 'src/stores/lookStore';

const router = useRouter();
const route = useRoute();
const session = useSessionStore();
const look = useLookStore();
const { issues, check, checkField, checkLater } = useFormSchema(signInSchema);

const email = ref('user@test.com');
const password = ref('123456');

async function onEmailBlur(): Promise<void> {
  if (!checkField('email', email.value)) return;
  await checkLater('email', () => probeEmailTaken(email.value));
}

async function submit(): Promise<void> {
  if (!check({ email: email.value, password: password.value })) return;
  const result = await session.signIn({ email: email.value, password: password.value });
  if (!result.ok) return;
  look.pushToast({ tone: 'positive', text: `Привет, ${result.value.account.name}` });
  const next = typeof route.query.next === 'string' ? route.query.next : '/';
  await router.push(next);
}
</script>
