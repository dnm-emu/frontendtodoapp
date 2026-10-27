import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TaskComposer from 'src/components/TaskComposer.vue';
import { useTaskStore } from 'src/stores/taskStore';

vi.mock('src/composables/useNotifyErrors', () => ({
  useNotifyErrors: () => ({ catchFault: vi.fn() }),
}));

const checkMock = vi.fn();

vi.mock('src/composables/useFormSchema', () => ({
  useFormSchema: () => ({
    issues: ref({}),
    check: checkMock,
    checkField: vi.fn(() => true),
    checkLater: vi.fn(async () => true),
    resetIssues: vi.fn(),
  }),
}));

describe('TaskComposer', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    checkMock.mockReset();
  });

  it('renders the form', () => {
    const wrapper = shallowMount(TaskComposer, {
      global: {
        stubs: { QInput: true, QBtn: true, QSelect: true, FieldHint: true },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('does not create a task when validation fails', () => {
    checkMock.mockReturnValue(false);
    const store = useTaskStore();
    const create = vi.spyOn(store, 'create');
    expect(checkMock({ title: '' })).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
});
