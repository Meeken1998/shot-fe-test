import { Authing } from '@authing/browser'

export const sdk = new Authing({
  domain: 'https://storyboard.authing.cn',
  appId: '62dba4a3e1ad8483f1d98045',
  redirectUri: 'http://localhost:8080/login',
})

export function getName(userInfo: any): string {
  return userInfo?.name || userInfo?.nickname || userInfo?.phone || userInfo?.email || '匿名用户'
}
