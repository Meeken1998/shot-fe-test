import { createRouter, createWebHistory } from 'vue-router'
import PptistEditor from './PptistEditor.vue'
import Dashboard from '../Dashboard/index.vue'

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      component: Dashboard,
      name: 'dashboard',
      path: '/'
    },
    {
      component: PptistEditor,
      name: 'editor',
      path: '/editor',
    }
  ],
})