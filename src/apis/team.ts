import useRequest from '@/hooks/useRequest'
import { UserInfo } from '@authing/browser/dist/types/global'
import { User } from 'authing-js-sdk'
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

export enum TeamInviteLinkOutdateType {
  SEVEN_DAYS = 1,
  NEVER = 2,
}


export enum TeamInviteStatus {
  EFFECTIVE = 1,
  ACCEPTED = 2,
  DISABLED = 3,
}

export type TeamInvite = {
  _id: string
  inviterUserId: string
  targetUserId?: string
  teamId: string
  type: TeamInviteType
  status: TeamInviteStatus
  outdateTimestamp: number
  acceptedUserIds: string[]
  remark?: string
  createdTimestamp: number
}

export type TeamInviteWithUserProfile = TeamInvite & {
  acceptedUsers?: Partial<User>[]
  inviterUser?: Partial<User>
  targetUser?: Partial<User>
}

export function createTeam(payload: CreateTeamPayload) {
  return post<boolean>('/api/teams/create', payload)
}

export function getTeams() {
  return get<Team[]>('/api/teams', {})
}

export function getTeamDetail(teamId: string) {
  return get<Team>(`/api/teams/${teamId}/detail`)
}

export function getTeamDocs(teamId: string) {
  return get<Docs[]>(`/api/teams/${teamId}/docs`)
}

export function getTeamInviteInfo(inviteId: string) {
  return get(`/api/teams/invites/${inviteId}`, {}, {}, true)
}

export function getTeamMembers(teamId: string) {
  return get<TeamMemberResponse>(`/api/teams/${teamId}/members`)
}

export function createTeamInviteLink(
  teamId: string,
  inviterUserId: string,
  outdateType: TeamInviteLinkOutdateType,
  targetUserId?: string
) {
  return post<string>(`/api/teams/invites/${teamId}`, {
    inviterUserId,
    targetUserId,
    outdateType,
  })
}

export function getTeamInvites(teamId: string) {
  return get<TeamInviteWithUserProfile[]>(`/api/teams/invites/manage/${teamId}`)
}

export function acceptTeamInvite(inviteId: string) {
  return post<boolean>(`/api/teams/invites/${inviteId}/accept`, {})
}

export function updateTeamInviteRemark(teamId: string, teamInviteId: string, remark: string) {
  return post<boolean>(`/api/teams/invites/manage/${teamId}/remark/${teamInviteId}`, { remark })
}

export function toggleTeamInviteStatus(teamId: string, teamInviteId: string) {
  return post<boolean>(`/api/teams/invites/manage/${teamId}/toggle/${teamInviteId}`)
}

export function deleteTeamInvite(teamId: string, teamInviteId: string) {
  return post<boolean>(`/api/teams/invites/manage/${teamId}/delete/${teamInviteId}`)
}