import type { RouteRecordRaw } from 'vue-router';
import 'src/types/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/WorkspaceLayout.vue'),
    meta: { private: true },
    children: [
      {
        path: '',
        name: 'board',
        component: () => import('src/pages/BoardPage.vue'),
        meta: { heading: 'Доска задач', crumb: 'Доска' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('src/pages/ProfilePage.vue'),
        meta: { heading: 'Профиль', crumb: 'Профиль' },
      },
    ],
  },
  {
    path: '/signin',
    component: () => import('src/layouts/GuestLayout.vue'),
    meta: { publicOnly: true },
    children: [
      {
        path: '',
        name: 'signin',
        component: () => import('src/pages/SignInPage.vue'),
        meta: { heading: 'Вход', crumb: 'Вход' },
      },
    ],
  },
  {
    path: '/missing',
    name: 'missing',
    component: () => import('src/pages/MissingPage.vue'),
    meta: { heading: 'Не найдено', crumb: '404' },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/missing',
  },
];

export default routes;
