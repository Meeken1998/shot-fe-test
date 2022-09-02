import { getQiniuUploadToken } from '@/apis/upload'
import * as qiniu from 'qiniu-js'

export default () => {
  const getToken = async () => {
    const token = await getQiniuUploadToken()
    return token
  }

  const uploadFile = async (
    file: File,
    fileKey: string,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; key: string; hash: string }> => {
    const token = await getToken()
    const observable = qiniu.upload(file as File, fileKey, token)
    return new Promise((resolve, reject) => {
      observable.subscribe({
        next: (res: any) => {
          const { percent } = (res?.total || {}) as Record<string, number>
          onProgress?.(percent)
        },
        complete: (res: Record<string, string>) => {
          const { key, hash } = res
          // TODO: to config constant
          const url = `https://static.aside.fun/${key}`
          resolve({
            key,
            hash,
            url,
          })
        },
        error: reject,
      })
    })
  }

  return { getToken, uploadFile }
}
