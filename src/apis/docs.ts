import useRequest from '@/hooks/useRequest'
import useRequestToCSharp from '@/hooks/useRequestToCSharp'
import { User } from 'authing-js-sdk'
import { ShareLink } from './shareLink'

const { post, get } = useRequest()
const { post: cSharpServicePost } = useRequestToCSharp()

export type DocsType = 'pdf' | 'ppt'

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
  type: DocsType
  url: string // for pdf
}

export enum DocsConvertProcessStatus {
  PENDING = 0,
  CONVERTING = 1,
  FINISHED = 2,
  FAIL = 3,
}

export enum DocsUserViewEvent {
  OPEN = 1,
  SWITCH_SLIDE = 2,
  BLUR = 3,
  FOCUS = 4,
  CLOSE = 5,
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

export type DocsViewEventPayload = {
  docsId: string
  currentSlideIndex: number
  totalSlides: number
  event: DocsUserViewEvent
  shareLinkId?: string
  timestamp?: number
}

export type DocsAnalysisInfo = {
  _id: string
  userId: string
  visitStartTimestamp: number
  visits: { [slideIndex: number]: number }
  readPercent: number
  userInfo: Partial<User>
  keepMs: number
}

export type DocsLinkAnalysisInfo = {
  shareLinkId: string
  shareLinkInfo: Partial<ShareLink>
  visitors: DocsAnalysisInfo[]
}

export function createDocs(teamId: string, name: string, type: DocsType) {
  return post<Docs>('/api/docs', { teamId, type, name })
}

export function updateDocs(docsId: string, previewImageUrl: string, type: DocsType, data: string) {
  const payload: Record<string, string | undefined> = {
    previewImageUrl,
    json: '',
  }
  if (type === 'ppt') {
    payload.json = data
  }
  if (type === 'pdf') {
    payload.url = data
  }
  return post<Docs>(`/api/docs/${docsId}/update`, payload)
}

export function getDocs(docsId: string) {
  return get<Docs>(`/api/docs/${docsId}`, {})
}

export async function uploadPptDocs(file: File) {
  const uploadTokenRes = await post<DocsConvertProcess>('/api/docs/upload/token')
  const formdata = new FormData()
  formdata.append('files', file)
  await cSharpServicePost<string>(`/csharp/upload`, formdata, {
    'Content-Type': 'multipart/form-data',
    'token': uploadTokenRes._id
  })
  return uploadTokenRes
}

export function updateDocsMeta(docsId: string, name: string) {
  return post<boolean>(`/api/docs/${docsId}/meta`, {
    name,
  })
}

export function getDocsConvertProgress(docsId: string) {
  return get<DocsConvertProcess>(`/api/docs/${docsId}/progress`)
}

export function reportDocsViewEvent(opt: DocsViewEventPayload) {
  return post(`/api/docs/${opt.docsId}/view`, opt)
}

export function getDocsUserAnalysis(docsId: string) {
  return get<DocsAnalysisInfo[]>(`/api/docs/${docsId}/analysis/users`)
}

export function getDocsLinkAnalysis(docsId: string) {
  return get<DocsLinkAnalysisInfo[]>(`/api/docs/${docsId}/analysis/links`)
}

export function getDocsAnalysisBrief(docsId: string) {
  return get<{
    pagePercentMetrics: Record<number, number>
    pageReadingMsMetrics: Record<number, number>
  }>(`/api/docs/${docsId}/analysis/brief`)
}

export function deleteDocs(docsId: string) {
  return post<boolean>(`/api/docs/${docsId}/delete`)
}
