import { createRouter, createWebHistory } from 'vue-router'
import { sdk } from '@/utils/authing'
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { setTitle } from '@/utils/title'
import Login from '../user/Login.vue'
import Team from '@/views/components/dashboard/Team/Team.vue'
import HomePage from '@/views/components/dashboard/Homepage/index.vue'
import UnpublishedTips from '@/views/components/widget/UnpublishedTips.vue'
import TeamMember from '@/views/components/dashboard/Member/TeamMember.vue'
import EditorLandingPage from '@/views/Editor/EditorLandingPage.vue'
import PptistEditor from '@/views/Editor/PptistEditor.vue'
import JoinTeam from '@/views/components/dashboard/Team/JoinTeam.vue'


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
          component: HomePage,
          path: 'home',
        },
        {
          component: Team,
          path: 'team/:teamId',
        },
        {
          component: TeamMember,
          path: 'member/:teamId',
        },
        ...['data', 'recycle', 'setting', 'group', 'user'].map((s) => ({
          component: UnpublishedTips,
          path: `${s}/:teamId`,
        })),
      ],
    },
    {
      component: EditorLandingPage,
      path: '/createDocs',
      name: 'createDocs',
      meta: {
        title: '新建文档',
      },
    },
    {
      component: PptistEditor,
      path: '/editor/:id',
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
