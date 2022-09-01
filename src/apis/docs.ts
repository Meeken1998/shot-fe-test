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

export enum DocsConvertProcessStatus {
  PENDING = 0,
  CONVERTING = 1,
  STORAGING = 2,
  FINISHED = 3,
  FAIL = 4,
}

export interface DocsConvertProcess {
  _id: string
  docsId: string
  teamId: string
  // 0 - 100
  progress: number
  status: DocsConvertProcessStatus
  createdTimestamp: number
  updatedTimestamp: number
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

export function uploadDocs(teamId: string, file: File) {
  const formdata = new FormData()
  formdata.append('file', file)
  return post<string>(`/api/docs/upload/${teamId}/ppt`, formdata, {
    'Content-Type': 'multipart/form-data',
  })
}

export function updateDocsMeta(docsId: string, name: string) {
  return post<boolean>(`/api/docs/${docsId}/meta`, {
    name,
  })
}

export function getDocsConvertProgress(docsId: string) {
  return get<DocsConvertProcess>(`/api/docs/${docsId}/progress`)
}
