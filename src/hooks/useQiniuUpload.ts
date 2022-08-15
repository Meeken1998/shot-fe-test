import { getQiniuUploadToken } from '@/apis/upload'

export default () => {
  const getToken = async () => {
    const token = await getQiniuUploadToken()
    return token
  }

  return { getToken }
}