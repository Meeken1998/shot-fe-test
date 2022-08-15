import { createRouter, createWebHistory } from 'vue-router'
import PptistEditor from './PptistEditor.vue'
import Dashboard from '../Dashboard/index.vue'
import Login from '../user/Login.vue'
import { sdk } from '@/utils/authing'
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { setTitle } from '@/utils/title'
import HomePage from '@/views/components/dashboard/Homepage/index.vue'
import Team from '@/views/components/dashboard/Team/Team.vue'
import JoinTeam from '@/views/components/dashboard/Team/JoinTeam.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      name: 'home',
      component: Dashboard,
      path: '/',
      meta: {
        title: '首页',
      },
      children: [
        {
          component: HomePage,
          path: 'home',
        },
        {
          component: Team,
          path: 'team/:id',
        },
      ],
    },
    {
      component: PptistEditor,
      path: '/editor',
      name: 'editor',
      meta: {
        title: '文档',
      },
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: {
        title: '登录中...',
      },
    },
    {
      name: 'join-team',
      path: '/join-team/:inviteId',
      component: JoinTeam,
      meta: {
        title: '加入团队',
      },
    },
  ],
})

const NEEDNOT_AUTH_ROUTE_NAMES: string[] = ['login', 'join-team']

router.beforeEach((to, _, next) => {
  const { user } = storeToRefs(useDashboardStore())
  if (NEEDNOT_AUTH_ROUTE_NAMES.includes(to?.name as string)) {
    if (to?.meta?.title) {
      setTitle(to.meta.title as string)
    }
    next()
    return
  }
  sdk
    .getUserInfo()
    .then((userInfo) => {
      if (userInfo) {
        user.value = userInfo
        if (to?.meta?.title) {
          setTitle(to.meta.title as string)
        }
        next()
      }
      else {
        next({ name: 'login' })
      }
    })
    .catch((err) => {
      next({ name: 'login' })
    })
})

export default router
