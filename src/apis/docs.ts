import useRequest from '@/hooks/useRequest'

const { post, get } = useRequest()

export interface Docs {
  _id: string
  createdTimestamp: number
  updatedTimestamp: number
  teamId: string
  ownerUserId: string
  memberUserIds: string[]
  previewImageUrl: string
  name: string
  json: string
}

export function createDocs(teamId: string) {
  return post<Docs>('/api/docs', { teamId })
}

export function updateSlide(docsId: string, json: string, previewImageUrl?: string) {
  return post<Docs>(`/api/docs/${docsId}/update`, {
    json,
    previewImageUrl,
  })
}

export function getDocs(docsId: string) {
  return get<Docs>(`/api/docs/${docsId}`, {})
}