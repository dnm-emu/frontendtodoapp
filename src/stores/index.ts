import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';

export default store(() => createPinia());

export { useSessionStore } from './sessionStore';
export { useLookStore } from './lookStore';
export { useTaskStore } from './taskStore';
