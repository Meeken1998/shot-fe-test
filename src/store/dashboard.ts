import { LoginState, UserInfo } from '@authing/browser/dist/types/global'
import { defineStore } from 'pinia'
import { Component } from 'vue'
import {
  ContactsFilled,
  DeleteFilled,
  PieChartFilled,
  ProjectFilled,
  SettingFilled,
  TagsFilled,
} from '@ant-design/icons-vue'
import { Team } from '@/apis/team'

export type HeaderBarMenuItem = {
  name: string
  key: string
  icon?: Component
  shortened: string
}

export type MenuItem = {
  title: string
  key: string
  icon?: Component
  imageUrl?: string
  parentNode?: string
  onClick?: () => void
  type: 'team' | 'menu' | 'button'
}

export interface DashboardState {
  sidebarKey: string
  user: UserInfo | null
  loginState: LoginState | null
  menuItems: Record<string, MenuItem[]>
  activeMenuItem: MenuItem | null
  headerBarMenuItems: HeaderBarMenuItem[]
  activeHeaderBarMenuKey: string
  currentTeam: Team | null
  userResources: Record<string, string[]>
}

const headerBarMenuItems: HeaderBarMenuItem[] = [
  {
    name: '团队内容',
    shortened: '团队',
    key: 'team',
    icon: ProjectFilled,
  },
  {
    name: '内容数据分析',
    shortened: '数据',
    key: 'data',
    icon: PieChartFilled,
  },
  {
    name: '成员管理',
    shortened: '成员',
    key: 'member',
    icon: ContactsFilled,
  },
  {
    name: '用户管理',
    shortened: '用户',
    key: 'user',
    icon: ContactsFilled,
  },
  {
    name: '内容组管理',
    shortened: '内容组',
    key: 'group',
    icon: TagsFilled,
  },
  {
    name: '设置',
    shortened: '设置',
    key: 'setting',
    icon: SettingFilled,
  },
  {
    name: '回收站',
    shortened: '回收站',
    key: 'recycle',
    icon: DeleteFilled,
  },
]

export function getActiveMenuItem(key: string, menuItems: DashboardState['menuItems']) {
  return Object.values(menuItems)
    .flat()
    .find((m) => m.key === key)
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => {
    return {
      sidebarKey: 'home',
      menuItems: {},
      user: null,
      loginState: null,
      activeMenuItem: null,
      headerBarMenuItems,
      activeHeaderBarMenuKey: 'docs',
      currentTeam: null,
      userResources: {}
    }
  },

  actions: {
    setSidebarKey(val: string) {
      this.sidebarKey = val
    },
    setUser(val: UserInfo) {
      this.user = val
    },
    setLoginState(val: LoginState) {
      this.loginState = val
    },
    setActiveHeaderBarMenuKey(val: string) {
      this.activeHeaderBarMenuKey = val
    },
    setCurrentTeam(val: Team) {
      this.currentTeam = val
    },
  },
})
