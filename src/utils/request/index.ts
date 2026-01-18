import { merge } from 'lodash'
import configs from '@/config'
import { Axios } from './axios'
import { ContentTypeEnum, RequestCodeEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import type { AxiosHooks } from './type'
import { clearAuthInfo, getToken } from '../auth'
import feedback from '../feedback'
import NProgress from 'nprogress'
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import router from '@/router'
import { PageEnum } from '@/enums/pageEnum'

const statusToMessageMap = {
  400: '请求错误',
  401: '请求未授权',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP 版本不受支持'
}

// 处理axios的钩子函数
const axiosHooks: AxiosHooks = {
  requestInterceptorsHook(config) {
    NProgress.start()
    const { withToken, isParamsToData } = config.requestOptions
    const params = config.params || {}
    const headers = config.headers || {}

    // 添加token
    if (withToken) {
      headers.Authorization = 'Bearer ' + getToken()
    }
    // POST请求下如果无data，则将params视为data
    if (isParamsToData && !Reflect.has(config, 'data') && config.method?.toUpperCase() === RequestMethodsEnum.POST) {
      config.data = params
      config.params = {}
    }
    config.headers = headers
    return config
  },
  requestInterceptorsCatchHook(err) {
    NProgress.done()
    return err
  },
  async responseInterceptorsHook(resp: AxiosResponse) {
    NProgress.done()
    const { isTransformResponse, isReturnDefaultResponse } = resp.config.requestOptions
    //返回默认响应，当需要获取响应头及其他数据时可使用
    if (isReturnDefaultResponse) {
      return resp
    }
    return resp.data
  },
  responseInterceptorsCatchHook(error) {
    NProgress.done()
    const resp = error.response
    const status = resp.status
    let message = resp.data
    if (status === 401) {
      // TODO D:\git\huava-vue3-deprecated\src\utils\service.ts
      feedback.msgError('401 status TODO')
      return Promise.reject(resp)
    }
    if (!message || typeof message !== 'string' || message.trim().length <= 0) {
      message = statusToMessageMap[status] || '未知错误'
    }
    feedback.msgError(message)
    return Promise.reject(resp)
  }
}

const defaultOptions: AxiosRequestConfig = {
  //接口超时时间
  timeout: configs.timeout,
  // 基础接口地址
  baseURL: configs.baseUrl,
  //请求头
  headers: { 'Content-Type': ContentTypeEnum.JSON, version: configs.version },
  // 处理 axios的钩子函数
  axiosHooks: axiosHooks,
  // 每个接口可以单独配置
  requestOptions: {
    // 是否将params视为data参数，仅限post请求
    isParamsToData: true,
    //是否返回默认的响应
    isReturnDefaultResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // 接口拼接地址
    urlPrefix: configs.urlPrefix,
    // 忽略重复请求
    ignoreCancelToken: false,
    // 是否携带token
    withToken: true,
    // 开启请求超时重新发起请求请求机制
    isOpenRetry: true,
    // 重新请求次数
    retryCount: 2
  }
}

function createAxios(opt?: Partial<AxiosRequestConfig>) {
  return new Axios(
    // 深度合并
    merge(defaultOptions, opt || {})
  )
}

const request = createAxios()
export default request
