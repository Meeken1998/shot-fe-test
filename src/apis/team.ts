import useRequest from '@/hooks/useRequest'
import { UserInfo } from '@authing/browser/dist/types/global'
import { Docs } from './docs'

const { post, get } = useRequest()

export interface Team {
  id: string // authing tanantId
  name: string
  logo?: string
  description?: string
}

export type CreateTeamPayload = {
  name: string
  description?: string
  logoUrl?: string
}

export type TeamDetail = {
  team: Team
  docs: Docs[]
}

export type TeamMemberResponse = {
  list: Array<{
    id: string
    tenantId: string
    user: UserInfo
  }>
  listTotal: number
}

export enum TeamInviteType {
  INDIVIDUAL = 1,
  PUBLIC = 2,
}

export type TeamInvite = {
  _id: string
  inviterUserId: string
  targetUserId?: string
  teamId: string
  type: TeamInviteType
  outdateTimestamp: number
}

export function createTeam(payload: CreateTeamPayload) {
  return post<boolean>('/api/teams/create', payload)
}

export function getTeams() {
  return get<Team[]>('/api/teams', {})
}

export function getTeamDetail(teamId: string) {
  return get<TeamDetail>(`/api/teams/${teamId}/detail`)
}

export function getTeamInviteInfo(inviteId: string) {
  return get<{
    team: Team
    invite: TeamInvite
  }>(`/api/teams/invites/${inviteId}`)
}

export function getTeamMembers(teamId: string) {
  return get<TeamMemberResponse>(`/api/teams/${teamId}/members`)
}

export function createTeamInviteLink(teamId: string, inviterUserId: string, targetUserId?: string) {
  return post<string>(`/api/teams/invites/${teamId}`, {
    inviterUserId,
    targetUserId,
  })
}

export function acceptTeamInvite(inviteId: string) {
  return post<boolean>(`/api/teams/invites/${inviteId}/accept`, {})
}
