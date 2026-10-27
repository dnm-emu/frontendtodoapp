import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { usePersist } from 'src/composables/usePersist';
import { useNotifyErrors } from 'src/composables/useNotifyErrors';
import { refreshRequest, signInRequest } from 'src/http/sessionApi';
import type { Outcome } from 'src/types/outcome';
import type { Account, AccountPrefs, SessionSnapshot, SignInPayload, SignInResult } from 'src/types/account';
import { tryOfflineSignIn } from 'src/utils/offlineAuth';

const KEY = 'daylist-session';

const defaultPrefs: AccountPrefs = {
  locale: 'ru',
  toastEnabled: true,
};

const empty: SessionSnapshot = {
  account: null,
  accessToken: null,
  prefs: defaultPrefs,
};

export const useSessionStore = defineStore('session', () => {
  const snapshot = usePersist<SessionSnapshot>(KEY, empty);
  const busy = ref(false);
  const lastFault = ref<string | null>(null);
  const { catchFault } = useNotifyErrors();

  const account = computed(() => snapshot.value.account);
  const accessToken = computed(() => snapshot.value.accessToken);
  const prefs = computed(() => snapshot.value.prefs);
  const signedIn = computed(() => snapshot.value.accessToken !== null && snapshot.value.account !== null);

  function remember(next: Account, token: string): void {
    snapshot.value = { ...snapshot.value, account: next, accessToken: token };
  }

  function putToken(token: string): void {
    snapshot.value = { ...snapshot.value, accessToken: token };
  }

  async function signIn(payload: SignInPayload): Promise<Outcome<SignInResult>> {
    busy.value = true;
    lastFault.value = null;

    const result = await signInRequest(payload);
    busy.value = false;

    if (!result.ok) {
      const local = tryOfflineSignIn(payload.email, payload.password);
      if (local) {
        remember(local.account, local.accessToken);
        return { ok: true, value: local };
      }
      lastFault.value = result.fault.text;
      catchFault(result.fault, 'session.signIn');
      return result;
    }

    remember(result.value.account, result.value.accessToken);
    return result;
  }

  async function renew(): Promise<Outcome<{ accessToken: string }>> {
    if (!snapshot.value.accessToken) {
      return { ok: false, fault: { kind: 'transport', text: 'Нет токена' } };
    }
    const result = await refreshRequest(snapshot.value.accessToken);
    if (result.ok) {
      putToken(result.value.accessToken);
    }
    return result;
  }

  function signOut(): void {
    snapshot.value = { ...snapshot.value, account: null, accessToken: null };
    lastFault.value = null;
  }

  function patchPrefs(patch: Partial<AccountPrefs>): void {
    snapshot.value = {
      ...snapshot.value,
      prefs: { ...snapshot.value.prefs, ...patch },
    };
  }

  return {
    account,
    accessToken,
    prefs,
    signedIn,
    busy,
    lastFault,
    signIn,
    renew,
    signOut,
    patchPrefs,
    remember,
    putToken,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
