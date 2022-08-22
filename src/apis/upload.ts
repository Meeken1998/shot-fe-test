import useRequest from '@/hooks/useRequest'

const { get } = useRequest()

export function getQiniuUploadToken() {
  return get<string>('/api/medias/token', {})
}
