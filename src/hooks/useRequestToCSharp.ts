import { message } from 'ant-design-vue'
import { Method, Axios } from 'axios'

export interface SuccessResponse<T> {
  code?: 200
  message?: string
  data: T
}

type RequestFn = <T = any>(
  url: string,
  data?: any,
  headers?: Record<string, string>,
  returnOrigin?: boolean
) => Promise<T>

export default () => {
  const axios = new Axios({
    baseURL: process.env.NODE_ENV !== 'development' ? 'https://ppt-loader.aside.fun' : '',
  })

  async function request<T>(method: Method, url: string, data: any, headers?: Record<string, string>): Promise<T> {
    const clientHeaders: Record<string, string> = {
      // 'Content-Type': 'application/json'
    }
    const token = localStorage.getItem('token')
    if (token) clientHeaders['authentication'] = `Bearer ${token}`

    const teamId = localStorage.getItem('team')
    if (teamId) clientHeaders['team'] = teamId

    if (process.env.NODE_ENV !== 'development') {
      url = url.replace('/csharp/', '/api/')
    }

    const res = await axios.request({
      method,
      url,
      data,
      headers: {
        ...clientHeaders,
        ...headers,
      },
    })
    return res.data as T
  }

  const post: RequestFn = async (url, data, headers, returnOrigin) => {
    const res = (await request('POST', url, data, headers)) as any
    return returnOrigin ? res : res?.data
  }
  const get: RequestFn = async (url, data, headers, returnOrigin) => {
    const res = (await request('GET', url, data, headers)) as any
    return returnOrigin ? res : res?.data
  }

  return { client: axios, post, get }
}
