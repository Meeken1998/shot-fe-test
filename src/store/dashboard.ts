import { LoginState, UserInfo } from '@authing/browser/dist/types/global'
import { defineStore } from 'pinia'
import { Component } from 'vue'

export type MenuItem = {
  title: string;
  key: string;
  icon?: Component;
  imageUrl?: string;
  parentNode?: string;
  onClick?: () => void;
  type: 'team' | 'menu' | 'button';
}

export interface DashboardState {
  sidebarKey: string;
  user: UserInfo | null;
  loginState: LoginState | null;
  menuItems: Record<string, MenuItem[]>;
  activeMenuItem: MenuItem | null;
}

export function getActiveMenuItem(key: string, menuItems: DashboardState['menuItems']) {
  return Object.values(menuItems).flat().find(m => m.key === key)
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => {
    return {
      sidebarKey: 'home',
      menuItems: {},
      user: null,
      loginState: null,
      activeMenuItem: null,
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
  }
})