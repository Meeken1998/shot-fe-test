import useRequest, { SuccessResponse } from '@/hooks/useRequest'

const { get } = useRequest()

export function getQiniuUploadToken() {
  return get<string>('/api/files/token', {})
}