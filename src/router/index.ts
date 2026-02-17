import MainPage from '@/pages/MainPage.vue';
import GamePage from '@/pages/GamePage.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/game/:id',
      name: 'game',
      component: GamePage,
    },
  ],
});

export default router;
