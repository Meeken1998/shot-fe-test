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

export function createDocsShareLink(docsId: string, resourceActions: string[], name?: string, autoplay?: boolean) {
  const payload: Record<string, any> = {
    resourceActions,
    name,
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
