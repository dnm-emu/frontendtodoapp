import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Dark } from 'quasar';
import { usePersist } from 'src/composables/usePersist';
import type { ColorMode, LookSnapshot, ToastPayload } from 'src/types/look';

const KEY = 'daylist-look';

const empty: LookSnapshot = {
  mode: 'day',
  menuOpen: false,
};

export const useLookStore = defineStore('look', () => {
  const snapshot = usePersist<LookSnapshot>(KEY, empty);
  const toast = ref<ToastPayload | null>(null);

  const mode = computed(() => snapshot.value.mode);
  const night = computed(() => snapshot.value.mode === 'night');
  const menuOpen = computed({
    get: () => snapshot.value.menuOpen,
    set: (value: boolean) => {
      snapshot.value = { ...snapshot.value, menuOpen: value };
    },
  });

  function applyMode(next: ColorMode): void {
    snapshot.value = { ...snapshot.value, mode: next };
    Dark.set(next === 'night');
  }

  function flipMode(): void {
    applyMode(snapshot.value.mode === 'night' ? 'day' : 'night');
  }

  function flipMenu(): void {
    snapshot.value = { ...snapshot.value, menuOpen: !snapshot.value.menuOpen };
  }

  function pushToast(payload: ToastPayload): void {
    toast.value = payload;
  }

  function clearToast(): void {
    toast.value = null;
  }

  applyMode(snapshot.value.mode);

  return {
    mode,
    night,
    menuOpen,
    toast,
    applyMode,
    flipMode,
    flipMenu,
    pushToast,
    clearToast,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLookStore, import.meta.hot));
}
