import { createRouter, createWebHistory } from 'vue-router'
import { sdk } from '@/utils/authing'
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { setTitle } from '@/utils/title'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      name: 'home',
      component: import('../Dashboard/index.vue'),
      path: '/',
      meta: {
        title: '',
      },
      children: [
        {
          component: import('@/views/components/dashboard/Homepage/index.vue'),
          path: 'home',
        },
        {
          component: import('@/views/components/dashboard/Team/Team.vue'),
          path: 'team/:teamId',
        },
        {
          component: import('@/views/components/dashboard/Member/TeamMember.vue'),
          path: 'member/:teamId',
        },
        ...['data', 'recycle', 'setting', 'group', 'user'].map((s) => ({
          component: import('@/views/components/widget/UnpublishedTips.vue'),
          path: `${s}/:teamId`,
        })),
      ],
    },
    {
      component: import('@/views/Editor/EditorLandingPage.vue'),
      path: '/createDocs',
      name: 'createDocs',
      meta: {
        title: '新建文档',
      },
    },
    {
      component: import('@/views/Editor/PptistEditor.vue'),
      path: '/editor/:id',
      meta: {
        title: '文档',
      },
    },
    {
      name: 'login',
      path: '/login',
      component: import('../user/Login.vue'),
      meta: {
        title: '登录中...',
      },
    },
    {
      name: 'join-team',
      path: '/join-team/:inviteId',
      component: import('@/views/components/dashboard/Team/JoinTeam.vue'),
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
