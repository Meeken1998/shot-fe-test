import useRequest from '@/hooks/useRequest'
import { User } from 'authing-js-sdk'

const { get, post } = useRequest()

export function getUserInfo() {
  return get<User>('/api/users', {})
}

export function getUserInfoById(userId: string) {
  return get<User>(`/api/users/${userId}`, {})
}

export function searchUsers(keyword: string) {
  return post<User[]>('/api/users/search', { keyword })
}

export function getUserResources() {
  if (!localStorage.getItem('team')) return Promise.resolve({})
  return get<Record<string, string[]>>(`/api/users/resources`)
}
