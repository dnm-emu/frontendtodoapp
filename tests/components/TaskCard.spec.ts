import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskCard from 'src/components/TaskCard.vue';
import type { Task } from 'src/types/task';

const sample: Task = {
  id: 7,
  ownerId: 1,
  title: 'Проверить тесты',
  done: false,
  priority: 'high',
  createdAt: '2026-03-01T00:00:00.000Z',
};

describe('TaskCard', () => {
  it('renders the title', () => {
    const wrapper = mount(TaskCard, {
      props: { task: sample },
      global: {
        stubs: {
          QItem: { template: '<div><slot /></div>' },
          QItemSection: { template: '<div><slot /></div>' },
          QItemLabel: { template: '<div><slot /></div>' },
          QCheckbox: true,
          QBadge: { template: '<span><slot /></span>' },
          QBtn: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Проверить тесты');
    expect(wrapper.text()).toContain('срочно');
  });

  it('emits flip', async () => {
    const wrapper = mount(TaskCard, {
      props: { task: sample },
      global: {
        stubs: {
          QItem: { template: '<div><slot /></div>' },
          QItemSection: { template: '<div><slot /></div>' },
          QItemLabel: { template: '<div><slot /></div>' },
          QCheckbox: {
            template: '<input type="checkbox" @change="$emit(\'update:modelValue\', true)" />',
          },
          QBadge: { template: '<span><slot /></span>' },
          QBtn: true,
        },
      },
    });

    await wrapper.find('input').trigger('change');
    expect(wrapper.emitted('flip')?.[0]).toEqual([7]);
  });
});
