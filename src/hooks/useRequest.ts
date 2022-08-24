import { message } from 'ant-design-vue'
import axios, { Method } from 'axios'

export interface SuccessResponse<T> {
  code?: 200
  message?: string
  data: T
}

type RequestFn = <T = any>(url: string, data?: any, headers?: Record<string, string>) => Promise<T>

export const HTTP_SERVICE_ENDPOINT = process.env.NODE_ENV !== 'development' ? 'https://storyboard-api.aside.fun' : 'http://localhost:3000'
export const WS_SERVICE_ENDPOINT = process.env.NODE_ENV !== 'development' ? 'wss://storyboard-api.aside.fun' : 'ws://localhost:3000'

export default () => {
  if (process.env.NODE_ENV !== 'development') {
    axios.defaults.baseURL = 'https://storyboard-api.aside.fun'
  }
  axios.interceptors.response.use((res) => {
    if (res?.data?.code) {
      if (res.data.code !== 200) {
        message.warning(res?.data?.message || '网络错误')
        return null
      }
      return res?.data?.data
    }
    return res
  })
  async function request<T>(method: Method, url: string, data: any, headers?: Record<string, string>): Promise<T> {
    const token = localStorage.getItem('token')
    const res = await axios({
      method,
      url,
      data,
      headers: {
        authentication: `Bearer ${token}`,
        ...headers,
      },
    })
    return res as unknown as T
  }

  const post: RequestFn = (url, data, headers) => request('POST', url, data, headers)
  const get: RequestFn = (url, data, headers) => request('GET', url, data, headers)

  return { client: axios, post, get }
}
