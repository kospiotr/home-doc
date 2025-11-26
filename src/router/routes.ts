import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/devices',
        component: () => import('pages/DevicesListPage.vue'),
      },
      {
        path: '/settings',
        component: () => import('pages/SettingsPage.vue'),
      },
      {
        path: '/example',
        component: () => import('pages/ExamplePage.vue'),
        meta: { title: 'Example' }
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
