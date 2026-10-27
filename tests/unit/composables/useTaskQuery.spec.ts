import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { VIEW_CHIPS } from 'src/composables/useTaskQuery';

vi.mock('src/composables/useNotifyErrors', () => ({
  useNotifyErrors: () => ({ catchFault: vi.fn() }),
}));

describe('useTaskQuery', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('exposes three view chips', () => {
    expect(VIEW_CHIPS.map((chip) => chip.value)).toEqual(['everything', 'open', 'done']);
  });
});
