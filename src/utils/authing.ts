import { Authing } from '@authing/browser'

export const sdk = new Authing({
  domain: 'https://storyboard-dev.authing.cn',
  appId: '63632cc9e668a27bb0da2ce7',
  redirectUri: process.env.NODE_ENV !== 'development' ? 'https://shot-test.aside.fun/login' : 'http://localhost:8080/login',
})

export function getName(userInfo: any): string {
  return userInfo?.name || userInfo?.nickname || userInfo?.phone || userInfo?.email || '匿名用户'
}
