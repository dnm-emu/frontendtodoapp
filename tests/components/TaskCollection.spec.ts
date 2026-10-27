import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskCollection from 'src/components/TaskCollection.vue';

describe('TaskCollection', () => {
  it('shows hint when list is empty', () => {
    const wrapper = mount(TaskCollection, {
      props: { tasks: [], hint: 'Пока пусто' },
      global: {
        stubs: {
          QBanner: { template: '<div class="banner"><slot /><slot name="avatar" /></div>' },
          QIcon: true,
          QList: true,
          QSlideTransition: true,
          QSeparator: true,
          TaskCard: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Пока пусто');
  });
});
