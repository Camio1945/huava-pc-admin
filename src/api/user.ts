import config from '@/config'
import request from '@/utils/request'
import { getRefreshToken } from '@/utils/auth'

// 登录
export function login(params: Record<string, any>) {
  return request.post(
    {
      url: '/sys/user/login',
      params: { ...params, terminal: config.terminal }
    },
    { withToken: false }
  )
}

// 退出登录
export function logout() {
  return request.post({
    url: '/sys/user/logout',
    data: getRefreshToken(),
    headers: { 'Content-Type': 'text/plain' }
  })
}

// 用户信息
export function getUserInfo() {
  return request.get({ url: '/sys/user/myself' })
}

// 编辑管理员信息
export function setUserInfo(params: any) {
  return request.post({ url: '/auth.admin/editSelf', params })
}
