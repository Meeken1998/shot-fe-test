import useRequest from '@/hooks/useRequest'

const { post, get } = useRequest()

export type AtLeastOneArray<T> = [T, ...T[]]

export enum ShareLinkResourceType {
  DOCS = 'docs',
}

export interface ShareLink {
  _id: string
  name: string
  creatorUserId: string
  targetUserIds?: string[]
  authedUserIds: string[]
  teamId: string
  type: ShareLinkResourceType
  typeId: string
  resourceActions: AtLeastOneArray<string>
  enabled: boolean
  configs?: {
    autoplay: boolean
  }
  createdTimestamp: number
  updatedTimestamp: number
}

export function createDocsShareLink(docsId: string, resourceActions: string[], name?: string, autoplay?: boolean, targetUserIds?: string[]) {
  const payload: Record<string, any> = {
    resourceActions,
    name,
    targetUserIds,
  }
  if (typeof autoplay !== 'undefined') {
    payload.configs = {
      autoplay,
    }
  }
  return post<ShareLink>(`/api/share/docs/${docsId}`, payload)
}

export function getDocsShareLinks(docsId: string) {
  return get<ShareLink[]>(`/api/share/docs/${docsId}`)
}

export function updateDocsShareLink(linkId: string, data: Partial<ShareLink>) {
  return post<ShareLink>(`/api/share/${linkId}/update`, data)
}

export function deleteDocsShareLink(linkId: string) {
  return post<boolean>(`/api/share/${linkId}/delete`)
}

export function getShareLink(linkId: string) {
  return get<ShareLink>(`/api/share/${linkId}`)
}