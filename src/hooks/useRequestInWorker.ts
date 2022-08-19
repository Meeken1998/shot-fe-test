import axios, { Method } from 'axios'

export interface SuccessResponse<T> {
  code?: 200
  message?: string
  data: T
}

type RequestFn = <T = any>(url: string, data?: any) => Promise<T>

export default (token: string, isDev: boolean) => {
  if (!isDev) {
    axios.defaults.baseURL = 'https://storyboard-api.aside.fun'
  }
  axios.interceptors.response.use((res) => {
    if (res?.data?.code) {
      if (res.data.code !== 200) {
        console.error(res?.data?.message || '网络错误')
        return null
      }
      return res?.data?.data
    }
    return res
  })
  async function request<T>(method: Method, url: string, data: any): Promise<T> {
    const res = await axios({
      method,
      url,
      data,
      headers: {
        authentication: `Bearer ${token}`,
      },
    })
    return res as unknown as T
  }

  const post: RequestFn = (url, data) => request('POST', url, data)
  const get: RequestFn = (url, data) => request('GET', url, data)

  return { client: axios, post, get }
}
