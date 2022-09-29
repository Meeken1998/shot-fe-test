import { message } from 'ant-design-vue'
import axios, { Method } from 'axios'

export interface SuccessResponse<T> {
  code?: 200
  message?: string
  data: T
}

type RequestFn = <T = any>(url: string, data?: any, headers?: Record<string, string>, returnOrigin?: boolean) => Promise<T>

export default () => {
  if (process.env.NODE_ENV !== 'development') {
    axios.defaults.baseURL = 'http://ppt-loader.aside.fun'
  }
  axios.interceptors.response.use((res) => {
    if (res?.data?.code) {
      if (res.data.code !== 200) {
        message.warning(res?.data?.message || '网络错误')
        return res.data || null
      }
      return res?.data
    }
    return res
  })
  async function request<T>(method: Method, url: string, data: any, headers?: Record<string, string>): Promise<T> {
    const clientHeaders: Record<string, string> = {}
    const token = localStorage.getItem('token')
    if (token) clientHeaders['authentication'] = `Bearer ${token}`

    const teamId = localStorage.getItem('team')
    if (teamId) clientHeaders['team'] = teamId
  
    const res = await axios({
      method,
      url,
      data,
      headers: {
        ...clientHeaders,
        ...headers,
      },
    })
    return res as unknown as T
  }

  const post: RequestFn = async (url, data, headers, returnOrigin) => {
    const res = await request('POST', url, data, headers) as any
    return returnOrigin ? res : res?.data
  }
  const get: RequestFn = async (url, data, headers, returnOrigin) => {
    const res = await request('GET', url, data, headers) as any
    return returnOrigin ? res : res?.data
  }

  return { client: axios, post, get }
}
