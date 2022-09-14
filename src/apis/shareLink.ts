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
  createdTimestamp: number
  updatedTimestamp: number
}

export function createDocsShareLink(docsId: string, resourceActions: string[], name?: string) {
  return post<ShareLink>(`/api/share/docs/${docsId}`, {
    resourceActions,
    name,
  })
}

export function getDocsShareLinks(docsId: string) {
  return get<ShareLink[]>(`/api/share/docs/${docsId}`)
}